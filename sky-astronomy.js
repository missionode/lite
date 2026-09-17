// Offline observer sky. Positions are independent of canvas size and language.
// Astronomy Engine 2.1.19: topocentric, light-time, aberration, precession/nutation.
// See docs/SKY-ACCURACY.md for catalogue provenance and precision limits.
const SkyAstronomy = (() => {
    const DEG = Math.PI / 180;
    const named = {
        11767: 'Polaris', 32349: 'Sirius', 30438: 'Canopus', 71683: 'RigilKent',
        91262: 'Vega', 69673: 'Arcturus', 24608: 'Capella', 24436: 'Rigel',
        37279: 'Procyon', 7588: 'Achernar', 97649: 'Altair', 27989: 'Betelgeuse',
        60718: 'Acrux', 21421: 'Aldebaran', 65474: 'Spica', 80763: 'Antares',
        37826: 'Pollux', 113368: 'Fomalhaut', 102098: 'Deneb', 49669: 'Regulus'
    };
    // Physical radii (km); angular diameters follow observer distance.
    const planets = [
        ['Sun', 'sun', [255, 232, 184], 695700],
        ['Moon', 'moon', [255, 246, 222], 1737.4],
        ['Mercury', 'planet', [189, 181, 172], 2439.7],
        ['Venus', 'planet', [255, 238, 202], 6051.8],
        ['Mars', 'planet', [255, 170, 130], 3389.5],
        ['Jupiter', 'planet', [255, 229, 185], 69911],
        ['Saturn', 'planet', [235, 216, 180], 58232],
        ['Uranus', 'planet', [151, 217, 224], 25362],
        ['Neptune', 'planet', [105, 145, 218], 24622]
    ];
    const wrap = value => ((value % 360) + 360) % 360;
    const project = (azimuth, altitude, width, height) => ({
        x: wrap(azimuth + 45) / 360 * width,
        y: height * 0.88 - altitude / 90 * (height * 0.88 - 20)
    });
    const starColor = bv => bv < 0.2 ? [213, 229, 255] : bv < 0.6 ? [244, 245, 255] : bv < 1.1 ? [255, 236, 203] : [255, 204, 166];
    // Precompute catalogue vectors once; only one rotation matrix per refresh.
    const stars = SKY_STAR_CATALOG.map(([id, ra, dec, magnitude, bv, pmRA = 0, pmDec = 0]) => ({
        id, name: named[id] || '', magnitude, color: starColor(bv),
        x: Math.cos(dec * DEG) * Math.cos(ra * DEG),
        y: Math.cos(dec * DEG) * Math.sin(ra * DEG), z: Math.sin(dec * DEG),
        vx: (-pmRA * Math.sin(ra * DEG) - pmDec * Math.sin(dec * DEG) * Math.cos(ra * DEG)) * DEG / 3600000,
        vy: (pmRA * Math.cos(ra * DEG) - pmDec * Math.sin(dec * DEG) * Math.sin(ra * DEG)) * DEG / 3600000,
        vz: pmDec * Math.cos(dec * DEG) * DEG / 3600000
    }));
    function snapshot(date, location, refraction = 'normal') {
        const time = Astronomy.MakeTime(date);
        const observer = new Astronomy.Observer(location.latitude, location.longitude, location.height || 0);
        const bodies = planets.map(([name, kind, color, radius]) => {
            const eq = Astronomy.Equator(name, time, observer, true, true);
            const horizontal = Astronomy.Horizon(time, observer, eq.ra, eq.dec, refraction);
            const illumination = Astronomy.Illumination(name, time);
            return { name, kind, color, altitude: horizontal.altitude, azimuth: horizontal.azimuth,
                ra: eq.ra, dec: eq.dec, distanceAU: eq.dist, magnitude: illumination.mag,
                illumination: illumination.phase_fraction,
                angularDiameter: 2 * Math.atan(radius / (eq.dist * Astronomy.KM_PER_AU)) / DEG };
        });
        const sun = bodies[0], moon = bodies[1];
        moon.phase = Astronomy.MoonPhase(time) / 360;
        // Direction of the Sun in the Moon's local tangent plane, clockwise on canvas.
        const dAz = (sun.azimuth - moon.azimuth) * DEG;
        const sx = Math.cos(sun.altitude * DEG) * Math.sin(dAz);
        const sy = Math.sin(sun.altitude * DEG) * Math.cos(moon.altitude * DEG) -
            Math.cos(sun.altitude * DEG) * Math.sin(moon.altitude * DEG) * Math.cos(dAz);
        moon.lightAngle = Math.atan2(-sy, sx);
        const rotation = Astronomy.Rotation_EQJ_HOR(time, observer);
        const years = time.tt / 365.25;
        const earth = Astronomy.HelioState('Earth', time);
        const beta = [earth.vx, earth.vy, earth.vz].map(v => v / Astronomy.C_AUDAY);
        const field = stars.map(star => {
            const direction = [star.x + star.vx * years, star.y + star.vy * years, star.z + star.vz * years];
            const length = Math.hypot(...direction);
            const unit = direction.map(v => v / length);
            const dot = unit.reduce((sum, v, i) => sum + v * beta[i], 0);
            const apparent = unit.map((v, i) => v + beta[i] - v * dot);
            const vector = Astronomy.RotateVector(rotation, new Astronomy.Vector(...apparent, time));
            const h = Astronomy.HorizonFromVector(vector, refraction);
            return { ...star, kind: 'star', altitude: h.lat, azimuth: h.lon };
        });
        return { date: date.toISOString(), sunAltitude: sun.altitude, bodies, stars: field };
    }
    return { snapshot, project, wrap };
})();
