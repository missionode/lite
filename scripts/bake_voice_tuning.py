#!/usr/bin/env python3
"""Bake a Voice Tuner export into a copy of a Piper voice.

What goes INTO the voice files:
  * speed / expressiveness / rhythm  -> voice.onnx.json "inference" defaults
  * warmth, clarity, air and volume  -> one linear-phase FIR filter (plus a
    [-1, 1] clip guard) appended after the model's audio output in voice.onnx
What cannot go into ONNX (written to app-side.json for the app's sound chain):
  * pitch, noise cleaner (and later: formants, breathiness, compression)

The FIR reproduces the tuner's Web Audio filters (RBJ peaking at 250 Hz Q0.9,
peaking at 2300 Hz Q0.8, high shelf at min(8000, 0.36 * rate)) as magnitude,
with zero phase, so the audio keeps its timing. Run with the TTS project's
environment, which has onnx, onnxruntime, numpy and scipy:

  ~/Desktop/Ikigai/TTS/.venv-asr/bin/python scripts/bake_voice_tuning.py \\
      --tuning voice-tuning-2026-10-12.json --voice ml_IN-syam-custom \\
      --model piper/models/ml/ml_IN/syam/custom/voice.onnx \\
      --config piper/models/ml/ml_IN/syam/custom/voice.onnx.json \\
      --out /tmp/syam-tuned

The original files are never changed; review the output, then copy it in.
"""
import argparse
import json
import math
from pathlib import Path

import numpy as np
import onnx
from onnx import helper, numpy_helper, TensorProto
from scipy.signal import freqz

TAPS = 1023  # odd -> symmetric, linear phase; ~43 Hz resolution at 22050 Hz


def peaking(freq, q, gain_db, rate):
    a = 10 ** (gain_db / 40)
    w0 = 2 * math.pi * freq / rate
    alpha = math.sin(w0) / (2 * q)
    b = [1 + alpha * a, -2 * math.cos(w0), 1 - alpha * a]
    den = [1 + alpha / a, -2 * math.cos(w0), 1 - alpha / a]
    return np.array(b) / den[0], np.array(den) / den[0]


def high_shelf(freq, gain_db, rate):
    # Web Audio high shelf (slope S = 1).
    a = 10 ** (gain_db / 40)
    w0 = 2 * math.pi * freq / rate
    alpha = math.sin(w0) / 2 * math.sqrt(2)
    cos = math.cos(w0)
    b = [a * ((a + 1) + (a - 1) * cos + 2 * math.sqrt(a) * alpha), -2 * a * ((a - 1) + (a + 1) * cos), a * ((a + 1) + (a - 1) * cos - 2 * math.sqrt(a) * alpha)]
    den = [(a + 1) - (a - 1) * cos + 2 * math.sqrt(a) * alpha, 2 * ((a - 1) - (a + 1) * cos), (a + 1) - (a - 1) * cos - 2 * math.sqrt(a) * alpha]
    return np.array(b) / den[0], np.array(den) / den[0]


def target_magnitude(tuning, rate, bins):
    """Combined magnitude of the tuner's filters and volume at `bins` frequencies (0..Nyquist)."""
    magnitude = np.ones(bins)
    for b, a in (peaking(250, 0.9, tuning.get('warmth', 0), rate),
                 peaking(2300, 0.8, tuning.get('clarity', 0), rate),
                 high_shelf(min(8000, rate * 0.36), tuning.get('air', 0), rate)):
        _, response = freqz(b, a, worN=bins, fs=rate)
        magnitude *= np.abs(response)
    return magnitude * 10 ** (tuning.get('volume', 0) / 20)


def design_fir(tuning, rate, taps=TAPS):
    """Linear-phase FIR by frequency sampling of the target magnitude (Hann window)."""
    n_fft = 8 * taps
    magnitude = target_magnitude(tuning, rate, n_fft // 2 + 1)
    impulse = np.fft.irfft(magnitude, n_fft)
    impulse = np.roll(impulse, taps // 2)[:taps] * np.hanning(taps)
    return impulse.astype(np.float32)


def append_filter(model, fir):
    """Audio output (Piper web runs batch 1; real shape [1,1,1,T]) -> [1,1,T] ->
    Conv1D(FIR, same length) -> clip -> back to the original output shape."""
    graph = model.graph
    out_name = graph.output[0].name
    raw = 'raw_' + out_name
    for node in graph.node:
        node.output[:] = [raw if name == out_name else name for name in node.output]
    taps = len(fir)
    graph.initializer.extend([
        numpy_helper.from_array(fir.reshape(1, 1, taps), 'tuning_fir'),
        numpy_helper.from_array(np.array([1, 1, -1], dtype=np.int64), 'tuning_wave_shape'),
        numpy_helper.from_array(np.array(-1.0, dtype=np.float32), 'tuning_clip_min'),
        numpy_helper.from_array(np.array(1.0, dtype=np.float32), 'tuning_clip_max'),
    ])
    graph.node.extend([
        helper.make_node('Shape', [raw], ['tuning_original_shape']),
        helper.make_node('Reshape', [raw, 'tuning_wave_shape'], ['tuning_wave']),
        # Conv is cross-correlation; the FIR is symmetric, so this is the same filter.
        helper.make_node('Conv', ['tuning_wave', 'tuning_fir'], ['tuning_filtered'], pads=[taps // 2, taps // 2]),
        helper.make_node('Clip', ['tuning_filtered', 'tuning_clip_min', 'tuning_clip_max'], ['tuning_clipped']),
        helper.make_node('Reshape', ['tuning_clipped', 'tuning_original_shape'], [out_name]),
    ])
    return model


def verify(original_path, baked_bytes, fir, config):
    """Same phonemes with zero randomness: baked output must equal FIR(original output)."""
    import onnxruntime as ort
    ids = [value[0] for key, value in sorted(config['phoneme_id_map'].items()) if key.isalpha()][:24]
    feeds = {'input': np.array([[1] + ids + [2]], dtype=np.int64), 'input_lengths': np.array([len(ids) + 2], dtype=np.int64),
             'scales': np.array([0.0, 1.0, 0.0], dtype=np.float32)}
    original = ort.InferenceSession(str(original_path)).run(None, feeds)[0].reshape(-1)
    baked = ort.InferenceSession(baked_bytes).run(None, feeds)[0].reshape(-1)
    expected = np.clip(np.convolve(original, fir, mode='same'), -1, 1)
    return {'samples': int(len(baked)), 'sameLength': len(baked) == len(original), 'maxDifference': float(np.max(np.abs(baked - expected)))}


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--tuning', required=True, help='Voice Tuner export (schema 1)')
    parser.add_argument('--voice', required=True, help='voice id inside the export, e.g. ml_IN-syam-custom')
    parser.add_argument('--model', required=True, help='original voice.onnx')
    parser.add_argument('--config', required=True, help='original voice.onnx.json')
    parser.add_argument('--out', required=True, help='new folder for the tuned copy')
    args = parser.parse_args()

    export = json.loads(Path(args.tuning).read_text(encoding='utf-8'))
    if export.get('schema') != 1 or args.voice not in export.get('voices', {}):
        raise SystemExit(f'No schema-1 tuning for {args.voice} in {args.tuning}')
    tuning = export['voices'][args.voice]
    config = json.loads(Path(args.config).read_text(encoding='utf-8'))
    rate = int(config['audio']['sample_rate'])

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    # 1) Model settings -> inference defaults.
    config['inference'] = {
        'noise_scale': round(float(tuning['noiseScale']), 3),
        'length_scale': round(float(tuning['lengthScale']), 3),
        'noise_w': round(float(tuning['noiseW']), 3),
    }
    (out / 'voice.onnx.json').write_text(json.dumps(config, ensure_ascii=False, indent=2), encoding='utf-8')

    # 2) Tone and volume -> FIR inside the model (skipped when all are 0).
    tone_keys = ('warmth', 'clarity', 'air', 'volume')
    model = onnx.load(args.model)
    report = {'voice': args.voice, 'inference': config['inference'], 'baked': {k: tuning.get(k, 0) for k in tone_keys}}
    if any(abs(float(tuning.get(k, 0))) > 1e-9 for k in tone_keys):
        fir = design_fir(tuning, rate)
        model = append_filter(model, fir)
        onnx.checker.check_model(model)
        baked = model.SerializeToString()
        report['firTaps'] = len(fir)
        report['check'] = verify(args.model, baked, fir, config)
        (out / 'voice.onnx').write_bytes(baked)
    else:
        (out / 'voice.onnx').write_bytes(model.SerializeToString())
        report['firTaps'] = 0

    # 3) Not ONNX-able -> app-side settings for the app's sound chain.
    app_side = {k: tuning.get(k, 0) for k in ('pitch', 'cleaner')}
    (out / 'app-side.json').write_text(json.dumps({'voice': args.voice, 'appSide': app_side}, indent=2), encoding='utf-8')
    report['appSide'] = app_side
    (out / 'bake-report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    main()
