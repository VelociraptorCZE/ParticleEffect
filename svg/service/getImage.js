/**
 * ParticleEffect
 * Copyright (c) Simon Raichl 2019
 * MIT License
 */

export default function getImage (imageSrc) {
    const blob = new Blob([imageSrc], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.src = url;
    return image;
}