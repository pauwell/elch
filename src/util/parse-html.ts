/*! elch | MIT License | https://github.com/pauwell/elch */

/**
 * Parse a string to a HTML collection.
 * @param html Input string to parse.
 * @returns The resulting HTML collection.
 */
export default function(html: string): HTMLCollection {
  const newDocument = document.implementation.createHTMLDocument();
  newDocument.body.innerHTML = html;
  return newDocument.body.children;
}
