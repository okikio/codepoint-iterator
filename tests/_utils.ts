import asCodePoints, { getIterableStream } from "../mod.ts";

export function createResponse(textLen = 1000, sliceLen = 30) {
  return new Response(
    new ReadableStream({
      async start(controller) {
        const txt = `:root { --px: 100px } .c\\\u{1F914} { width: var(--px); color: red; } /* \u{1F914}\u{1F914}\u{1F914} .pta-\\\u{1F914} { color: blue; } */`;
        const buffer = new TextEncoder().encode(
          txt.repeat(textLen)
        );
        let i = sliceLen, len = buffer.length - sliceLen;
        for (; i < len; i += sliceLen) {
          controller.enqueue(buffer.slice(i - sliceLen, i));
        }
        controller.enqueue(buffer.slice(len));
        controller.close();
      }
    })
  );
}

export async function asCodePointsBench() {
  const response = createResponse();
  const actualResult: number[] = [];

  for await (const codePoint of asCodePoints(getIterableStream(response.body!))) {
    actualResult.push(codePoint);
  }

  return actualResult;
}

const utf8Decoder = new TextDecoder("utf-8");
export async function TextDecoderBench() {
  const response = createResponse();
  const expectedResult: number[] = [];

  for await (const chunk of getIterableStream(response.body!)) {
    const str = chunk ? utf8Decoder.decode(chunk, { stream: true }) : "";

    for (const s of str) {
      const codePoint = s.codePointAt(0)!;
      expectedResult.push(codePoint);
    }
  }

  return expectedResult;
}