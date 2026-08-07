# Piper runtime notices

This directory vendors the browser runtime needed for local Piper narration:

- `piper-tts-web.js` and its bundled phonemizer runtime originate from the MIT-licensed `@mintplex-labs/piper-tts-web` package.
- `ort.min.js` and the ONNX Runtime Web WASM binary originate from ONNX Runtime Web and retain the upstream MIT licensing terms.
- Voice models are fetched lazily from the `rhasspy/piper-voices` Hugging Face repository and are not committed to this repository. Review each model card and license before redistribution or production packaging.

The registry in `../piper-models.json` records the source path, model size, and upstream LFS object identifier for the supported voices. These identifiers are provenance metadata; browser release validation must still confirm the downloaded bytes and the applicable voice license.
