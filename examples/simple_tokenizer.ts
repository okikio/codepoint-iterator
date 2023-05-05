import { asCodePointsCallback } from "../mod.ts";

async function tokenizeCSS(css: string) {
  const tokens: string[] = [];
  let currentToken = "";

  // Create an array containing the Uint8Array object
  const cssChunks = [new TextEncoder().encode(css)];

  await asCodePointsCallback(cssChunks, (codePoint: number) => {
    const char = String.fromCodePoint(codePoint);
    if (char === '{' || char === '}') {
      if (currentToken) {
        tokens.push(currentToken.trim());
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

const tokens: string[] = await tokenizeCSS(css);
console.log(tokens);
// Output: [ 'body', '{', 'background-color: white;', 'color: black;', '}', 'h1', '{', 'font-size: 24px;', '}' ]

