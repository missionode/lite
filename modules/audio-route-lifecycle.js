(function installAudioRouteLifecycle(global) {
    'use strict';

    function setConvolverActive(owner, key, input, convolver, output, active, tailSeconds = 0) {
        const ctx = owner?.ctx;
        if (!ctx || !input || !convolver || !output) return;
        owner.effectRoutes ||= new Map();
        let route = owner.effectRoutes.get(key);
        if (!route) {
            route = { connected: true, retirement: null };
            owner.effectRoutes.set(key, route);
        }
        if (route.retirement) {
            route.retirement.onended = null;
            try { route.retirement.stop(); } catch (error) {}
            route.retirement.disconnect();
            route.retirement = null;
        }
        if (active) {
            if (!route.connected) {
                input.connect(convolver);
                convolver.connect(output);
                route.connected = true;
            }
            return;
        }
        if (!route.connected) return;
        const disconnect = () => {
            input.disconnect(convolver);
            convolver.disconnect(output);
            route.connected = false;
        };
        if (tailSeconds <= 0) {
            disconnect();
            return;
        }
        // A silent native audio-clock deadline freezes on pause, unlike a wall
        // timer. No polling loop; restarting cancels the pending disconnection.
        const deadline = ctx.createBufferSource();
        deadline.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
        deadline.loop = true;
        deadline.connect(ctx.destination);
        route.retirement = deadline;
        deadline.onended = () => {
            deadline.disconnect();
            if (route.retirement !== deadline) return;
            route.retirement = null;
            disconnect();
        };
        deadline.start();
        deadline.stop(ctx.currentTime + tailSeconds);
    }

    global.ChakraAudioRouteLifecycle = Object.freeze({ setConvolverActive });
})(typeof window === 'undefined' ? globalThis : window);
