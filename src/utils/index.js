export * from './color'
export * from './request'
export * from './strings'
export * from './loadLayouts'
export * from './files.js'

// Sanitize citation/source HTML for v-html, and turn bare http(s) URLs
// (e.g. a trailing "Available at https://…") into links.
const ALLOWED_TAGS = new Set(['A','B','I','EM','STRONG','BR','SPAN','P','UL','OL','LI','SUB','SUP'])
const ALLOWED_ATTR = { A: new Set(['href','target','rel']) }

export function sanitizeAndLinkifyHtml(input) {
  if (input == null) return ''
  const doc = new DOMParser().parseFromString(String(input), 'text/html')

  // strip disallowed tags/attributes
  const clean = (node) => {
    ;[...node.childNodes].forEach((child) => {
      if (child.nodeType !== 1) return
      if (!ALLOWED_TAGS.has(child.tagName)) { child.replaceWith(...child.childNodes); return }
      const allowed = ALLOWED_ATTR[child.tagName] || new Set()
      ;[...child.attributes].forEach((a) => {
        const bad = a.name === 'href' && /^\s*javascript:/i.test(a.value)
        if (!allowed.has(a.name.toLowerCase()) || bad) child.removeAttribute(a.name)
      })
      if (child.tagName === 'A' && child.getAttribute('href')) {
        child.setAttribute('target', '_blank'); child.setAttribute('rel', 'noopener noreferrer')
      }
      clean(child)
    })
  }
  clean(doc.body)

  // linkify bare URLs in text nodes (skip text already inside an <a>)
  const linkify = (node) => {
    ;[...node.childNodes].forEach((child) => {
      if (child.nodeType === 3) {
        const text = child.nodeValue
        const re = /https?:\/\/[^\s<]+/g
        if (!re.test(text)) return
        const frag = doc.createDocumentFragment(); let last = 0
        text.replace(re, (url, idx) => {
          if (idx > last) frag.appendChild(doc.createTextNode(text.slice(last, idx)))
          const a = doc.createElement('a')
          a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = url
          frag.appendChild(a); last = idx + url.length; return url
        })
        if (last < text.length) frag.appendChild(doc.createTextNode(text.slice(last)))
        child.replaceWith(frag)
      } else if (child.nodeType === 1 && child.tagName !== 'A') {
        linkify(child)
      }
    })
  }
  linkify(doc.body)

  return doc.body.innerHTML
}