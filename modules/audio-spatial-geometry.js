(function installAudioSpatialGeometry(global) {
    "use strict";

    function createPanner(audioContext) {
        if (audioContext?.createPanner) {
            const panner = audioContext.createPanner();
            panner.distanceModel = 'inverse';
            panner.refDistance = 1;
            panner.maxDistance = 10000;
            panner.rolloffFactor = 0;
            panner.panningModel = 'equalpower';
            if (panner.positionX) {
                panner.positionX.value = 0;
                panner.positionY.value = 0;
                panner.positionZ.value = -1;
            } else if (typeof panner.setPosition === 'function') {
                panner.setPosition(0, 0, -1);
            }
            return panner;
        }
        return audioContext.createStereoPanner();
    }

    function setPosition(node, position, now) {
        if (!node) return;
        if (node.positionX && node.positionY && node.positionZ) {
            [['x', node.positionX], ['y', node.positionY], ['z', node.positionZ]].forEach(([axis, param]) => {
                if (param.cancelAndHoldAtTime) param.cancelAndHoldAtTime(now);
                else { param.cancelScheduledValues(now); param.setValueAtTime(param.value, now); }
                param.linearRampToValueAtTime(position[axis], now + 1.2);
            });
        } else if (node.pan) {
            if (node.pan.cancelAndHoldAtTime) node.pan.cancelAndHoldAtTime(now);
            else { node.pan.cancelScheduledValues(now); node.pan.setValueAtTime(node.pan.value, now); }
            const pan = Math.atan2(position.x, Math.max(0.1, Math.abs(position.z))) / (Math.PI / 2);
            node.pan.linearRampToValueAtTime(Math.max(-1, Math.min(1, pan)), now + 1.2);
        } else if (typeof node.setPosition === 'function') {
            node.setPosition(position.x, position.y, position.z);
        }
    }

    global.ChakraAudioSpatialGeometry = Object.freeze({ createPanner, setPosition });
})(window);
