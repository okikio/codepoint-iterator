import { asCodePointsIterator } from "../mod.ts";
import { SPACE, LINE_FEED, CARRIAGE_RETURN, CHARACTER_TABULATION, LEFT_PARENTHESIS, RIGHT_PARENTHESIS, COLON, SEMICOLON, LEFT_CURLY_BRACKET, RIGHT_CURLY_BRACKET, COMMA, COMMERCIAL_AT, DIGIT_ZERO, DIGIT_NINE, LATIN_CAPITAL_LETTER_A, LATIN_CAPITAL_LETTER_Z, LATIN_SMALL_LETTER_A, LATIN_SMALL_LETTER_Z, FULL_STOP, NUMBER_SIGN } from "./_constants.ts";

// Define additional token types
type TokenType =
  | 'IDENTIFIER'
  | 'NUMBER'
  | 'STRING'
  | 'PUNCTUATION'
  | 'UNKNOWN'
  | 'MEDIA_QUERY'
  | 'NESTED_RULE'
  | 'COLOR'
  | 'LENGTH'
  | 'PERCENTAGE'
  | 'CALC'
  | 'URL'
  | 'ANGLE'
  | 'TIME'
  | 'FUNCTION'
  | 'AT_RULE'
  | 'CLASS_SELECTOR'
  | 'ID_SELECTOR';

// Define token structure
interface Token {
  type: TokenType;
  value: string;
}

// Define regular expressions for specific patterns
const colorRegex = /^#[0-9a-fA-F]+$/;
const lengthRegex = /^-?\d+(\.\d+)?px$/;
const percentageRegex = /^-?\d+(\.\d+)?%$/;
const angleRegex = /^-?\d+(\.\d+)?(deg|rad|grad|turn)$/;
const timeRegex = /^-?\d+(\.\d+)?(s|ms)$/;

// Define a utility function to check if a character is a digit
function isDigit(codePoint: number): boolean {
  return DIGIT_ZERO <= codePoint && codePoint <= DIGIT_NINE;
}

// Define a utility function to check if a character is a letter
function isLetter(codePoint: number): boolean {
  return (
    (LATIN_CAPITAL_LETTER_A <= codePoint && codePoint <= LATIN_CAPITAL_LETTER_Z) ||
    (LATIN_SMALL_LETTER_A <= codePoint && codePoint <= LATIN_SMALL_LETTER_Z)
  );
}

// Define the CSS tokenizer generator function
async function* cssTokenizer(input: AsyncIterable<number> | Iterable<number>): AsyncGenerator<Token> {
  let buffer = '';
  let tokenType: TokenType = 'UNKNOWN';
  let inFunction = false;
  let inAtRule = false;
  let inMediaQuery = false;

  const flushBuffer = function* () {
    if (buffer) {
      // Use regular expressions to match specific patterns
      if (colorRegex.test(buffer)) {
        tokenType = 'COLOR';
      } else if (lengthRegex.test(buffer)) {
        tokenType = 'LENGTH';
      } else if (percentageRegex.test(buffer)) {
        tokenType = 'PERCENTAGE';
      } else if (angleRegex.test(buffer)) {
        tokenType = 'ANGLE';
      } else if (timeRegex.test(buffer)) {
        tokenType = 'TIME';
      }
      yield { type: tokenType, value: buffer.trim() };
      buffer = '';
    }
  };

  for await (const codePoint of input) {
    switch (codePoint) {
      case SPACE:
      case LINE_FEED:
      case CARRIAGE_RETURN:
      case CHARACTER_TABULATION:
        if (buffer) {
          yield* flushBuffer();
        }
        break;
      case LEFT_PARENTHESIS:
        if (buffer.trim().toLowerCase() === 'calc') {
          tokenType = 'CALC';
          inFunction = true;
        } else if (buffer.trim().toLowerCase() === 'url') {
          tokenType = 'URL';
          inFunction = true;
        } else {
          tokenType = 'FUNCTION';
          inFunction = true;
        }
        buffer += String.fromCodePoint(codePoint);
        break;
      case RIGHT_PARENTHESIS:
        if (inFunction) {
          buffer += String.fromCodePoint(codePoint);
          yield* flushBuffer();
          inFunction = false;
        }
        break;
      case COLON:
      case SEMICOLON:
      case LEFT_CURLY_BRACKET:
      case RIGHT_CURLY_BRACKET:
      case COMMA:
        yield* flushBuffer();
        tokenType = 'PUNCTUATION';
        buffer += String.fromCodePoint(codePoint);
        if (codePoint === LEFT_CURLY_BRACKET && inMediaQuery) {
          inMediaQuery = false;
        }
        break;
      case COMMERCIAL_AT:
        yield* flushBuffer();
        tokenType = 'AT_RULE';
        inAtRule = true;
        buffer += String.fromCodePoint(codePoint);
        if (buffer.trim().toLowerCase() === '@media') {
          inMediaQuery = true;
        }
        break;
      case FULL_STOP:
        yield* flushBuffer();
        tokenType = 'CLASS_SELECTOR';
        buffer += String.fromCodePoint(codePoint);
        break;
      case NUMBER_SIGN:
        yield* flushBuffer();
        tokenType = 'ID_SELECTOR';
        buffer += String.fromCodePoint(codePoint);
        break;
      default:
        if (isDigit(codePoint)) {
          tokenType = 'NUMBER';
        } else if (isLetter(codePoint)) {
          tokenType = inMediaQuery ? 'MEDIA_QUERY' : (inAtRule ? 'AT_RULE' : 'IDENTIFIER');
        } else {
          tokenType = 'UNKNOWN';
        }
        buffer += String.fromCodePoint(codePoint);
        break;
    }
  }

  flushBuffer();
}

// Example usage of the CSS tokenizer
(async () => {
  const css = '@media screen and (max-width: 600px) { body { background-color: #f0f0f0; font-size: 14px; } .container { width: 100%; padding: 10px; } } ';
  for await (const token of cssTokenizer(asCodePointsIterator([new TextEncoder().encode(css)]))) {
    console.log(token);
  }

  /**
   * Result:
    { type: "AT_RULE", value: "@media" }
    { type: "AT_RULE", value: "screen" }
    { type: "AT_RULE", value: "and" }
    { type: "AT_RULE", value: "(max-width" }
    { type: "PUNCTUATION", value: ":" }
    { type: "AT_RULE", value: "600px)" }
    { type: "PUNCTUATION", value: "{" }
    { type: "AT_RULE", value: "body" }
    { type: "PUNCTUATION", value: "{" }
    { type: "AT_RULE", value: "background-color" }
    { type: "PUNCTUATION", value: ":" }
    { type: "COLOR", value: "#f0f0f0" }
    { type: "PUNCTUATION", value: ";" }
    { type: "AT_RULE", value: "font-size" }
    { type: "PUNCTUATION", value: ":" }
    { type: "LENGTH", value: "14px" }
    { type: "PUNCTUATION", value: ";" }
    { type: "PUNCTUATION", value: "}" }
    { type: "AT_RULE", value: ".container" }
    { type: "PUNCTUATION", value: "{" }
    { type: "AT_RULE", value: "width" }
    { type: "PUNCTUATION", value: ":" }
    { type: "PERCENTAGE", value: "100%" }
    { type: "PUNCTUATION", value: ";" }
    { type: "AT_RULE", value: "padding" }
    { type: "PUNCTUATION", value: ":" }
    { type: "LENGTH", value: "10px" }
    { type: "PUNCTUATION", value: ";" }
    { type: "PUNCTUATION", value: "}" }
    { type: "PUNCTUATION", value: "}" }
   */
})();