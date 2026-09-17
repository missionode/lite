// Cached catalogue stars projected for the same observer as the named bodies.
// Only a bounded bright subset scintillates. No per-frame astronomy or noise.
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

    resize(width, height, dpr, catalog = [], sunAltitude = -18) {
        this.width = width;
        this.height = height;
        this.dpr = dpr;
        this.background.width = Math.round(width * dpr);
        this.background.height = Math.round(height * dpr);
        const ctx = this.background.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);
        // All stars use the same observer projection as the named bodies.
        // A restrained daytime floor preserves the cosmic chart theme.
        const darkness = Math.max(0.10, Math.min(1, (-sunAltitude + 2) / 20));
        this.stars = [];
        this.twinklingStars = [];
        for (const body of catalog) {
            if (body.altitude < 0 || body.name) continue;
            const {x, y} = SkyAstronomy.project(body.azimuth, body.altitude, width, height);
            const random = this.random(body.id);
            const brightness = Math.max(0, Math.min(1, (6 - body.magnitude) / 6));
            const color = body.color[0] < 220 ? 0 : body.color[2] > 240 ? 1 : body.color[2] > 190 ? 2 : 3;
            const star = {
                x, y, radius: 0.28 + brightness * 1.10,
                alpha: (0.16 + brightness * 0.68) * darkness,
                color, phase: random() * Math.PI * 2,
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
