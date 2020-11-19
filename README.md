<p align="center">
    <a href="https://rxjs-debug.github.io">
        <img width="700px" src="https://raw.githubusercontent.com/rxjs-debug/rxjs-debug/master/static/rxjs-debug-banner-shadow.svg"/>
    </a>
    <br/>
    <b>Automated RxJS Visualizer</b><br><br>
    <a aria-label="MIT license" href="https://github.com/rxjs-debug/rxjs-debug/blob/master/LICENSE">
        <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square&color=420690&labelColor=000">
    </a>
    <a aria-label="npm version" href="https://www.npmjs.com/package/rxjs-debug">
        <img src="https://img.shields.io/npm/v/rxjs-debug?style=flat-square&color=420690&labelColor=000">
    </a>
    <a aria-label="Discord chat" href="https://discord.gg/bw8juJEqu3">
        <img src="https://img.shields.io/badge/chat-discord-blue.svg?style=flat-square&color=420690&labelColor=000">
    </a>
</p>

```shell script
npm i rxjs-debug --save-dev
```

### Introduction

RxJS-Debug provides a single utility function to debug complicated RxJS streams.
It visualizes the piped-operators, subscriptions and completion.

### 🤾 [Playground](https://rxjs-debug.github.io)

### ⚡ Example

The utility function `$D` is the only API that RxJS-Debug has.
You can wrap an `Observable` with it and enable automated logging without any extra effort.

```typescript
// a simple observable
const source = of(1);

// wrap it with rxjs-debug
// you can also provide an optional id to identify the Observable
$D(source, {id: 'Special'}) // returns a copy of the original Observable with logging enabled
  // apply operators on it (optional)
  .pipe(
    map(x => x + 5),
    switchMap(x => of(x * 2)),
    delay(200)
  )
  .subscribe(); // activate the stream
```

This is what you'd get in the console

<img src="https://raw.githubusercontent.com/rxjs-debug/rxjs-debug/master/static/readme-example-output.png"/>

You can try it out [here](https://rxjs-debug.github.io).

### ✍ Notes

Please don't leave the `$D` in your production code/build, `rxjs-debug` is only meant to be used during development.
You should keep the `rxjs-debug` in your `devDependencies` and just use `$D` whenever you need it (for debugging).

### 🤝 Contributing

We appreciate your help with reporting issues and fixing bugs.
We also welcome your suggestions and feedback.

### ⚖ Licence

[MIT](https://github.com/rxjs-debug/rxjs-debug/blob/master/LICENSE)

### 💻 Author

[Ankit Singh](https://twitter.com/AlionBalyan)
