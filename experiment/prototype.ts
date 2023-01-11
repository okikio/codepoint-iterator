// deno-lint-ignore-file require-yield
import { asCodePoints } from '../mod.ts'
import * as cp from './code_points.ts'

const textEncoder = new TextEncoder()

const generateIterableBuffer = () => {
  const buffer = textEncoder.encode(`/* comment */ "hello" 5em`)

  return [ buffer ].values()
}

class Tokenizer {
  state: string
  codePointAt0: number
  index: number

  constructor(
    public iterable: IterableIterator<Uint8Array>
  ) {
    this.state = 'token'
    this.codePointAt0 = -1
    this.index = 0
  }

  async * [Symbol.asyncIterator]() {
    for await (const codePoint of asCodePoints(this.iterable)) {
      switch (this.state) {
        case 'token':
          yield * this.consumeToken(codePoint)
          break
        case 'pre.comment':
          yield * this.consumePreComment(codePoint)
          break
        case 'delimiter':
          yield * this.consumeDelimiter(codePoint)
          break
        case 'space':
          yield* this.consumeSpace(codePoint)
          break
      }
    }
  }

  async * consumeToken(codePoint: number) {
    switch (true) {
      case codePoint === cp.SOLIDUS:
        this.state = 'pre.comment'
        break
      case codePoint === cp.SPACE:
        this.state = 'space'
        break
      default:
        this.state = 'delimiter'
    }
  }

  async * consumePreComment(codePoint: number) {
    if (codePoint === cp.ASTERISK) {
      yield { type: 'Comment', value: '', index: this.index }

      this.state = 'pre-comment'
    }
  }

  async * consumeDelimiter(codePoint: number) {
    yield { type: 'Delimiter', codePoint }

    this.index += 1
    this.state = 'token'
  }

  async * consumeSpace(codePoint: number) {
    yield { type: 'Space', codePoint }

    this.index += 1
    this.state = 'token'
  }
}

for await (const token of new Tokenizer(generateIterableBuffer())) {
  console.log({ token })
}
