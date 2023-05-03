import asCodePoints, { getIterableStream, asCodePoints2 } from "../mod.ts";

export function createResponse(textLen = 1000, sliceLen = 30) {
  return new Response(
    new ReadableStream({
      start(controller) {
        const txt = `:root { --px: 100px } .c\\\u{1F914} { width: var(--px); color: red; } /* \u{1F914}\u{1F914}\u{1F914} .pta-\\\u{1F914} { color: blue; } */`;
        const buffer = new TextEncoder().encode(
          txt.repeat(textLen)
        ); 
        
        const len = buffer.length - sliceLen;
        for (let i = sliceLen; i < len; i += sliceLen) {
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

export async function asCodePointsBench2() {
  const response = createResponse();
  const actualResult: number[] = [];

  for await (const codePoint of asCodePoints2(getIterableStream(response.body!))) {
    actualResult.push(codePoint);
  }

  return actualResult;
}
export async function TextDecoderBench() {
  const utf8Decoder = new TextDecoder("utf-8");
  const response = createResponse();
  const expectedResult: number[] = [];

  for await (const chunk of getIterableStream(response.body!)) {
    const str = chunk ? utf8Decoder.decode(chunk, { stream: true }) : "";

    for (const s of str) {
      const codePoint = s.codePointAt(0)!;
      expectedResult.push(codePoint);
    }
  }
  utf8Decoder.decode(new Uint8Array());
  return expectedResult;
}