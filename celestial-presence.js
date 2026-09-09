/* Sacred Depth: illustrative 2.5D relief, not inferred anatomical geometry.
   Existing artwork remains the accessible, no-WebGL fallback. */
(() => {
    const vertex = `attribute vec2 position; varying vec2 uv;
        void main(){ uv=position*.5+.5; gl_Position=vec4(position,0.,1.); }`;
    const fragment = `precision mediump float;
        varying vec2 uv;
        uniform sampler2D artwork;
        uniform vec2 viewport, imageSize;
        uniform float time, motion, breath, resonance;
        uniform vec3 tint;
        float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
        float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
            return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}
        float lightness(vec4 c){return dot(c.rgb,vec3(.2126,.7152,.0722))*c.a;}
        void main(){
            float aspect=viewport.x/viewport.y, picture=imageSize.x/imageSize.y;
            vec2 fit=vec2(min(1.,picture/aspect),min(1.,aspect/picture));
            vec2 p=(uv-.5)/fit+.5;
            // A smooth authored relief envelope protects faces from local warping.
            float relief=exp(-dot((p-.5)*vec2(2.5,2.),(p-.5)*vec2(2.5,2.)));
            vec2 drift=vec2(sin(time*.11),cos(time*.083))*.008*motion;
            p-=drift*(.2+.8*relief);
            vec4 base=vec4(0.);
            if(p.x>=0. && p.x<=1. && p.y>=0. && p.y<=1.) base=texture2D(artwork,p);
            vec2 texel=1./imageSize;
            float dx=lightness(texture2D(artwork,clamp(p+vec2(texel.x,0.),0.,1.)))-lightness(texture2D(artwork,clamp(p-vec2(texel.x,0.),0.,1.)));
            float dy=lightness(texture2D(artwork,clamp(p+vec2(0.,texel.y),0.,1.)))-lightness(texture2D(artwork,clamp(p-vec2(0.,texel.y),0.,1.)));
            vec3 normal=normalize(vec3(-dx*2.,-dy*2.,1.));
            vec3 lamp=normalize(vec3(-.55+sin(time*.09)*.12*motion,.55,1.));
            float spec=pow(max(dot(normal,normalize(lamp+vec3(0.,0.,1.))),0.),28.);
            float highlights=smoothstep(.42,.86,lightness(base));
            float sweep=exp(-pow((p.x*.8+p.y*.3-(.55+sin(time*.13)*.4*motion))/.16,2.));
            vec3 lit=base.rgb*(.96+.055*dot(normal,lamp));
            // Highlight-only moonlight; never a full-image white veil.
            lit+=vec3(.72,.84,1.)*spec*highlights*(.08+.14*sweep+.045*resonance);
            vec2 space=(uv-.5)*vec2(aspect,1.);
            float r=length(space);
            float texture=noise(space*9.+vec2(time*.018,-time*.012)*motion);
            texture=.65*texture+.35*noise(space*21.-time*.008*motion);
            float halo=exp(-pow((r-(.29+.016*breath))/.105,2.))*texture*(.23+.025*resonance);
            vec3 atmosphere=mix(vec3(.39,.52,.76),tint,.45)*halo;
            float alpha=base.a+halo*(1.-base.a);
            vec3 premult=lit*base.a+atmosphere*(1.-base.a);
            gl_FragColor=vec4(premult/max(alpha,.001),alpha);
        }`;

    class CelestialPresence {
        constructor(container, image) {
            this.container = container;
            this.image = image;
            this.canvas = document.createElement('canvas');
            this.canvas.className = 'celestial-presence';
            this.canvas.setAttribute('aria-hidden', 'true');
            container.appendChild(this.canvas);
            this.preference = matchMedia('(prefers-reduced-motion: reduce)');
            this.active = false;
            this.paused = false;
            this.time = 0;
            this.breath = 0;
            this.breathTarget = 0;
            this.resonance = 0;
            this.tint = [0.65, 0.55, 0.4];
            this.tick = this.tick.bind(this);
            this.preference.addEventListener('change', () => this.refresh());
            document.addEventListener('visibilitychange', () => this.refresh());
            image.addEventListener('load', () => { this.uploaded = null; this.refresh(); });
            image.addEventListener('error', () => this.fallback());
            this.observer = new MutationObserver(() => {
                if (this.uploaded !== image.src) { this.uploaded = null; this.fallback(); this.refresh(); }
            });
            this.observer.observe(image, { attributes: true, attributeFilter: ['src'] });
            this.resizeObserver = new ResizeObserver(() => { this.rect = null; this.refresh(); });
            this.resizeObserver.observe(container);
            this.canvas.addEventListener('webglcontextlost', event => {
                event.preventDefault(); this.lost = true; this.fallback();
            });
            this.canvas.addEventListener('webglcontextrestored', () => {
                this.lost = false; this.gl = null; this.uploaded = null; this.refresh();
            });
        }
        initialize() {
            if (this.gl) return true;
            const gl = this.canvas.getContext('webgl', { alpha: true, antialias: false, depth: false, premultipliedAlpha: false });
            if (!gl) return false;
            const compile = (type, source) => {
                const shader = gl.createShader(type);
                gl.shaderSource(shader, source); gl.compileShader(shader);
                if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); throw new Error('Shader unavailable'); }
                return shader;
            };
            const vs = compile(gl.VERTEX_SHADER, vertex), fs = compile(gl.FRAGMENT_SHADER, fragment);
            const program = gl.createProgram();
            gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
            gl.deleteShader(vs); gl.deleteShader(fs);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { gl.deleteProgram(program); return false; }
            gl.useProgram(program);
            const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
            const position = gl.getAttribLocation(program, 'position');
            gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
            this.uniforms = Object.fromEntries(['artwork','viewport','imageSize','time','motion','breath','resonance','tint'].map(name => [name, gl.getUniformLocation(program, name)]));
            this.texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, this.texture);
            for (const parameter of [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T]) gl.texParameteri(gl.TEXTURE_2D, parameter, gl.CLAMP_TO_EDGE);
            for (const parameter of [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER]) gl.texParameteri(gl.TEXTURE_2D, parameter, gl.LINEAR);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.uniform1i(this.uniforms.artwork, 0);
            this.gl = gl;
            return true;
        }
        setActive(active, color) {
            this.active = active;
            if (/^#[0-9a-f]{6}$/i.test(color || '')) this.tint = [1,3,5].map(i => parseInt(color.slice(i,i+2),16)/255);
            if (!active) {
                this.breath = 0; this.breathTarget = 0; this.paused = false;
                this.releaseAnalyser();
            }
            this.refresh();
        }
        setPaused(paused) { this.paused = paused; this.refresh(); }
        setAudio(audio) { this.audio = audio; }
        releaseAnalyser() {
            if (!this.analyser) return;
            this.audio.mantraGain.disconnect(this.analyser);
            this.analyser.disconnect();
            this.analyser = null;
            this.samples = null;
            this.resonance = 0;
        }
        sampleAudio(dt) {
            if (!this.analyser && this.audio?.ctx && this.audio.mantraGain) {
                this.analyser = this.audio.ctx.createAnalyser();
                this.analyser.fftSize = 256;
                this.audio.mantraGain.connect(this.analyser);
                this.samples = new Uint8Array(256);
            }
            if (!this.analyser) return;
            this.analyser.getByteTimeDomainData(this.samples);
            let sum = 0;
            for (const value of this.samples) sum += ((value-128)/128) ** 2;
            const target = Math.min(1, Math.sqrt(sum/this.samples.length)*6);
            // Two-second smoothing, no gain changes or microphone access.
            this.resonance += (target-this.resonance)*(1-Math.exp(-dt/2));
        }
        setBreath(scale, seconds) {
            this.breathTarget = Math.max(0, Math.min(1, (Number(scale)-1)/.5));
            this.breathSeconds = Math.max(.1, Number(seconds) || 4);
        }
        fallback() {
            clearTimeout(this.timer); this.timer = null;
            cancelAnimationFrame(this.frame); this.frame = null;
            this.releaseAnalyser();
            this.container.classList.remove('presence-ready');
        }
        refresh() {
            clearTimeout(this.timer); this.timer = null;
            cancelAnimationFrame(this.frame); this.frame = null; this.last = null;
            if (!this.active || this.lost) { this.fallback(); return; }
            if (document.hidden || this.paused || this.preference.matches) this.releaseAnalyser();
            if (document.hidden) return;
            this.tick(performance.now());
        }
        tick(now) {
            this.frame = null;
            if (!this.active || document.hidden || this.lost) return;
            const dt = this.last == null ? 0 : Math.min(.1,(now-this.last)/1000);
            this.last = now;
            try {
                if (!this.image.complete || !this.image.naturalWidth || !this.initialize()) { this.fallback(); return; }
                const gl = this.gl, u = this.uniforms;
                if (this.uploaded !== this.image.src) {
                    if (Math.max(this.image.naturalWidth,this.image.naturalHeight) > gl.getParameter(gl.MAX_TEXTURE_SIZE)) { this.fallback(); return; }
                    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,this.image);
                    this.uploaded = this.image.src;
                }
                const rect = this.rect || (this.rect = this.canvas.getBoundingClientRect());
                const ratio = Math.min(devicePixelRatio || 1,1.25,960/Math.max(rect.width,rect.height,1));
                const width = Math.max(1,Math.round(rect.width*ratio)), height = Math.max(1,Math.round(rect.height*ratio));
                if (this.canvas.width !== width || this.canvas.height !== height) { this.canvas.width=width; this.canvas.height=height; }
                const moving = !this.preference.matches && !this.paused;
                if (moving) {
                    this.time += dt;
                    this.sampleAudio(dt);
                    this.breath += Math.sign(this.breathTarget-this.breath)*Math.min(Math.abs(this.breathTarget-this.breath),dt/(this.breathSeconds || 4));
                }
                gl.viewport(0,0,width,height);
                gl.uniform2f(u.viewport,width,height); gl.uniform2f(u.imageSize,this.image.naturalWidth,this.image.naturalHeight);
                gl.uniform1f(u.time,this.time); gl.uniform1f(u.motion,this.preference.matches ? 0 : 1);
                gl.uniform1f(u.breath,this.breath || .5+.5*Math.sin(this.time*.4));
                gl.uniform1f(u.resonance,this.preference.matches ? 0 : this.resonance);
                gl.uniform3fv(u.tint,this.tint);
                gl.drawArrays(gl.TRIANGLES,0,6);
                this.container.classList.add('presence-ready');
                if (moving) this.timer = setTimeout(() => {
                    this.timer = null;
                    if (this.active && !document.hidden && !this.paused && !this.preference.matches && !this.lost) {
                        this.frame = requestAnimationFrame(this.tick);
                    }
                }, 33);
            } catch (error) { this.fallback(); }
        }
    }
    window.CelestialPresence = CelestialPresence;
})();
