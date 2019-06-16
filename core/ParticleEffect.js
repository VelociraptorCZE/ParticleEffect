/**
 * ParticleEffect
 * Copyright (c) Simon Raichl 2019
 * MIT License
 */

import EffectProvider from "./EffectProvider";
import getParticleConfig from "../config/particleConfig";
import getEffectCallbackName from "../service/getEffectCallbackName";

export default class ParticleEffect extends EffectProvider {
    constructor (context) {
        super();
        this._refreshTime = 15;
        this.context = context;
        this.particles = [];
        this.options = {};
        this._ownEffects = {};
    }

    setOptions (target = {}) {
        this.options = {
            ...this.options,
            ...target
        };
    }

    create () {
        const { onCreate = () => {} } = this.options;
        this.adjustConfig();
        this._renderCallbackIsCallable = true;
        if (!this._renderInitiated) {
            this._renderInitiated = true;
            this._renderSequence();
        }
        onCreate();
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
        const { type } = this.options;
        this.particleConfig = this._ownEffects[type] || getParticleConfig(type);
    }

    defineOwnEffect ({ type, config = {}, callback = () => {} } = {}) {
        if (typeof type !== "string") {
            console.warn(`Name must be type of string, type given: ${type}!`);
            return false;
        }
        this._ownEffects[type] = config;
        this[getEffectCallbackName(type)] = callback;
        return true;
    }

    deleteOwnEffect (type) {
        return delete this._ownEffects[type] && delete this[getEffectCallbackName(type)];
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
        }
        catch (e) {
            if (_renderCallbackIsCallable) {
                console.warn(`Effect emitting was stopped because of ${e}.`);
            }
            this.destroy();
        }
    }

    _setCanvasFillColor (color) {
        this.context.fillStyle = color || this.options.color || "#000";
    }

    _getParticleColor () {
        let { random, options: { color, colors = [] } } = this;
        if (Array.isArray(colors) && colors.length > 0) {
            const randomId = random.next(0, colors.length - 1);
            color = colors[randomId];
        }
        return color;
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
                color: this._getParticleColor(),
                blur: particleConfig.blur,
                x: random.next(...randomXBounds),
                y: random.next(-10, -15)
            }
        );
    }

    _renderAllParticles () {
        const { context, particles, _refreshTime } = this;
        this.particles = particles.filter(particle => {
            context.save();
            particle = this._getParticle(particle);
            particle.lifespan -= _refreshTime;
            this._renderParticle(particle);
            context.restore();
            return particle.lifespan > 0;
        });
    }

    _renderParticle (particle) {
        const { particleConfig, context, options: { coords: [x, y] } } = this;
        this._setCanvasFillColor(particle.color);
        context.globalAlpha = particle.alpha;
        if (particleConfig.image) {
            context.drawImage(particleConfig.image, x + particle.x, y + particle.y);
        }
        else {
            context.filter = `blur(${particle.blur}px)`;
            context.beginPath();
            context.arc(x + particle.x, y + particle.y, particle.radius, 0, Math.PI * 2);
            context.fill();
            context.closePath();
        }
    }

    _getParticle (particle) {
        try {
            return this[getEffectCallbackName(this.options.type)](particle, this.random);
        }
        catch (e) {}
        return particle;
    }
}