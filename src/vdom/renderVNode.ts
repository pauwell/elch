/*! elch | MIT License | https://github.com/pauwell/elch */

import { IVNode } from './createVNode';

/** Translate a string into a DOM text node.
 * @param vNode The content of the text node.
 */
const renderText = (vNode: string): Text => {
  return document.createTextNode(vNode);
};

/** Translate a vNode into a DOM node.
 * @param vNode The vNode that should be rendered.
 */
const renderElem = (vNode: IVNode): HTMLElement => {
  // Default values.
  vNode.attributes = vNode.attributes || {};
  vNode.children = vNode.children || [];

  // Create a new DOM node.
  const $el = document.createElement(vNode.tagName);

  // Insert attributes from the vNode into the DOM node.
  for (const [k, v] of Object.entries(vNode.attributes)) {
    $el.setAttribute(k, v as string);
  }

  // Render child vNodes.
  for (const child of vNode.children) {
    // Recursively call this function again on child vNode.
    const $child = renderVNode(child);
    // Add the parsed child to the DOM node.
    $el.appendChild($child);
  }

  return $el;
};

const renderVNode = (vNode: IVNode | string): Text | HTMLElement => {
  if (typeof vNode === 'string') {
    // Render text node.
    return renderText(vNode);
  }
  // Render virtual node.
  return renderElem(vNode);
};

export default renderVNode;
