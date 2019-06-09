/**
 * ParticleEffect
 * Copyright (c) Simon Raichl 2019
 * MIT License
 */

import EffectProvider from "./EffectProvider";
import getParticleConfig from "../config/particleConfig";

export default class ParticleEffect extends EffectProvider {
    constructor (context) {
        super();
        this._refreshTime = 15;
        this.context = context;
        this.particles = [];
        this.options = {};
    }

    setOptions (target = {}) {
        this.options = {
            ...this.options,
            ...target
        };
    }

    create () {
        this.adjustConfig();
        this._renderCallbackIsCallable = true;
        if (!this._renderInitiated) {
            this._renderInitiated = true;
            this._renderSequence();
        }
    }

    destroy () {
        const { onDestroy = () => {}, callOnDestroyOnce } = this.options;
        this.particlesToCreate = 0;
        this._renderCallbackIsCallable = false;
        this.particles = [];
        if (callOnDestroyOnce && this._onDestroyCalled) {
            return;
        }
        onDestroy();
        this._onDestroyCalled = true;
    }

    adjustConfig () {
        this.particleConfig = getParticleConfig(this.options.type);
    }

    _renderSequence () {
        return requestAnimationFrame(() => {
            this._render();
            this._renderSequence();
        });
    }

    _render () {
        const { context, random, _renderCallbackIsCallable, options: { clearCanvasOnRender, onRender = () => {} } } = this;

        try {
            context.save();
            this._setCanvasFillColor();
            if (clearCanvasOnRender) {
                const { width, height } = context.canvas;
                context.clearRect(0, 0, width, height);
            }
            if (_renderCallbackIsCallable) {
                onRender(context);
            }
            if (random.nextBool()) {
                this._createParticle();
            }
            this._renderAllParticles();
            context.restore();
        }
        catch (e) {
            if (_renderCallbackIsCallable) {
                console.warn(`Effect emitting was stopped because of ${e}.`);
            }
            this.destroy();
        }
    }

    _setCanvasFillColor () {
        this.context.fillStyle = this.options.color || "#000";
    }

    _createParticle () {
        const { random, particles, particleConfig, context: { canvas }, options: { radius, particleLifespan } } = this;

        if (particleConfig.particlesToCreate === 0) {
            if (!this.particles.length) {
                this.destroy();
            }
            return;
        }

        const randomXBounds = particleConfig.useFullCanvasWidth ? [0, canvas.width] : [-18, 18];

        particleConfig.particlesToCreate--;

        particles.push(
            {
                lifespan: particleLifespan || particleConfig.lifespan || 500,
                radius: radius || particleConfig.defaultRadius,
                alpha: .6,
                blur: particleConfig.blur,
                x: random.next(...randomXBounds),
                y: random.next(-10, -15)
            }
        );
    }

    _renderAllParticles () {
        const { context, particles, _refreshTime } = this;
        this.particles = particles.filter(particle => {
            const { filter } = context;
            particle = this._getParticle(particle);
            particle.lifespan -= _refreshTime;
            context.globalAlpha = particle.alpha;
            this._renderParticle(particle);
            context.filter = filter;
            return particle.lifespan > 0;
        });
    }

    _renderParticle (particle) {
        const { particleConfig, context, options: { coords: [x, y] } } = this;
        if (particleConfig.image) {
            context.drawImage(particleConfig.image, x + particle.x, y + particle.y);
        }
        else {
            if (particle.blur) {
                context.filter = `blur(${particle.blur}px)`;
            }
            context.beginPath();
            context.arc(x + particle.x, y + particle.y, particle.radius, 0, Math.PI * 2);
            context.fill();
            context.closePath();
        }
    }

    _getParticle (particle) {
        try {
            return this[`${this.options.type}Effect`](particle);
        }
        catch (e) {}
        return particle;
    }
}