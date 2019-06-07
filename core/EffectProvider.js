/**
 * ParticleEffect
 * Copyright (c) Simon Raichl 2019
 * MIT License
 */

import Random from "../service/Random";

export default class EffectProvider {
    constructor () {
        this.random = new Random();
    }

    explosionEffect (particle) {
        const { options: { radiusIncrease, alphaDecrease }, random } = { ...particle, ...this };

        const alphaDecreaseBounds = alphaDecrease ? alphaDecrease : [.01, .05];
        const radiusIncreaseBounds = radiusIncrease ? radiusIncrease : [8, 18];

        const randomAlphaDecrease = random.nextFloat(...alphaDecreaseBounds);
        if (particle.alpha > randomAlphaDecrease) {
            particle.alpha -= randomAlphaDecrease;
        }

        particle.radius += random.next(...radiusIncreaseBounds);
        return particle;
    }

    fireEffect (particle) {
        const { random } = this;
        const alphaDecrease = random.nextFloat(.005, .01);

        particle.y -= random.nextFloat(1, 3);
        particle.x += random.nextFloat(-1.5, 1.5);
        if (particle.alpha > alphaDecrease) {
            particle.alpha -= alphaDecrease;
        }

        particle.radius -= random.nextFloat(.05, .075);
        return particle;
    }
}