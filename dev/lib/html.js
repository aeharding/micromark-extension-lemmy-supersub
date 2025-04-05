/**
 * @typedef {import('micromark-util-types').CompileContext} CompileContext
 * @typedef {import('micromark-util-types').Handle} _Handle
 * @typedef {import('micromark-util-types').HtmlExtension} HtmlExtension
 */

/**
 * Create an extension for `micromark` to support superscript and subscript when serializing
 * to HTML.
 *
 * @returns {HtmlExtension}
 *   Extension for `micromark` that can be passed in `htmlExtensions`, to
 *   support superscript and subscript when serializing to HTML.
 */
export function supersubHtml() {
  return {
    enter: {
      sup() {
        this.tag('<sup>')
      },
      sub() {
        this.tag('<sub>')
      }
    },
    exit: {
      sup() {
        this.tag('</sup>')
      },
      sub() {
        this.tag('</sub>')
      }
    }
  }
}
