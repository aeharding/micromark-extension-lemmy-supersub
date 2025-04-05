/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Extension} Extension
 * @typedef {import('micromark-util-types').State} State
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 * @typedef {import('micromark-util-types').TokenType} TokenType
 * @typedef {import('micromark-util-types').Code} Code
 */

import {markdownLineEndingOrSpace} from 'micromark-util-character'
import {codes, constants, types} from 'micromark-util-symbol'

const codeFor = {
  sup: codes.caret,
  sub: codes.tilde
}

/** @type {Extension} */
export const supersub = {
  text: {
    [codeFor.sub]: {
      tokenize: tokenizeSupersub
    },
    [codeFor.sup]: {
      tokenize: tokenizeSupersub
    }
  }
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeSupersub(effects, ok, nok) {
  /** @type {'sub' | 'sup'} */
  let type

  return start

  /** @type {State} */
  function start(code) {
    if (code === codeFor.sup) {
      type = 'sup'
    } else if (code === codeFor.sub) {
      type = 'sub'
    } else {
      return nok(code)
    }

    effects.enter(type)
    effects.enter(`${type}Marker`)
    effects.consume(code)
    effects.exit(`${type}Marker`)
    return data
  }

  /** @type {State} */
  function data(code) {
    if (code === codes.eof || markdownLineEndingOrSpace(code)) {
      return nok(code)
    }

    effects.enter(types.chunkText, {
      contentType: constants.contentTypeText
    })
    effects.consume(code)
    return content
  }

  /** @type {State} */
  function content(code) {
    if (code === codes.eof || markdownLineEndingOrSpace(code)) {
      return nok(code)
    }

    if (code === codes.backslash) {
      effects.consume(code)
      return escaped
    }

    if (code === codeFor[type]) {
      effects.exit(types.chunkText)
      effects.enter(`${type}Marker`)
      effects.consume(code)
      effects.exit(`${type}Marker`)
      effects.exit(type)
      return ok
    }

    effects.consume(code)
    return content
  }

  /** @type {State} */
  function escaped(code) {
    if (code === codeFor[type]) {
      effects.consume(code)
      return content
    }

    effects.consume(code)
    return content
  }
}
