/**
 * @typedef {import('micromark-util-types').CompileContext} CompileContext
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {micromark} from 'micromark'
import {supersub, supersubHtml} from '../dev/index.js'

test('micromark-extension-lemmy-supersub (core)', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('../dev/index.js')).sort(), [
      'supersub',
      'supersubHtml'
    ])
  })
})

test('micromark-extension-lemmy-supersub (syntax)', async function (t) {
  await t.test('should support superscript', async function () {
    assert.equal(micromark('x^2^', options()), '<p>x<sup>2</sup></p>')
  })

  await t.test('should support subscript', async function () {
    assert.equal(micromark('H~2~O', options()), '<p>H<sub>2</sub>O</p>')
  })

  await t.test(
    'should support multiple characters in superscript',
    async function () {
      assert.equal(micromark('x^(n+1)^', options()), '<p>x<sup>(n+1)</sup></p>')
    }
  )

  await t.test(
    'should support multiple characters in subscript',
    async function () {
      assert.equal(micromark('H~(2+)~O', options()), '<p>H<sub>(2+)</sub>O</p>')
    }
  )

  await t.test(
    'should not parse without closing marker (superscript)',
    async function () {
      assert.equal(micromark('x^2', options()), '<p>x^2</p>')
    }
  )

  await t.test(
    'should not parse without closing marker (subscript)',
    async function () {
      assert.equal(micromark('H~2O', options()), '<p>H~2O</p>')
    }
  )

  await t.test(
    'should not parse with space after opening marker',
    async function () {
      assert.equal(micromark('x^ 2^', options()), '<p>x^ 2^</p>')
    }
  )

  await t.test('should not parse with line break', async function () {
    assert.equal(micromark('x^2\n^', options()), '<p>x^2\n^</p>')
  })

  await t.test(
    'should not parse with space before closing marker',
    async function () {
      assert.equal(micromark('x^2 ^', options()), '<p>x^2 ^</p>')
    }
  )

  await t.test(
    'should not parse with space after opening tilde',
    async function () {
      assert.equal(micromark('H~ 2~O', options()), '<p>H~ 2~O</p>')
    }
  )

  await t.test(
    'should not parse with space before closing tilde',
    async function () {
      assert.equal(micromark('H~2 ~O', options()), '<p>H~2 ~O</p>')
    }
  )

  await t.test(
    'should support superscript at start of line',
    async function () {
      assert.equal(micromark('^2^', options()), '<p><sup>2</sup></p>')
    }
  )

  await t.test('should support subscript at start of line', async function () {
    assert.equal(micromark('~2~', options()), '<p><sub>2</sub></p>')
  })

  await t.test(
    'should support multiple super/subscripts in same line',
    async function () {
      assert.equal(
        micromark('x^2^ + y^2^ = z~i~ + k~j~', options()),
        '<p>x<sup>2</sup> + y<sup>2</sup> = z<sub>i</sub> + k<sub>j</sub></p>'
      )
    }
  )

  await t.test(
    'should NOT support nested super/subscripts like lemmy-ui',
    async function () {
      assert.equal(
        micromark('x^(2^n^)^', options()),
        '<p>x<sup>(2</sup>n<sup>)</sup></p>'
      )
    }
  )

  await t.test('should handle escaped opening caret', async function () {
    assert.equal(micromark('x\\^2^', options()), '<p>x^2^</p>')
  })

  await t.test('should handle escaped closing caret', async function () {
    assert.equal(micromark('x^2\\^', options()), '<p>x^2^</p>')
  })

  await t.test('should handle escaped opening tilde', async function () {
    assert.equal(micromark('H\\~2~O', options()), '<p>H~2~O</p>')
  })

  await t.test('should handle escaped closing tilde', async function () {
    assert.equal(micromark('H~2\\~O', options()), '<p>H~2~O</p>')
  })

  await t.test('should not parse mismatched markers', async function () {
    assert.equal(micromark('x^2~', options()), '<p>x^2~</p>')
  })

  await t.test('should not parse empty super/subscripts', async function () {
    assert.equal(micromark('x^^', options()), '<p>x^^</p>')
    assert.equal(micromark('x~~', options()), '<p>x~~</p>')
  })
})

/**
 * @returns {{
 *   extensions: Array<import('micromark-util-types').Extension>
 *   htmlExtensions: Array<import('micromark-util-types').HtmlExtension>
 * }}
 */
function options() {
  return {
    extensions: [supersub],
    htmlExtensions: [supersubHtml()]
  }
}
