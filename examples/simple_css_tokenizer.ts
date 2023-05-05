
import { asCodePointsCallback } from "../mod.ts";

function tokenizeCSS(css) {
  const tokens = [];
  let currentToken = "";

  asCodePointsCallback(new TextEncoder().encode(css), (codePoint) => {
    const char = String.fromCodePoint(codePoint);
    if (char === "{" || char === "}") {
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

const tokens = tokenizeCSS(css);
console.log(tokens);
// Output: [ 'body', '{', 'background-color: white;', 'color: black;', '}', 'h1', '{', 'font-size: 24px;', '}' ]