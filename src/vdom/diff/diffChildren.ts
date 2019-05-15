/*! elch | MIT License | https://github.com/pauwell/elch */

import { IVNode } from '../createVNode';
import renderVNode from '../renderVNode';
import diff from './diff';

/** Compares the new child list with the old one and creates
 * a patch for the DOM-parent to apply the necessary changes.
 * @param oldChildren The old list of children.
 * @param newChildren The new list of children.
 */
const diffChildren = (oldChildren: Array<IVNode | string>, newChildren: Array<IVNode | string>) => {
  // Defaults for undefined.
  oldChildren = oldChildren || [];
  newChildren = newChildren || [];

  // Loop through all old children and diff them.
  const childPatches: Array<(node: HTMLElement | Text) => HTMLElement | Text> = [];
  oldChildren.forEach((oldChild, i) => {
    childPatches.push(diff(oldChild, newChildren[i]));
  });

  // Render additional children (if any) and append them to the node.
  const additionalPatches: Array<(node: HTMLElement | Text) => HTMLElement | Text> = [];
  for (const additionalChild of newChildren.slice(oldChildren.length)) {
    additionalPatches.push((node: HTMLElement | Text) => {
      node.appendChild(renderVNode(additionalChild));
      return node;
    });
  }

  return (parent: HTMLElement | Text) => {
    // Apply diffed child patches. Use parent.
    parent.childNodes.forEach((child, i) => {
      childPatches[i](child as (HTMLElement | Text));
    });

    // Apply additional child patches.
    for (const patch of additionalPatches) {
      patch(parent);
    }

    return parent;
  };
};

export default diffChildren;
