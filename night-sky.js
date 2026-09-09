// A cached, procedural dark-sky backdrop. The fine star field is illustrative;
// location/time-aware named bodies are composited by AmbientParticleField.
// No textures, network requests, WebGL, or per-frame noise generation required.
class NaturalNightSky {
    constructor() {
        this.background = document.createElement('canvas');
        this.stars = [];
        this.twinklingStars = [];
        this.sprites = [];
        this.width = 0;
        this.height = 0;
        this.colors = [[218, 231, 255], [244, 245, 255], [255, 244, 224], [255, 214, 179]];
        this.createSprites();
    }

    random(seed = 712367) {
        let value = seed >>> 0;
        return () => {
            value ^= value << 13;
            value ^= value >>> 17;
            value ^= value << 5;
            return (value >>> 0) / 4294967296;
        };
    }

    noise(x, y) {
        const ix = Math.floor(x), iy = Math.floor(y);
        const fx = x - ix, fy = y - iy;
        const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
        const hash = (a, b) => {
            let h = Math.imul(a, 374761393) + Math.imul(b, 668265263);
            h = Math.imul(h ^ (h >>> 13), 1274126177);
            return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
        };
        const a = hash(ix, iy), b = hash(ix + 1, iy);
        const c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
        return (a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy;
    }

    dust(x, y) {
        return this.noise(x, y) * 0.5 + this.noise(x * 2.07 + 18, y * 2.07) * 0.27 +
            this.noise(x * 4.13, y * 4.13 + 31) * 0.15 + this.noise(x * 8.21, y * 8.21) * 0.08;
    }

    createSprites() {
        this.sprites = this.colors.map(color => {
            const sprite = document.createElement('canvas');
            sprite.width = sprite.height = 48;
            const ctx = sprite.getContext('2d');
            const rgb = color.join(',');
            const glow = ctx.createRadialGradient(24, 24, 0, 24, 24, 24);
            glow.addColorStop(0, 'rgba(255,255,255,1)');
            glow.addColorStop(0.075, `rgba(${rgb},0.94)`);
            glow.addColorStop(0.17, `rgba(${rgb},0.42)`);
            glow.addColorStop(0.38, `rgba(${rgb},0.065)`);
            glow.addColorStop(1, `rgba(${rgb},0)`);
            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, 48, 48);
            return sprite;
        });
    }

    resize(width, height, dpr) {
        this.width = width;
        this.height = height;
        this.background.width = Math.round(width * dpr);
        this.background.height = Math.round(height * dpr);
        const ctx = this.background.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);

        // Generate faint, irregular luminance and dark dust lanes only when
        // resizing. A small texture is upsampled once into the cached sky.
        const texture = document.createElement('canvas');
        texture.width = Math.min(480, Math.max(160, Math.round(width / 3)));
        texture.height = Math.max(1, Math.round(texture.width * height / width));
        // Bound portrait texture work as well as landscape work.
        if (texture.height > 480) {
            texture.width = Math.max(1, Math.round(texture.width * 480 / texture.height));
            texture.height = 480;
        }
        const textureContext = texture.getContext('2d');
        const pixels = textureContext.createImageData(texture.width, texture.height);
        for (let y = 0; y < texture.height; y++) {
            for (let x = 0; x < texture.width; x++) {
                const u = x / texture.width, v = y / texture.height;
                const bend = 0.64 - u * 0.52 + Math.sin(u * 4.8) * 0.045;
                const offset = v - bend;
                const broad = Math.exp(-offset * offset / 0.034);
                const cloud = this.dust(u * 7 + 12, v * 7 + 8);
                const fine = this.noise(u * 54, v * 54);
                const rift = Math.exp(-Math.pow(offset + (cloud - 0.5) * 0.11, 2) / 0.00065);
                const grain = Math.pow(Math.max(0, cloud - 0.18), 1.65);
                const light = broad * grain * (1 - rift * 0.77) * (0.8 + fine * 0.2);
                const i = (y * texture.width + x) * 4;
                pixels.data[i] = 151;
                pixels.data[i + 1] = 164;
                pixels.data[i + 2] = 186;
                pixels.data[i + 3] = Math.round(light * 48);
            }
        }
        textureContext.putImageData(pixels, 0, 0);
        ctx.drawImage(texture, 0, 0, width, height);

        const random = this.random();
        const count = Math.min(2400, Math.max(700, Math.round(width * height / 800)));
        this.stars = [];
        this.twinklingStars = [];
        for (let index = 0; index < count; index++) {
            const nx = random();
            const cluster = random() < 0.42;
            const band = 0.64 - nx * 0.52 + Math.sin(nx * 4.8) * 0.045;
            const ny = cluster ? band + (random() + random() + random() - 1.5) * 0.22 : random();
            const brightness = Math.pow(random(), 5);
            const colorSample = random();
            const color = colorSample < 0.19 ? 0 : colorSample < 0.77 ? 1 : colorSample < 0.96 ? 2 : 3;
            const star = {
                x: nx * width,
                y: ny * height,
                radius: 0.32 + brightness * 1.22,
                alpha: (0.14 + brightness * 0.72) * (cluster ? 0.79 : 1),
                color,
                phase: random() * Math.PI * 2,
                twinkleSpeed: 1.1 + random() * 2.4,
                twinkleDepth: 0.08 + random() * 0.18,
                isTwinkler: brightness > 0.38 && this.twinklingStars.length < 110
            };
            this.stars.push(star);
            if (star.isTwinkler) this.twinklingStars.push(star);
            else this.drawStar(ctx, star, star.alpha);
        }
        ctx.globalAlpha = 1;
    }

    drawStar(ctx, star, alpha) {
        // Point-spread glow, never rotating four-point sparkle icons.
        ctx.globalAlpha = alpha;
        const size = star.radius * 8;
        ctx.drawImage(this.sprites[star.color], star.x - size / 2, star.y - size / 2, size, size);
    }

    draw(ctx, timestamp, animate) {
        ctx.globalAlpha = 1;
        ctx.drawImage(this.background, 0, 0, this.width, this.height);
        const time = timestamp * 0.001;
        for (const star of this.twinklingStars) {
            const shimmer = animate ? 1 - star.twinkleDepth * (0.5 +
                0.34 * Math.sin(time * star.twinkleSpeed + star.phase) +
                0.16 * Math.sin(time * star.twinkleSpeed * 2.37 + star.phase * 1.71)) : 1;
            this.drawStar(ctx, star, star.alpha * shimmer);
        }
        ctx.globalAlpha = 1;
    }
}
