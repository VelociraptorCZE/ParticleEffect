# ParticleEffect

Library for creating easy customizable effects. First of all you need to import this library into your script.

```js
import ParticleEffect from "particleeffect";
```

Now you can create an instance of class ParticleEffect. Constructor takes one parameter which is the context of the canvas.
This parameter can be omitted, but context is required to make this library work. But if you don't have for some reason
your context yet, you can still add it later on.

```js
import ParticleEffect from "particleeffect";

class SomeClass {
    constructor () {
        this.particleEffect = new ParticleEffect();
    }
    
    exampleMethod () {
        const context = document.getElementById("canvas").getContext("2d");
        this.particleEffect.context = context;
        // or in this case you can create an instance in this method instead rather than in constructor 
        // this.particleEffect = new ParticleEffect(context);
    }
}
```

In this library you have four methods which you need for creating your effects.

### setOptions(target: ParticleEffectOptions)

With this method you can specify options for your effect. You can define following parameters:

- alphaDecrease: Array<number>
- callOnDestroyOnce: true | false
- clearCanvasOnRender: true | false
- color: string
- colors: Array<string>
- coords: Array<number>
- onCreate: () => {}
- onDestroy: () => {}
- onRender: (context) => {}
- radius: number
- particleLifespan: number
- type: "explosion" | "fire" | "snow" | "rain" | string"

#### Important properties

There are three important properties: **type**, **color**, **coords**.

In property **color** you can set color for your particle represented as string either by hex or color name.

```js
import ParticleEffect from "particleeffect";

const context = document.getElementById("canvas").getContext("2d");
const particleEffect = new ParticleEffect(context);
particleEffect.setOptions({
    color: "#ffa500", // you can also use "orange"
});
```

In property **type** you can set a sequence for particular effect. 
At this point you can choose from four native
effect types, which are already mentioned higher.

```js
import ParticleEffect from "particleeffect";

const context = document.getElementById("canvas").getContext("2d");
const particleEffect = new ParticleEffect(context);
particleEffect.setOptions({
    color: "#ffa500", // you can also use "orange"
    type: "fire"
});
```

In property **coords** you can set starting position on x and y axis. 
Use for this property an array with two numeric values.

```js
import ParticleEffect from "particleeffect";

const context = document.getElementById("canvas").getContext("2d");
const particleEffect = new ParticleEffect(context);
particleEffect.setOptions({
    color: "#ffa500", // you can also use "orange"
    type: "fire",
    coords: [64, 128] // effect will start emitting at 64px from left and 128px from top
});
```

#### Events

This library has two "events" - **onDestroy** and **onRender**. 
Callback for onDestroy is called when the last particle is
completely vanished and onRender is called on every update,
it isn't called when the effect was already destroyed.
For onRender callback you can use one parameter - context of your canvas in the current instance of ParticleEffect.
Please note onDestroy is called infinite number of times, you can prevent this by setting the **callOnDestroyOnce** to true.

```js
import ParticleEffect from "particleeffect";

const context = document.getElementById("canvas").getContext("2d");
const particleEffect = new ParticleEffect(context);
particleEffect.setOptions({
    color: "#ffa500", // you can also use "orange"
    type: "fire",
    coords: [64, 128], // effect will start emitting at 64px from left and 128px from top
    callOnDestroyOnce: true,
    onDestroy: () => {
        particleEffect.create();
        // Since callOnDestroyOnce is set to true this function will be called once at effect destroy and it will recreate current effect
    },
    onRender: () => {
        // do whatever you want
    }
});
```

### create()

This function simply starts to emit particles for your current effect with respective settings.

```js
import ParticleEffect from "particleeffect";

const context = document.getElementById("canvas").getContext("2d");
const particleEffect = new ParticleEffect(context);
particleEffect.setOptions({
    color: "#ffa500", // you can also use "orange"
    type: "fire",
    coords: [64, 128], // effect will start emitting at 64px from left and 128px from top
    callOnDestroyOnce: true,
    onDestroy: () => {
        particleEffect.create();
        // Since callOnDestroyOnce is set to true this function will be called once at effect destroy and it will recreate current effect
    },
    onRender: () => {
        // do whatever you want
    }
});

particleEffect.create();
```

### destroy()

This function instantly destroys any remaining particles.

### adjustConfig()

This function is called internally on every **create()** call and adjusts config for current effect type, 
however you can also use to your advantage.
We already have our great fire effect, but we want to change our effect from a fire to an explosion after one second.
Instead of creating new instance, you can solve this quite easily.

```js
import ParticleEffect from "particleeffect";

const context = document.getElementById("canvas").getContext("2d");
const particleEffect = new ParticleEffect(context);
particleEffect.setOptions({
    color: "#ffa500",
    type: "fire",
    coords: [64, 128]
});

particleEffect.create();

setTimeout(() => {
    particleEffect.setOptions({
        type: "explosion"
    });
    particleEffect.adjustConfig();
}, 1000);
```

Without calling this function your effect would behave like fire 
so use this function when you want to dynamically
change effect type.

### defineOwnEffect(target: OwnEffectOptions)

Since version 0.9.0 you can create your own effects. You need to define these three fundamental properties:

- type as string
- config as object
- callback as function

Type can be whatever string, config need to be an object, you can define these properties: 

- particlesToCreate: number
- defaultRadius: number
- lifespan: number
- blur: number
- image: HTMLImageElement
- useFullCanvasWidth: true | false

Callback is called on every frame for every particle. 
You can define movement for you particle or whatever else you want.
It's possible to define two parameters for your callback, first is the particle you want to manipulate with and
the second is the internal instance of class Random.

```js
const showerEffect = new ParticleEffect(context);
showerEffect.defineOwnEffect({
    type: "shower",
    config: {
        lifespan: 750,
        defaultRadius: 5,
        particlesToCreate: 200
    },
    callback: (streamParticle, random) => {
        streamParticle.x += random.next(2, 10);
        streamParticle.y += random.next(2, 10);
        const alphaDecrease = random.nextFloat(.005, .025);
        if (streamParticle.alpha > alphaDecrease) {
            streamParticle.alpha -= alphaDecrease;
        }
        return streamParticle;
    }
});

showerEffect.setOptions({
    type: "shower",
    coords: [128, 600],
    colors: ["#4ec5ff", "#9cdbff"]
});

showerEffect.create();
```

### deleteOwnEffect(type: string)

You can remove your effects using this function.

```js
showerEffect.deleteOwnEffect("shower");
```