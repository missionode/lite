# Observer sky — accuracy and visual treatment

Local implementation: 2026-09-17, app 3.45 / shell cache 5.238 / language cache 47; based on `6337889` plus uncommitted changes. Production push authorized in the 3.45 release checkpoint.

## What changed

The previous daytime planet row was decorative, the daytime Moon was suppressed, and most background stars were random. These no longer determine the observed sky. Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus and Neptune now use one observer/time calculation, together with 5,044 catalogue stars. Objects whose apparent centers are below the horizon are omitted. A visible daytime Moon is no longer artificially hidden.

The projection is a 360° azimuth/altitude panorama: north, east, south and west centered at 12.5%, 37.5%, 62.5% and 87.5% of viewport width; the panorama wraps at northwest. Its straight horizon is exactly altitude 0°, at 88% of canvas height. This rectangular all-sky projection distorts shapes, especially near the zenith; it is not a single camera field of view or compass-following view. Layout can move a crowded label, with a leader line, but never its celestial object.

Earth is the centered observer-reference illustration below the horizon, not an object seen from Earth. It does not move or alter the calculated sky. Its disc, complete glow and localized name must fit a clear center pocket: foreground mantra text, labels and controls take priority. It shrinks to fit; if even the minimum marker would overlap, it is temporarily omitted. Placement is re-evaluated on real layout/scroll events. Sliding controls reserve their final position too.

Five blue/cyan/violet filled atmospheric gradients represent troposphere, stratosphere, mesosphere, thermosphere and exosphere, merging at the limb and dissolving outward; the envelope reaches 2.8 illustrated Earth radii. Shaded surface, soft clouds and only the Earth name remain. The Sun has a softly feathered shield ring within its diffuse glow. Atmospheres and shield are artwork, not altitude, climate, radiation-filtering or safety claims. Meteors and the optional Advanced Features black hole likewise remain illustrative.

## Retained protective artwork contract

Owner request, 2026-09-17: preserve Earth's five atmosphere volumes and the Sun's feathered protective ring in later updates. Removal, default disabling or substantial fading requires explicit owner approval. `AGENTS.md`, the `earth-atmosphere` / `solar-containment` maps and regression checks record this requirement; they reduce accidental regression rather than guaranteeing that future code cannot change.

The innermost atmosphere is a **26°C cool-aqua comfort theme**, not a real temperature measurement or physical effect. Keep only the Earth name on the image—no temperature or layer labels. The revised inner band reaches 1.5 illustrated Earth radii and starts near the limb (0.98 radii), with stronger opacity outside the opaque disc. Five gradients overlap and dissolve outward to 2.8 radii without separate hard rings. The existing text/control-clearance guards remain valid because the outer footprint is unchanged.

Unit checks require five layers, a visible cool-aqua inner band, transparent outer fade, and both solar glow and shield. Browser checks sample actual pixels outside 4- and 10-pixel-radius Earth discs, and verify both render methods are called by the displayed sky. Latest sampled inner alpha: 185/255 and 194/255; outer alpha: 28/255 and 27/255. These are rendering checks, not atmospheric measurements. No added animation or idle timer.

## Time, location and honest limits

- Use the device's current instant (`Date`) and granted browser coordinates. India time and UTC notation of the same instant produce identical positions; do not add a second IST offset.
- Location stays in memory and calculations run locally. The app makes one geolocation request (cached locations up to 15 minutes, 8-second timeout, no continuous high-accuracy tracking). Elevation is used when provided, otherwise zero.
- Without permission/location, Settings explicitly identifies the Greenwich reference (51.4779° N, 0° E). It must not be interpreted as the user's local view. Observer status, directions and chart explanation are translated in English, Malayalam, Hindi and Russian.
- Astronomy Engine targets approximately one arcminute for supported solar-system calculations; this is not mathematical exactness. Clock error, position uncertainty, real atmospheric refraction and local obstructions affect comparison with the actual sky. Terrain, weather, light pollution, horizon dip and observer heading are not modeled. Center-based horizon clipping does not model the first visible upper limb of sunrise/moonrise.
- Refraction uses the engine's standard atmosphere, not measured temperature/pressure. The chart enhances star/planet brightness and sizes to preserve the space theme. Sun and Moon have an 8-pixel minimum diameter; planets have a minimum point size. Daytime stars and dim planets can be shown despite not being naked-eye visible. Lunar surface texture is illustrative, not a libration-resolved photograph.
- Star positions include catalogue proper motion, precession/nutation, and first-order annual aberration. Subarcsecond stellar parallax, relativistic light deflection and perspective acceleration are not modeled. Do not claim astrometric survey precision.

## Offline implementation and provenance

- [Astronomy Engine 2.1.19](https://github.com/cosinekitty/astronomy/tree/v2.1.19), MIT: vendored unchanged in `vendor/astronomy.browser.min.js`, license header retained. `Equator(..., true, true)` and `Horizon(..., 'normal')` supply topocentric apparent positions, including light-time/aberration and the observer correction. `Illumination` and `MoonPhase` supply the lunar state. Stars use `Rotation_EQJ_HOR` and `HorizonFromVector`.
- [d3-celestial catalogue](https://github.com/ofrohn/d3-celestial/blob/master/data/stars.6.json), 5,044 XHIP/Hipparcos stars through magnitude 6, J2000 positions and B−V colors; BSD license retained in `data/STARS-LICENSE.txt`. Source snapshot retrieved 2026-09-17. The compact generated `data/sky-stars.js` retains each HIP identifier, longitude/latitude, magnitude and color index, with proper-motion columns appended. Longitude may be negative; vector conversion treats it as periodic right ascension.
- Proper motions matched by HIP identifier from the [ESA Hipparcos catalogue I/239](https://vizier.cds.unistra.fr/viz-bin/VizieR?-source=I/239/hip_main), `Vmag < 6.1`, columns HIP, pmRA and pmDE, retrieved 2026-09-17. All 5,044 records matched. pmRA is already multiplied by cos(declination), in milliarcseconds/year. The vector tangent update advances from J2000; it must not apply cos(declination) twice.
- Planetary validation uses [NASA/JPL Horizons](https://ssd.jpl.nasa.gov/horizons/manual.html), DE441, observer `000@399` (public Greenwich observatory), dates 2000-01-01 00:00, 12:00 and 2000-01-02 00:00 UTC, quantity 4 and `APPARENT=AIRLESS`. Fixture `tests/fixtures/sky-horizons.json` retains the 27 independent azimuth/altitude samples and observer metadata. Tests disable refraction for like-for-like comparison. No user location is involved in these reference requests.

SHA-256 snapshots:

```text
astronomy.browser.min.js f41139a87941ea017ab902b954c9389fa27ea72083d7fab4971756d7769d14e6
sky-stars.js             ad3ee8d86d7a3ea7289dac482cb35e8bea3089291c2efd1b203dd5934c7841fe
```

The engine, catalogue and render scripts are local, versioned and included in the service-worker asset list. No online ephemeris or third-party script request occurs at runtime. Existing broader service-worker cache-matching/upgrade limitations are not claimed fixed here.

## Rendering budget and failure behavior

Vectors are prepared once. On animated Lobby/Settings screens, positions refresh at most every ten seconds, so the displayed chart can lag by up to that interval. Calculations and gradient/label rebuilding are outside normal animation frames. At most 110 stars scintillate, with existing bounded meteor scheduling. Hidden tabs cancel animation and pending layout draws. Other journey screens and reduced motion retain static snapshots with no repeating astronomy or visual timer. During a journey, even explicit layout redraws retain the existing astronomical snapshot: there is no ten-second recalculation. Scroll, screen/label/control changes coalesce into one event-driven redraw for Earth placement; there is no continuous layout polling. Explicit resize, locale or location changes also redraw.

A calculation failure clears old celestial positions and cached background stars, reports sky unavailable in Settings, and throttles retries to the same ten-second budget on animated screens. Static screens introduce no retry loop.

## Evidence

- `node tests/sky-astronomy.test.mjs`: all 27 NASA reference cases within one arcminute; maximum sampled error 0.2624 arcminutes. Also checks equivalent IST/UTC instants, observer dependence, nine bodies, catalogue and projection. This sampled solar-system comparison is not independent validation of every star/date.
- `node tests/night-sky.test.mjs`: catalogue visibility, deterministic resize, lunar mask/cache, crowded mobile labels, failed-calculation cleanup, cached redraw, visibility/reduced-motion/static scheduling and meteors.
- `node tests/night-sky-browser.mjs`: local-file-routed Chromium, desktop 1440×900 and mobile 390×844; no page errors, geolocation branch, reference status, daylight Moon, all four display languages, reduced motion and resize. Screenshots inspected. Sample desktop run: 2,446 background stars, 110 animated, approximately 0.13 ms cached draw and 4.6 ms calculation. These are test-machine timings, not phone thermal measurements. Service workers blocked in this test.
- Full local non-browser suite: 34/37 pass. Two existing checks require missing owner-managed `docs/dot.json`; `chakra-selection.test.mjs` has a pre-existing assertion that the Shots hidden-panel array starts with chakra selection (the released array starts with preparation add-ons). Confirmed against `6337889`; unrelated behavior was not changed to satisfy that stale assertion.
- Device visual comparison with a correctly set clock/location, long-running thermal profiling, listening and offline upgrade testing remain open.
- The centered Earth layout has desktop, portrait and short-landscape unit checks, including shrink/omit behavior around text. Browser coverage additionally checks the central marker, Malayalam mantra clearance and the real hover-to-reveal controls.
- Atlas generation and browser verification pass all 28 maps (243 nodes / 277 edges), including selection, labels, mobile layout, keyboard, print and SVG export.

Affected atlas maps: startup, visuals, Earth atmosphere, solar containment, persistence/cache and recovery. See the active entry in `HANDOFF.md` for handoff status.
