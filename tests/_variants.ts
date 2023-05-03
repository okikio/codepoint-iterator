import { UTF8_MAX_BYTE_LENGTH, getByteLength, bytesToCodePointFromBuffer, getIterableStream } from "../mod.ts";
import { createResponse } from "./_utils.ts";

// Optimized asCodePoints function with batched code point extraction
export async function* textDecoderCodepointIterator<T = Uint8Array>(
  iterable: AsyncIterable<T> | Iterable<T>
) {
  const utf8Decoder = new TextDecoder("utf-8");

  for await (const bytes of iterable) {
    const str = utf8Decoder.decode(bytes as Uint8Array, { stream: true });

    // Extract code points in larger batches
    let i = 0;
    while (i < str.length) {
      const codePoint = str.codePointAt(i)!;
      yield codePoint;
      i += codePoint > 0xFFFF ? 2 : 1; // Adjust index based on code point size
    }
  }

  // Flush the decoder's internal state
  utf8Decoder.decode(new Uint8Array());
}