import asCodePoints, { getIterableStream } from "../mod.ts";


// Optimized asCodePoints function with batched code point extraction
export function* textDecoderCodepointIterator<T = string>(
  iterable: IterableIterator<T>
) {
  const utf8Decoder = new TextDecoder("utf-8");

  for (const str of iterable) {
    // Extract code points in larger batches
    let i = 0;
    while (i < (str as string).length) {
      const codePoint = (str as string).codePointAt(i)!;
      yield codePoint;
      i += codePoint > 0xFFFF ? 2 : 1; // Adjust index based on code point size
    }
  }

  // Flush the decoder's internal state
  utf8Decoder.decode(new Uint8Array());
}

// CSS Tokenizer
// AsyncIterator<T> | Iterator<T> | 
function* cssTokenizer<T = string>(iterator: IterableIterator<T>) {
  let token = '';
  const emitToken = () => {
    if (token) {
      const emittedToken = token;
      token = '';
      return emittedToken;
    }
  };

  console.log({ iterator: Array.from(textDecoderCodepointIterator(iterator)) })
  for (const codePoint of asCodePoints(iterator)) {
    const char = String.fromCodePoint(codePoint);
    if (char === '{' || char === '}' || char === ';') {
      yield emitToken();
      yield char;
    } else if (char === ' ' || char === '\n') {
      yield emitToken();
    } else {
      token += char;
    }
  }
  yield emitToken();
}

// Example usage with a simple iterable
const css = `
body {
  background-color: white;
  color: black;
}
`;
const iterator = css[Symbol.iterator]();
const tokens: string[] = [];
for (const t of cssTokenizer(iterator)) {
  if (t) {
    tokens.push(t);
  }
}
console.log(tokens);