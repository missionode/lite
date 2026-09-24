import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const context = vm.createContext({ Date });
for (const file of ['vendor/astronomy.browser.min.js', 'data/sky-stars.js', 'sky-astronomy.js']) {
    vm.runInContext(readFileSync(file, 'utf8'), context);
}
const sky = vm.runInContext('SkyAstronomy', context);
const fixture = JSON.parse(readFileSync('tests/fixtures/sky-horizons.json', 'utf8'));
let maxArcminutes = 0;
for (const sample of fixture.cases) {
    const body = sky.snapshot(new Date(sample.date), fixture.observer, null).bodies.find(b => b.name === sample.name);
    const azError = (body.azimuth - sample.azimuth + 540) % 360 - 180;
    const error = Math.hypot(azError * Math.cos(body.altitude * Math.PI / 180), body.altitude - sample.altitude) * 60;
    maxArcminutes = Math.max(maxArcminutes, error);
    assert.ok(error < 1, `${sample.name} ${sample.date}: ${error} arcmin from NASA reference`);
}
const kochi = { latitude: 9.9312, longitude: 76.2673, height: 0 };
const noon = sky.snapshot(new Date('2026-09-17T12:00:00+05:30'), kochi);
assert.deepEqual(JSON.stringify(noon), JSON.stringify(sky.snapshot(new Date('2026-09-17T06:30:00Z'), kochi)), 'Timezone notation cannot shift sky positions');
assert.ok(noon.sunAltitude > 0);
assert.equal(noon.bodies.length, 9, 'Sun, Moon and all seven planets always calculated');
assert.ok(noon.stars.length > 5000);
assert.ok(noon.stars.every(s => Number.isFinite(s.altitude) && s.azimuth >= 0 && s.azimuth < 360));
assert.equal(noon.stars.find(s => s.name === 'Sirius').magnitude, -1.44);
const morningMoon = sky.snapshot(new Date('2000-01-01T12:00:00Z'), fixture.observer);
assert.ok(morningMoon.sunAltitude > 0 && morningMoon.bodies.find(b => b.name === 'Moon').altitude > 0, 'Daylight must retain a visible Moon');
const farAway = sky.snapshot(new Date('2026-09-17T06:30:00Z'), { latitude: -33.87, longitude: 151.21 });
assert.notEqual(noon.bodies[1].altitude, farAway.bodies[1].altitude, 'Lunar coordinates must depend on observer');
for (const [w, h] of [[1440, 900], [390, 844]]) {
    assert.equal(sky.project(90, 0, w, h).y, h * 0.88, 'Horizon and projection agree');
    for(const [az,fraction] of [[0,.125],[90,.375],[180,.625],[270,.875]])
        assert.equal(sky.project(az,0,w,h).x,w*fraction,'Cardinal directions have equal inset margins and spacing');
    assert.equal(sky.project(0, 90, w, h).y, 20, 'Zenith is above horizon');
    assert.ok(sky.project(0, -1, w, h).y > h * 0.88, 'Below-horizon bodies cannot be moved into sky');
}
console.log(JSON.stringify({ referenceCases: fixture.cases.length, maxArcminutes, catalogue: noon.stars.length, timezoneAndObserver: true }));
