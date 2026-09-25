(function installNewcomerMarkerLayout(global) {
    'use strict';

    const ANCHORS = Object.freeze({
        crown: [0.5, 0.065], thirdeye: [0.5, 0.123], throat: [0.5, 0.205],
        heart: [0.5, 0.297], solar: [0.5, 0.385], sacral: [0.5, 0.465], root: [0.5, 0.548]
    });

    class NewcomerMarkerLayout {
        constructor({
            stage,
            svg,
            anchors = ANCHORS,
            requestFrame = callback => global.requestAnimationFrame(callback),
            cancelFrame = frame => global.cancelAnimationFrame(frame),
            ResizeObserverCtor = global.ResizeObserver
        }) {
            if (!stage || !svg || typeof requestFrame !== 'function' || typeof cancelFrame !== 'function' ||
                typeof ResizeObserverCtor !== 'function') {
                throw new TypeError('Newcomer marker layout requires its stage, SVG, frame scheduler and resize observer');
            }
            this.stage = stage;
            this.image = stage.querySelector('img');
            this.svg = svg;
            this.anchors = anchors;
            this.requestFrame = requestFrame;
            this.cancelFrame = cancelFrame;
            this.frame = null;
            this.onImageLoad = () => this.schedule();
            this.image?.addEventListener('load', this.onImageLoad);
            this.resizeObserver = new ResizeObserverCtor(() => this.schedule());
            this.resizeObserver.observe(stage);
        }

        schedule() {
            if (this.frame !== null) return;
            this.frame = this.requestFrame(() => this.sync());
        }

        sync() {
            this.frame = null;
            if (!this.stage || !this.image || !this.svg || !this.image.complete) return;
            const stageRect = this.stage.getBoundingClientRect();
            const imageRect = this.image.getBoundingClientRect();
            if (!stageRect.width || !imageRect.width) return;
            this.svg.setAttribute('viewBox', `0 0 ${stageRect.width} ${stageRect.height}`);
            Object.entries(this.anchors).forEach(([marker, [x, y]]) => {
                const label = this.stage.querySelector(`[data-marker="${marker}"]`);
                const path = this.svg.querySelector(`path[data-marker="${marker}"]`);
                if (!label || !path) return;
                const labelRect = label.getBoundingClientRect();
                const targetX = imageRect.left - stageRect.left + imageRect.width * x;
                const targetY = imageRect.top - stageRect.top + imageRect.height * y;
                const labelOnLeft = labelRect.left + labelRect.width / 2 < imageRect.left + imageRect.width / 2;
                const startX = (labelOnLeft ? labelRect.right : labelRect.left) - stageRect.left;
                const startY = Math.max(labelRect.top, Math.min(targetY + stageRect.top, labelRect.bottom)) - stageRect.top;
                const bend = (targetX - startX) * 0.42;
                path.setAttribute('d', `M ${startX} ${startY} C ${startX + bend} ${startY}, ${targetX - bend} ${targetY}, ${targetX} ${targetY}`);
            });
        }

        destroy() {
            if (this.frame !== null) {
                this.cancelFrame(this.frame);
                this.frame = null;
            }
            this.image?.removeEventListener('load', this.onImageLoad);
            this.resizeObserver.disconnect();
        }
    }

    NewcomerMarkerLayout.ANCHORS = ANCHORS;
    global.ChakraNewcomerMarkerLayout = NewcomerMarkerLayout;
})(typeof window === 'undefined' ? globalThis : window);
