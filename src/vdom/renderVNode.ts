/*! elch | MIT License | https://github.com/pauwell/elch */

import { ITemplate } from '../module/template';
import evalDoEvent from '../parser/eval/evalDoEvent';
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
const renderElem = (vNode: IVNode, context: ITemplate): HTMLElement => {
  // Default values.
  vNode.attributes = vNode.attributes || {};
  vNode.children = vNode.children || [];

  // Check if its another template that needs instantiation.
  const findUsingTemplateIndex = context.using
    ? context.using.findIndex(
        (other) => other.template.name.toLowerCase() === vNode.tagName.toLowerCase()
      )
    : -1;

  // Create a new DOM node.
  const $el = document.createElement(vNode.tagName);

  if (findUsingTemplateIndex >= 0) {
    // Create a temporary child to render the template to.
    const $child = $el.appendChild(document.createElement('div'));
    context.using[findUsingTemplateIndex].mountTo($child);
    return $el.firstChild as HTMLElement;
  }

  // Insert attributes from the vNode into the DOM node.
  for (const [k, v] of Object.entries(vNode.attributes)) {
    if (k === 'do-event') {
      const doEvent = evalDoEvent(v, context);
      $el.addEventListener(doEvent.type, doEvent.listener);
      $el.removeAttribute('do-event');
    } else {
      $el.setAttribute(k, v as string);
    }
  }

  // Render child vNodes.
  for (const child of vNode.children) {
    // Recursively call this function again on child vNode.
    const $child = renderVNode(child, context);
    // Add the parsed child to the DOM node.
    $el.appendChild($child);
  }

  return $el;
};

const renderVNode = (vNode: IVNode | string, context: ITemplate): Text | HTMLElement => {
  if (typeof vNode === 'string') {
    // Render text node.
    return renderText(vNode);
  }
  // Render virtual node.
  return renderElem(vNode, context);
};

export default renderVNode;
