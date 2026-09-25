// Lightweight ambient star field. Most stars are tiny and cheap to redraw;
// only the brighter foreground stars receive independent scintillation so the
// sky feels alive without turning the meditation background into a spectacle.
class AmbientParticleField {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas?.getContext('2d', { alpha: true }) || null;
        this.particles = [];
        this.meteors = [];
        this.nextMeteorAt = 0;
        this.sky = new NaturalNightSky();
        this.celestialLayer = document.createElement('canvas');
        this.celestialLayerKey = null;
        this.renderTimer = null;
        this.lastCelestialRefresh = 0;
        this.cachedMoonPhase = null;
        this.motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.observer = null;
        this.celestialBodies = [];
        this.deepSkyBlackHoleEnabled = false;
        this.moonBuffer = document.createElement('canvas');
        this.moonBuffer.width = 128;
        this.moonBuffer.height = 128;
        this.moonBufferContext = this.moonBuffer.getContext('2d');
        // Populate an approximate sky immediately; a successful location
        // permission replaces this with the real observer position.
        this.setFallbackObserver();
        this.frame = 0;
        this.lastFrameAt = 0;
        this.resize = this.resize.bind(this);
        this.render = this.render.bind(this);
        this.handleVisibility = this.handleVisibility.bind(this);
        this.handleMotionChange = this.handleMotionChange.bind(this);
        this.layoutFrame = 0;
        this.invalidateSkyLayout = () => {
            this.celestialLayerKey = null;
            if (!this.started || document.hidden || this.layoutFrame) return;
            // One redraw for an actual layout event, never an idle loop.
            this.layoutFrame = requestAnimationFrame(() => {
                this.layoutFrame = 0;
                if (!document.hidden) this.draw(performance.now(), false);
            });
        };
    }

    start() {
        if (!this.canvas || !this.ctx || this.started) return;
        this.started = true;
        window.addEventListener('resize', this.resize, { passive: true });
        document.addEventListener('visibilitychange', this.handleVisibility);
        document.addEventListener('decorationchange', this.handleMotionChange);
        this.motionPreference.addEventListener('change', this.handleMotionChange);
        this.layoutObserver = new MutationObserver(this.invalidateSkyLayout);
        const mantra = document.getElementById('mantra-display');
        if (mantra) this.layoutObserver.observe(mantra, { childList: true, characterData: true, subtree: true });
        for (const element of document.querySelectorAll('.screen, #controls, body')) {
            this.layoutObserver.observe(element, { attributes: true, attributeFilter: ['class'] });
        }
        this.resize();
        this.requestObserverLocation();
        if (!this.motionPreference.matches && !document.hidden) {
            this.frame = requestAnimationFrame(this.render);
        } else {
            this.draw(performance.now(), false);
        }
    }

    setFallbackObserver() {
        this.observer = { latitude: 51.4779, longitude: 0, height: 0, approximate: true };
    }

    requestObserverLocation() {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                if (!Number.isFinite(coords.latitude) || !Number.isFinite(coords.longitude)) return;
                this.observer = { latitude: coords.latitude, longitude: coords.longitude, height: Number.isFinite(coords.altitude) ? coords.altitude : 0, approximate: false };
                this.refreshCelestialBodies();
                this.draw(performance.now(), false);
            },
            () => { /* Keep the approximate fallback sky when declined. */ },
            { enableHighAccuracy: false, maximumAge: 900000, timeout: 8000 }
        );
    }

    refreshCelestialBodies(date = new Date()) {
        if (!this.observer) return;
        if (this.skySnapshot && document.body.classList.contains('static-decorations')) return;
        // Bound retries as well as successful updates; a failed engine must
        // never turn into a per-frame calculation/error loop.
        this.lastCelestialRefresh = performance.now();
        try {
            const sky = SkyAstronomy.snapshot(date, this.observer);
            this.skySnapshot = sky;
            this.skyFailed = false;
            this.celestialDaylight = sky.sunAltitude > -6;
            this.celestialNightVisible = !this.celestialDaylight;
            this.celestialBodies = [...sky.stars.filter(star => star.name), ...sky.bodies];
            if (this.sky.width) this.sky.resize(this.sky.width, this.sky.height, this.sky.dpr, sky.stars, sky.sunAltitude);
            this.updateSkyLocationStatus();
        } catch (error) {
            this.celestialBodies = [];
            this.skySnapshot = null;
            this.skyFailed = true;
            this.celestialDaylight = false;
            if (this.sky.width) this.sky.resize(this.sky.width, this.sky.height, this.sky.dpr);
            this.updateSkyLocationStatus();
            console.warn('Sky position calculation unavailable.', error);
        }
    }

    updateSkyLocationStatus() {
        const element = document.getElementById('sky-location-status');
        if (!element || typeof state === 'undefined') return;
        const key = this.skyFailed ? 'ui.skyUnavailable' : this.observer?.approximate ? 'ui.skyReference' : 'ui.skyLocal';
        element.textContent = t(key, state.displayLanguage);
    }

    resize() {
        if (!this.canvas || !this.ctx) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const sizeKey = `${window.innerWidth}:${window.innerHeight}:${dpr}`;
        if (this.sizeKey === sizeKey) return;
        this.sizeKey = sizeKey;
        this.canvas.width = Math.round(window.innerWidth * dpr);
        this.canvas.height = Math.round(window.innerHeight * dpr);
        this.canvas.style.width = `${window.innerWidth}px`;
        this.canvas.style.height = `${window.innerHeight}px`;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (!this.skySnapshot) this.refreshCelestialBodies();
        this.sky.resize(window.innerWidth, window.innerHeight, dpr, this.skySnapshot?.stars || [], this.skySnapshot?.sunAltitude ?? -18);
        this.particles = this.sky.stars;
        this.draw(performance.now(), false);
    }

    handleMotionChange() {
        clearTimeout(this.renderTimer);
        this.renderTimer = null;
        cancelAnimationFrame(this.frame);
        this.frame = 0;
        this.meteors = [];
        this.nextMeteorAt = 0;
        this.lastFrameAt = 0;
        if (!document.hidden) {
            if (this.motionPreference.matches || document.body.classList.contains('static-decorations')) this.draw(performance.now(), false);
            else this.frame = requestAnimationFrame(this.render);
        }
    }

    handleVisibility() {
        if (document.hidden) {
            cancelAnimationFrame(this.layoutFrame);
            this.layoutFrame = 0;
            clearTimeout(this.renderTimer);
            this.renderTimer = null;
            cancelAnimationFrame(this.frame);
            this.frame = 0;
            this.meteors = [];
            this.nextMeteorAt = 0;
        } else if (document.body.classList.contains('static-decorations')) {
            this.draw(performance.now(), false);
        } else if (!this.motionPreference.matches && !this.frame && !this.renderTimer) {
            this.lastFrameAt = 0;
            this.frame = requestAnimationFrame(this.render);
        } else if (this.motionPreference.matches) {
            this.refreshCelestialBodies();
            this.draw(performance.now(), false);
        }
    }

    render(timestamp) {
        this.frame = 0;
        if (document.hidden || this.motionPreference.matches || document.body.classList.contains('static-decorations')) { this.frame = 0; return; }
        if (!this.lastFrameAt || timestamp - this.lastFrameAt >= 33) {
            this.draw(timestamp, true);
            this.lastFrameAt = timestamp;
        }
        // Sleep between draws instead of waking on every 60/120 Hz refresh.
        this.renderTimer = setTimeout(() => {
            this.renderTimer = null;
            if (!document.hidden && !this.motionPreference.matches) {
                this.frame = requestAnimationFrame(this.render);
            }
        }, 33);
    }

    draw(timestamp, animate) {
        if (!this.ctx) return;
        const width = window.innerWidth;
        const height = window.innerHeight;
        if (this.observer && !document.body.classList.contains('static-decorations') && timestamp - this.lastCelestialRefresh >= 10000) {
            this.refreshCelestialBodies();
            this.lastCelestialRefresh = timestamp;
        }
        this.ctx.clearRect(0, 0, width, height);
        const time = timestamp * 0.001;
        this.sky.draw(this.ctx, timestamp, animate);
        if (animate) this.drawMeteors(time, width, height);
        this.drawCachedCelestialBodies(width, height);
        this.ctx.shadowBlur = 0;
    }

    drawCachedCelestialBodies(width, height) {
        // Positions refresh at most once per ten seconds while animating.
        // Static journey screens have no timer. Reuse expensive gradients,
        // text measurement and blurred backings between those updates.
        const key = `${this.canvas.width}:${this.canvas.height}:${state.displayLanguage}:${this.deepSkyBlackHoleEnabled}:${document.body.classList.contains('static-decorations')}:${document.fonts?.status}`;
        if (this.celestialLayerKey !== key || this.cachedBodies !== this.celestialBodies) {
            const layer = this.celestialLayer;
            layer.width = this.canvas.width;
            layer.height = this.canvas.height;
            const target = this.ctx;
            const cached = layer.getContext('2d');
            if (!cached) { this.drawCelestialBodies(width, height); return; }
            cached.setTransform(layer.width / width, 0, 0, layer.height / height, 0, 0);
            try {
                this.ctx = cached;
                this.drawCelestialBodies(width, height);
            } finally { this.ctx = target; }
            this.celestialLayerKey = key;
            this.cachedBodies = this.celestialBodies;
        }
        this.ctx.drawImage(this.celestialLayer, 0, 0, width, height);
    }

    drawCelestialBodies(width, height) {
        if (this.celestialDaylight) {
            // Cached once per celestial refresh: a transparent indigo wash
            // keeps the application’s space identity while softening the
            // procedural field beneath the calculated daytime Sun.
            const wash = this.ctx.createLinearGradient(0, 0, 0, height);
            wash.addColorStop(0, 'rgba(35, 48, 124, 0.34)');
            wash.addColorStop(0.5, 'rgba(50, 66, 148, 0.18)');
            wash.addColorStop(1, 'rgba(5, 8, 28, 0.08)');
            this.ctx.fillStyle = wash;
            this.ctx.fillRect(0, 0, width, height);
        }
        this.drawCelestialHorizon(width, height);
        this.drawEarthIllustration(width, height);
        if (this.deepSkyBlackHoleEnabled && !document.body.classList.contains('static-decorations')) {
            this.drawDeepSkyBlackHole(width, height);
        }
        const labelBounds = [];
        this.celestialBodies.forEach((body) => {
            if (body.altitude < 0) return;
            const { x, y } = SkyAstronomy.project(body.azimuth, body.altitude, width, height);
            const moonPixelDiameter = Math.max(8, (height * 0.88 - 20) * (body.angularDiameter || 0.52) / 90);
            const size = body.kind === 'sun'
                ? moonPixelDiameter / 2
                : body.kind === 'moon'
                ? moonPixelDiameter / 2
                : body.kind === 'planet'
                    ? Math.min(1.65, Math.max(0.8, moonPixelDiameter * (body.angularDiameter / 0.52) * 0.4))
                    : Math.max(0.75, 1.65 - body.magnitude * 0.22);
            const [red, green, blue] = body.color;
            this.ctx.save();
            if (body.kind === 'star') this.ctx.globalAlpha = Math.max(0.10, Math.min(1, (2 - this.skySnapshot.sunAltitude) / 20));
            if (body.kind === 'moon') this.drawEarthMoonGuide(x, y, width, height);
            const illumination = body.kind === 'moon' ? body.illumination : 1;
            const haloRadius = body.kind === 'sun' ? size * 6 : body.kind === 'moon' ? size * 3.5 : size * 4;
            const halo = this.ctx.createRadialGradient(x, y, Math.max(0.4, size * 0.35), x, y, haloRadius);
            halo.addColorStop(0, `rgba(${red}, ${green}, ${blue}, ${body.kind === 'sun' ? 0.27 : body.kind === 'moon' ? illumination * 0.1 : 0.12})`);
            halo.addColorStop(1, `rgba(${red}, ${green}, ${blue}, 0)`);
            this.ctx.fillStyle = halo;
            this.ctx.beginPath();
            this.ctx.arc(x, y, haloRadius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.shadowBlur = body.kind === 'moon' ? 0 : 3;
            this.ctx.shadowColor = `rgba(${red}, ${green}, ${blue}, ${body.kind === 'moon' ? 0.52 : 0.72})`;
            if (body.kind === 'moon') {
                this.drawMoonWithBooleanMask(x, y, size, body.phase ?? 0.5, body.lightAngle, body.illumination);
            } else if (body.kind === 'sun') {
                this.drawSolarProtectionLayer(x, y, size);
                const sunGradient = this.ctx.createRadialGradient(x - size * 0.28, y - size * 0.28, Math.max(0.5, size * 0.08), x, y, size);
                // A soft, balanced daylight palette: warm enough to feel
                // alive, not white-hot or orange-heavy.
                sunGradient.addColorStop(0, 'rgba(255, 250, 230, 1)');
                sunGradient.addColorStop(0.42, 'rgba(255, 235, 184, 0.96)');
                sunGradient.addColorStop(1, 'rgba(255, 196, 118, 0.82)');
                this.ctx.fillStyle = sunGradient;
                this.ctx.beginPath();
                this.ctx.arc(x, y, size, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                const planetGradient = this.ctx.createRadialGradient(x - size * 0.35, y - size * 0.35, Math.max(0.25, size * 0.12), x, y, Math.max(0.6, size));
                planetGradient.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
                planetGradient.addColorStop(0.24, `rgba(${red}, ${green}, ${blue}, 0.96)`);
                planetGradient.addColorStop(1, `rgba(${Math.round(red * 0.52)}, ${Math.round(green * 0.52)}, ${Math.round(blue * 0.52)}, 0.82)`);
                this.ctx.fillStyle = planetGradient;
                this.ctx.beginPath();
                this.ctx.arc(x, y, size, 0, Math.PI * 2);
                this.ctx.fill();
            }
            const labelKey = CELESTIAL_LABEL_KEYS[body.name];
            const translatedLabel = labelKey ? t(labelKey, state.displayLanguage) : body.name;
            // Never expose an untranslated implementation key such as
            // "ui.celestialEarth" while locale files are loading.
            const label = !translatedLabel || translatedLabel === labelKey || translatedLabel.startsWith('ui.') ? body.name : translatedLabel;
            const shouldShowLabel = body.kind === 'sun' || body.kind === 'planet' || (body.kind === 'star' && body.magnitude < 1);
            if (label && shouldShowLabel) {
                this.ctx.textAlign = 'left';
                // Labels remain compact and deliberately translucent. The
                // light backing only lifts them from busy star fields instead
                // of reading as an interface layer over the night sky.
                this.ctx.font = '500 11px Inter, Manjari, sans-serif';
                const metrics = this.ctx.measureText(label);
                const paddingX = 4;
                const labelWidth = metrics.width + paddingX * 2;
                const placement = this.placeCelestialLabel(x, y, size, labelWidth, width, height, labelBounds);
                const labelLeft = placement.left, labelX = labelLeft + paddingX, labelY = placement.top + 12;
                if (Math.abs(labelY - y - 4) > 8) {
                    // Only labels move. A fine leader retains the exact body
                    // position when several objects are close on mobile.
                    this.ctx.save();
                    this.ctx.shadowBlur = 0;
                    this.ctx.strokeStyle = 'rgba(200, 219, 243, 0.18)';
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath(); this.ctx.moveTo(x, y);
                    this.ctx.lineTo(Math.max(labelLeft, Math.min(labelLeft + labelWidth, x)), labelY - 4);
                    this.ctx.stroke(); this.ctx.restore();
                }
                // Soften only the backing; restore before drawing crisp text.
                this.ctx.save();
                this.ctx.shadowBlur = 0;
                this.ctx.filter = 'blur(3px)';
                this.ctx.fillStyle = 'rgba(2, 4, 9, 0.20)';
                this.ctx.fillRect(labelLeft, labelY - 12, labelWidth, 16);
                this.ctx.restore();
                this.ctx.lineWidth = 1.4;
                this.ctx.strokeStyle = 'rgba(2, 4, 9, 0.20)';
                this.ctx.strokeText(label, labelX, labelY);
                this.ctx.fillStyle = `rgba(${Math.max(red, 220)}, ${Math.max(green, 220)}, ${Math.max(blue, 220)}, 0.40)`;
                this.ctx.fillText(label, labelX, labelY);
            }
            this.ctx.restore();
        });
    }

    placeCelestialLabel(x, y, size, labelWidth, width, height, occupied) {
        const right = x + size + 4, left = x - size - labelWidth - 4;
        const sides = x > width * 0.82 ? [left, right] : [right, left];
        let fallback;
        for (const offset of [0, -18, 18, -36, 36, -54, 54, -72, 72, -90, 90]) {
            for (const side of sides) {
                const box = {left: Math.max(4, Math.min(width - labelWidth - 4, side)),
                    top: Math.max(4, Math.min(height * 0.88 - 20, y - 8 + offset)), width: labelWidth, height: 16};
                fallback ||= box;
                if (occupied.some(b => box.left < b.left + b.width + 2 && box.left + box.width + 2 > b.left &&
                    box.top < b.top + b.height + 2 && box.top + box.height + 2 > b.top)) continue;
                occupied.push(box);
                return box;
            }
        }
        occupied.push(fallback);
        return fallback;
    }

    drawEarthIllustration(width, height) {
        // Below the observed horizon: artwork, never a fabricated sky position.
        const key = CELESTIAL_LABEL_KEYS.Earth, name = t(key, state.displayLanguage);
        const label = name && name !== key ? name : 'Earth';
        this.ctx.save();
        this.ctx.font = '500 11px Inter, Manjari, sans-serif';
        const placement = this.earthReferenceLayout(width, height, [], this.ctx.measureText(label).width);
        this.earthReferencePlacement = placement;
        const { x, y, size } = placement;
        this.drawEarthAtmosphericLayers(x, y, size);
        const surface = this.ctx.createRadialGradient(x - size * 0.3, y - size * 0.4, 0, x, y, size);
        surface.addColorStop(0, 'rgba(183, 231, 247, 1)');
        surface.addColorStop(0.5, 'rgba(44, 138, 194, 1)');
        surface.addColorStop(0.85, 'rgba(17, 67, 114, 1)');
        surface.addColorStop(1, 'rgba(6, 23, 49, 0.98)');
        this.ctx.fillStyle = surface;
        this.ctx.beginPath(); this.ctx.arc(x, y, size, 0, Math.PI * 2); this.ctx.fill();
        this.ctx.fillStyle = 'rgba(99, 172, 128, 0.72)';
        this.ctx.beginPath();
        this.ctx.ellipse(x - size * 0.25, y - size * 0.2, size * 0.38, size * 0.22, -0.6, 0, Math.PI * 2);
        this.ctx.ellipse(x + size * 0.26, y + size * 0.2, size * 0.19, size * 0.38, -0.5, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.filter = 'blur(0.7px)';
        this.ctx.fillStyle = 'rgba(237, 251, 255, 0.32)';
        this.ctx.beginPath();
        this.ctx.ellipse(x - size * 0.13, y - size * 0.39, size * 0.63, size * 0.12, -0.3, 0, Math.PI * 2);
        this.ctx.ellipse(x + size * 0.08, y + size * 0.37, size * 0.60, size * 0.09, -0.3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.filter = 'none';
        this.ctx.textAlign = 'left'; this.ctx.fillStyle = 'rgba(225, 242, 255, 0.7)';
        this.ctx.fillText(label, x + size * 1.5, y + 4);
        this.ctx.restore();
    }

    earthReferenceLayout(width, height, obstacles = [], labelWidth = 40) {
        const x = width / 2, top = height * 0.88 + 22, bottom = height - 8;
        const widthKey = Math.round(width);
        if (this.earthReferenceSizeWidth !== widthKey) {
            // Choose one size for this viewport width and retain it while the
            // page scrolls. Mobile browser chrome can also change innerHeight
            // during a scroll, so cap the sizing height by the stable width.
            // Foreground content may move the Earth or hide it, but must not
            // make the globe pulse between fallback sizes.
            const sizingHeight = Math.min(height, width * 2);
            const sizingTop = sizingHeight * 0.88 + 22;
            const sizingBottom = sizingHeight - 8;
            this.earthReferenceSize = [Math.min(14, sizingHeight * 0.016), 10, 8, 6, 4, 3]
                .find(size => sizingTop + size * 2.8 <= sizingBottom - size * 2.8) || 3;
            this.earthReferenceSizeWidth = widthKey;
        }
        const size = this.earthReferenceSize;
        const radius = size * 2.8;
        const minimumY = top + radius;
        const maximumY = Math.max(minimumY, bottom - radius);
        const y = Math.max(minimumY, Math.min(maximumY, height * 0.943));
        const bounds = { left: x - radius, right: x + Math.max(radius, size * 1.5 + labelWidth),
            top: y - radius, bottom: y + radius };
        return { x, y, size, bounds };
    }

    drawEarthMoonGuide(moonX, moonY, width, height) {
        const earth = this.earthReferencePlacement;
        const horizonY = height * 0.88;
        if (!earth || moonY > horizonY) return;
        const startX = earth.x;
        const startY = earth.y - earth.size * 1.05;
        const controlX = startX + (moonX - startX) * 0.52;
        const controlY = Math.min(horizonY - 8, moonY + (horizonY - moonY) * 0.42);
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'screen';
        this.ctx.strokeStyle = 'rgba(190, 214, 245, 0.14)';
        this.ctx.lineWidth = 0.65;
        this.ctx.setLineDash([2, 6]);
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.quadraticCurveTo(controlX, controlY, moonX, moonY);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        this.ctx.restore();
        this.moonObserverPlacement = { earthX: startX, earthY: startY, moonX, moonY };
    }

    drawEarthAtmosphericLayers(x, y, size) {
        // Owner-retained design: five merged protective atmosphere volumes.
        // The nearest layer uses a cool aqua 26°C comfort palette: artwork,
        // not a measured/simulated temperature or radiation-shielding claim.
        // Keep the visible band outside the opaque disc, even on tiny markers.
        // Preserve this and the Sun shield unless the owner requests removal.
        const layers = [
            [1.50, '112, 232, 244', 0.90], // Troposphere: cool aqua comfort.
            [1.82, '96, 190, 255', 0.58],  // Stratosphere.
            [2.13, '126, 160, 246', 0.38], // Mesosphere.
            [2.47, '102, 212, 235', 0.24], // Thermosphere.
            [2.80, '166, 202, 255', 0.16]  // Exosphere: soft outer dissolve.
        ];
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'screen';
        layers.forEach(([scale, rgb, alpha]) => {
            const radius = size * scale;
            const gradient = this.ctx.createRadialGradient(x, y, size * 0.98, x, y, radius);
            gradient.addColorStop(0, `rgba(${rgb}, ${alpha})`);
            gradient.addColorStop(0.18, `rgba(${rgb}, ${alpha * 0.92})`);
            gradient.addColorStop(0.60, `rgba(${rgb}, ${alpha * 0.40})`);
            gradient.addColorStop(1, `rgba(${rgb}, 0)`);
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x - radius * 1.1, y - radius * 1.1, radius * 2.2, radius * 2.2);
        });
        this.ctx.restore();
    }

    drawSolarProtectionLayer(x, y, size) {
        // Owner-retained feature; see AGENTS.md and docs/SKY-ACCURACY.md.
        // Visual-only shield: a soft circular rim inside the diffuse glow.
        // It is not a claim about filtering real radiation or energy transfer.
        const radius = size * 4.2;
        const gradient = this.ctx.createRadialGradient(x, y, size * 0.72, x, y, radius);
        gradient.addColorStop(0, 'rgba(255, 248, 214, 0.16)');
        gradient.addColorStop(0.34, 'rgba(255, 224, 149, 0.13)');
        gradient.addColorStop(0.66, 'rgba(255, 190, 112, 0.075)');
        gradient.addColorStop(1, 'rgba(255, 184, 104, 0)');
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'screen';
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
        const shield = this.ctx.createRadialGradient(x, y, size * 1.15, x, y, size * 2.8);
        shield.addColorStop(0, 'rgba(255, 241, 190, 0)');
        shield.addColorStop(0.38, 'rgba(255, 236, 177, 0.025)');
        shield.addColorStop(0.56, 'rgba(255, 245, 207, 0.24)');
        shield.addColorStop(0.72, 'rgba(255, 231, 170, 0.04)');
        shield.addColorStop(1, 'rgba(255, 231, 170, 0)');
        this.ctx.fillStyle = shield;
        this.ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
        this.ctx.restore();
    }

    setDeepSkyBlackHoleEnabled(enabled) {
        this.deepSkyBlackHoleEnabled = Boolean(enabled);
        this.celestialLayerKey = null;
        if (!document.hidden) this.draw(performance.now(), false);
    }

    drawDeepSkyBlackHole(width, height) {
        // A deliberately illustrative deep-sky object: fixed, subtle and
        // cached with the celestial layer rather than animated or positioned
        // as an observed astronomical body.
        const x = width * 0.76;
        const y = height * 0.27;
        const radius = Math.max(7, Math.min(14, Math.min(width, height) * 0.014));
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(-0.34);
        const outer = this.ctx.createRadialGradient(0, 0, radius * 0.35, 0, 0, radius * 3.4);
        outer.addColorStop(0, 'rgba(0, 0, 0, 0.92)');
        outer.addColorStop(0.24, 'rgba(8, 8, 18, 0.88)');
        outer.addColorStop(0.35, 'rgba(182, 128, 222, 0.18)');
        outer.addColorStop(0.56, 'rgba(118, 184, 255, 0.11)');
        outer.addColorStop(1, 'rgba(16, 10, 38, 0)');
        this.ctx.fillStyle = outer;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, radius * 3.1, radius * 0.82, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(214, 180, 255, 0.34)';
        this.ctx.lineWidth = Math.max(0.55, radius * 0.08);
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, radius * 1.75, radius * 0.38, 0, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.fillStyle = 'rgba(0, 0, 4, 0.96)';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius * 0.56, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    drawCelestialHorizon(width, height) {
        // This is the same 0° baseline used by the altitude projection below.
        // Keep it deliberately quiet: it is a spatial reference, not a new
        // landscape layer over the night-sky experience. It is drawn into the
        // cached celestial canvas, so it creates no repeating frame work.
        const horizonY = height * 0.88;
        const glow = this.ctx.createLinearGradient(0, horizonY, width, horizonY);
        glow.addColorStop(0, 'rgba(154, 181, 234, 0)');
        glow.addColorStop(0.2, 'rgba(154, 181, 234, 0.08)');
        glow.addColorStop(0.5, 'rgba(214, 224, 255, 0.18)');
        glow.addColorStop(0.8, 'rgba(154, 181, 234, 0.08)');
        glow.addColorStop(1, 'rgba(154, 181, 234, 0)');
        this.ctx.save();
        this.ctx.strokeStyle = glow;
        this.ctx.lineWidth = 1;
        this.ctx.shadowColor = 'rgba(173, 196, 255, 0.18)';
        this.ctx.shadowBlur = 7;
        this.ctx.beginPath();
        this.ctx.moveTo(0, horizonY);
        this.ctx.lineTo(width, horizonY);
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
        this.ctx.font = '500 10px Inter, Manjari, sans-serif';
        this.ctx.fillStyle = 'rgba(209, 224, 247, 0.48)';
        for (const [az, key] of [[0, 'skyNorth'], [90, 'skyEast'], [180, 'skySouth'], [270, 'skyWest']]) {
            this.ctx.textAlign = 'center';
            this.ctx.fillText(t(`ui.${key}`, state.displayLanguage), SkyAstronomy.project(az, 0, width, height).x, horizonY + 15);
        }
        this.ctx.restore();
    }

    drawMoonWithBooleanMask(x, y, size, phase, lightAngle, fraction = (1 - Math.cos(phase * Math.PI * 2)) / 2) {
        const buffer = this.moonBuffer;
        const bufferContext = this.moonBufferContext;
        if (!bufferContext) return;
        // Cache a lit sphere, including the curved terminator. Pixel alpha is
        // the illumination mask, so the unlit side never paints a dark disc.
        // Surface features are procedural texture, not a surveyed lunar map.
        const phaseKey = `${Math.round(fraction * 10000)}:${phase < 0.5}`;
        if (phaseKey !== this.cachedMoonPhase) {
            const pixels = bufferContext.createImageData(128, 128);
            const lightZ = 2 * fraction - 1;
            const lightX = Math.sqrt(Math.max(0, 1 - lightZ * lightZ)) * (phase < 0.5 ? 1 : -1);
            const maria = [[-0.26,-0.24,0.27,0.32],[0.18,-0.38,0.29,0.18],
                [0.38,-0.02,0.23,0.29],[-0.47,0.08,0.15,0.3],[0.01,0.16,0.2,0.16]];
            const random = this.sky.random(93827);
            const craters = Array.from({length:48}, () => ({x:random()*1.7-0.85,y:random()*1.7-0.85,r:0.016+random()*0.062}));
            for (let py=0;py<128;py++) {
                for (let px=0;px<128;px++) {
                    const nx=(px-63.5)/61, ny=(py-63.5)/61;
                    const squared=nx*nx+ny*ny;
                    if (squared>=1) continue;
                    const nz=Math.sqrt(1-squared);
                    const incidence=nx*lightX+nz*lightZ;
                    if (incidence<=0) continue;
                    let surface=0.84+this.sky.noise(nx*32+8,ny*32+8)*0.14;
                    for (const [mx,my,rx,ry] of maria) {
                        surface-=Math.exp(-((nx-mx)**2/rx**2+(ny-my)**2/ry**2)*1.5)*0.22;
                    }
                    for (const crater of craters) {
                        const distance=Math.hypot(nx-crater.x,ny-crater.y)/crater.r;
                        if (distance<1.3) surface+=distance<0.75?-0.065:0.07;
                    }
                    const lighting=0.24+0.76*Math.pow(incidence,0.42);
                    const value=Math.min(255,Math.max(0,255*surface*lighting));
                    const i=(py*128+px)*4;
                    pixels.data[i]=value;
                    pixels.data[i+1]=value*0.985;
                    pixels.data[i+2]=value*0.95;
                    pixels.data[i+3]=255*Math.min(1,incidence*28)*Math.min(1,(1-squared)*65);
                }
            }
            bufferContext.putImageData(pixels,0,0);
            this.cachedMoonPhase=phaseKey;
        }
        this.ctx.save();
        this.ctx.shadowBlur = 0;
        this.ctx.globalCompositeOperation = 'source-over';
        if (Number.isFinite(lightAngle)) {
            this.ctx.translate(x, y);
            this.ctx.rotate(lightAngle - (phase < 0.5 ? 0 : Math.PI));
            x = 0; y = 0;
        }
        this.ctx.drawImage(buffer, x - size, y - size, size * 2, size * 2);
        this.ctx.restore();
    }

    drawMeteors(time, width, height) {
        if (!this.nextMeteorAt) this.nextMeteorAt = time + 5 + Math.random() * 4;
        if (time >= this.nextMeteorAt && this.meteors.length < 1) {
            // On wide screens use exposed sky beside the central controls.
            const leftSide = Math.random() < 0.5;
            const startX = width > 900
                ? width * (leftSide ? 0.12 : 0.86)
                : width * (0.55 + Math.random() * 0.3);
            const startY = height * (0.05 + Math.random() * 0.12);
            this.meteors.push({
                startX,
                startY,
                angle: Math.PI * (width > 900 && leftSide ? 0.28 + Math.random() * 0.1 : 0.62 + Math.random() * 0.1),
                length: Math.min(width * 0.24, 65 + Math.random() * 65),
                speed: Math.min(width * 0.75, 360 + Math.random() * 160),
                bornAt: time,
                lifetime: 0.75 + Math.random() * 0.3,
                brightness: 0.55 + Math.random() * 0.2
            });
            this.nextMeteorAt = time + 25 + Math.random() * 45;
        }
        // No allocation or drawing at all between these occasional events.
        const meteor = this.meteors[0];
        if (!meteor) return;
        if (!this.meteorSprite) {
            this.meteorSprite = document.createElement('canvas');
            this.meteorSprite.width = 256;
            this.meteorSprite.height = 12;
            const ctx = this.meteorSprite.getContext('2d');
            const gradient = ctx.createLinearGradient(0, 0, 256, 0);
            gradient.addColorStop(0, 'rgba(205,225,255,0)');
            gradient.addColorStop(0.65, 'rgba(220,234,255,0.3)');
            gradient.addColorStop(1, 'rgba(255,255,255,1)');
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.8;
            ctx.shadowBlur = 2;
            ctx.shadowColor = 'rgba(205,225,255,0.5)';
            ctx.beginPath(); ctx.moveTo(0,6); ctx.lineTo(256,6); ctx.stroke();
        }
            const age = time - meteor.bornAt;
            if (age >= meteor.lifetime + 0.18) { this.meteors.length = 0; return; }
            const progress = age / meteor.lifetime;
            const distance = Math.min(age, meteor.lifetime) * meteor.speed;
            const headX = meteor.startX + Math.cos(meteor.angle) * distance;
            const headY = meteor.startY + Math.sin(meteor.angle) * distance;
            const tailLength = Math.min(meteor.length, distance);
            // Quick emergence, restrained peak, then a faint 180 ms residual trail.
            const alpha = Math.min(1, progress / 0.12) * Math.pow(Math.max(0, 1 - age / (meteor.lifetime + 0.18)), 0.65) * meteor.brightness;
            this.ctx.save();
            this.ctx.translate(headX, headY);
            this.ctx.rotate(meteor.angle);
            this.ctx.globalAlpha = alpha;
            this.ctx.drawImage(this.meteorSprite, -tailLength, -6, tailLength, 12);
            this.ctx.restore();
    }
}
window.AmbientParticleField = AmbientParticleField;
