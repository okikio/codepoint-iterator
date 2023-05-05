# codepoint-iterator

[![Open Bundle](https://bundlejs.com/badge-light.svg)](https://bundlejs.com/?q=codepoint-iterator&bundle "Check the total bundle size of utf-8-uint8array")

[NPM](https://www.npmjs.com/package/codepoint-iterator) <span style="padding-inline: 1rem">|</span> [GitHub](https://github.com/okikio/codepoint-iterator#readme) <span style="padding-inline: 1rem">|</span> [Licence](./LICENSE)

<!-- Bundle size badge (unavailable) -->
<!-- [![Bundle Size](https://deno.bundlejs.com/api/badge?name=codepoint-iterator&style=flat)](https://bundlejs.com/?q=codepoint-iterator) -->

`codepoint-iterator` is a utility library that provides functions for converting an iterable of UTF-8 filled Uint8Array's into Unicode code points. The library supports both synchronous and asynchronous iterables and offers different ways to produce code points, including as an async generator, as an array, or by invoking a callback for each code point.

## Installation

### Deno

```ts
import { asCodePointsIterator, asCodePointsArray, asCodePointsCallback } from "https://deno.land/x/codepoint_iterator/mod.ts";
```

### NPM

```bash
npm install codepoint-iterator
```

<details>
    <summary>Others</summary>

```bash
yarn add codepoint-iterator
```

or

```bash
pnpm install codepoint-iterator
```

</details>

```ts
import { asCodePointsIterator, asCodePointsArray, asCodePointsCallback } from "codepoint-iterator";
```

## API

### `asCodePointsIterator(iterable)`

Converts an iterable of UTF-8 filled Uint8Array's into an async generator of Unicode code points.

### `asCodePointsArray(iterable)`

Converts an iterable of UTF-8 filled Uint8Array's into an array of Unicode code points.

### `asCodePointsCallback(iterable, cb)`

Processes an iterable of UTF-8 filled Uint8Array's and invokes a callback for each code point.

## Examples

### Using `asCodePointsIterator` with an async iterable tokenizer

```ts
import { asCodePointsIterator } from "codepoint-iterator";

async function* tokenizer(input) {
  // Simulate an async iterable that yields chunks of UTF-8 bytes
  for (const chunk of input) {
    yield new TextEncoder().encode(chunk);
  }
}

(async () => {
  const input = ["Hello", " ", "World!"];
  for await (const codePoint of asCodePointsIterator(tokenizer(input))) {
    console.log(String.fromCodePoint(codePoint));
  }
})();
```

### Using `asCodePointsArray` with ChatGPT or another AI workload

```ts
import { asCodePointsArray } from "codepoint-iterator";

// Simulate an AI workload that returns a response as an array of Uint8Array chunks
async function getAIResponse() {
  return [new TextEncoder().encode("Hello, "), new TextEncoder().encode("I am an AI.")];
}

(async () => {
  const responseChunks = await getAIResponse();
  const codePoints = await asCodePointsArray(responseChunks);
  const responseText = String.fromCodePoint(...codePoints);
  console.log(responseText);
})();
```

### Using `asCodePointsCallback` for a CSS tokenizer

```ts
import { asCodePointsCallback } from "codepoint-iterator";

function tokenizeCSS(css) {
  const tokens = [];
  let currentToken = "";

  asCodePointsCallback(new TextEncoder().encode(css), (codePoint) => {
    const char = String.fromCodePoint(codePoint);
    if (char === "{" || char === "}") {
      if (currentToken) {
        tokens.push(current
Token.trim());
currentToken = "";
}
tokens.push(char);
} else {
currentToken += char;
}
});

return tokens;
}

const css = `
body {
background-color: white;
color: black;
}

h1 {
font-size: 24px;
}
`;

const tokens = tokenizeCSS(css);
console.log(tokens);
// Output: [ 'body', '{', 'background-color: white;', 'color: black;', '}', 'h1', '{', 'font-size: 24px;', '}' ]
```

Usage with Async Iterables
The functions in codepoint-iterator support both synchronous and asynchronous iterables. This means you can use them with data sources that produce chunks of bytes asynchronously, such as file streams, network streams, or other async generators.

Here's an example of using asCodePointsIterator with an async iterable that reads chunks from a file:

```ts
import { asCodePointsIterator } from "codepoint-iterator";
import { createReadStream } from "fs";

const fileStream = createReadStream("example.txt");

(async () => {
for await (const codePoint of asCodePointsIterator(fileStream)) {
console.log(String.fromCodePoint(codePoint));
}
})();
```

In this example, we use the createReadStream function from the fs module to create a readable stream for a file. We then pass the stream to asCodePointsIterator, which processes the chunks of bytes and yields the corresponding Unicode code points.

Conclusion
codepoint-iterator is a versatile library that makes it easy to work with Unicode code points in JavaScript and TypeScript. Whether you're tokenizing text, processing AI responses, or working with file streams, codepoint-iterator provides a simple and efficient way to handle UTF-8 encoded data. Give it a try and see how it can simplify your code!