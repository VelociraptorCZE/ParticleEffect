/**
 * ParticleEffect
 * Copyright (c) Simon Raichl 2019
 * MIT License
 */

const particleConfig = Object.freeze({
    explosion: {
        particlesToCreate: 3,
        defaultRadius: 15,
        lifespan: 500,
        blur: 5
    },
    fire: {
        particlesToCreate: 200,
        defaultRadius: 10,
        lifespan: 1500
    }
});

export default function getParticleConfig (type) {
    return { ...particleConfig[type] };
}