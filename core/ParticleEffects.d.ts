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
    defineOwnEffect(target: OwnEffectOptions | object): boolean,
    deleteOwnEffect(type: string): boolean,
    options: ParticleEffectOptions,
    context: CanvasRenderingContext2D,
}

interface ParticleEffectOptions {
    alphaDecrease: Array<number>,
    callOnDestroyOnce: true | false
    clearCanvasOnRender: true | false,
    color: string,
    colors: Array<string>,
    coords: Array<number>,
    onCreate: () => {},
    onDestroy: () => {},
    onRender: (context) => {},
    radius: number,
    particleLifespan: number,
    type: "explosion" | "fire" | "snow" | "rain" | string
}

interface OwnEffectOptions {
    name: string,
    config: ParticleConfigOptions | object,
    callback: (particle, random) => {}
}

interface ParticleConfigOptions {
    particlesToCreate: number,
    defaultRadius: number,
    lifespan: number,
    blur: number,
    image: HTMLImageElement,
    useFullCanvasWidth: true | false
}