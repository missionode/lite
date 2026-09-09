// The bundled CLI entry point allocates stack on every call and does not
// export stack restoration. Reuse briefly, then retire the entire instance.
export class BoundedPhonemizer {
  constructor(factory, paths) {
    this.factory = factory;
    this.paths = paths;
    this.module = null;
    this.calls = 0;
    this.characters = 0;
    this.busy = false;
  }

  async phonemize(text, voice) {
    if (this.busy) throw new Error('Phonemizer requires serial requests');
    this.busy = true;
    this.output = null;
    this.error = null;
    try {
      if (this.calls >= 8 || this.characters + text.length > 8192) this.module = null;
      if (!this.module) {
        this.calls = 0;
        this.characters = 0;
        this.module = await this.factory({
          noInitialRun: true,
          print: data => {
            try { this.output = JSON.parse(data).phoneme_ids; }
            catch (error) { this.error = error; }
          },
          printErr: message => { this.error = new Error(message); },
          locateFile: url => url.endsWith('.wasm') ? this.paths.piperWasm
            : url.endsWith('.data') ? this.paths.piperData : url
        });
      }
      this.calls++;
      this.characters += text.length;
      this.module.callMain(['-l', voice, '--input', JSON.stringify([{text: text.trim()}]), '--espeak_data', '/espeak-ng-data']);
      if (!Array.isArray(this.output) || !this.output.length) {
        throw this.error || new Error('Phonemizer returned no phonemes');
      }
      return this.output;
    } catch (error) {
      this.module = null;
      throw error;
    } finally {
      this.output = null;
      this.error = null;
      this.busy = false;
    }
  }
}
