/**
 * ParticleEffect
 * Copyright (c) Simon Raichl 2019
 * MIT License
 */

interface ParticleEffect {
    setOptions(target: ParticleEffectOptions | object): void,
    create(): void,
    destroy(): void,
    adjustConfig(): void,
    options: ParticleEffectOptions,
    context: CanvasRenderingContext2D,
}

interface ParticleEffectOptions {
    callOnDestroyOnce: true | false
    clearCanvasOnRender: true | false,
    color: string,
    colors: Array<string>,
    coords: Array<number>,
    onDestroy: () => {},
    onRender: (context) => {},
    radius: number,
    particleLifespan: number,
    type: "explosion" | "fire" | "snow" | "rain" | string
}