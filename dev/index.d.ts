import type {Extension, HtmlExtension} from 'micromark-util-types'

export const supersub: Extension
export const supersubHtml: () => HtmlExtension

declare module 'micromark-util-types' {
  interface TokenTypeMap {
    sup: 'sup'
    sub: 'sub'
    supMarker: 'supMarker'
    subMarker: 'subMarker'
  }
}
