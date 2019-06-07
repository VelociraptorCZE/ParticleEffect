/**
 * ParticleEffect
 * Copyright (c) Simon Raichl 2019
 * MIT License
 */

export default class Random {
    constructor () {
        this.bounds = Object.freeze({
            min: Number.MIN_SAFE_INTEGER,
            max: Number.MAX_SAFE_INTEGER
        });
    }

    next (min, max) {
        return Math.round(this.nextFloat(min, max));
    }

    nextFloat (min = this.bounds.min, max = this.bounds.max) {
        return (Math.random() * (max - min) + min);
    }

    nextBool () {
        return !!this.next(0, 1);
    }
}