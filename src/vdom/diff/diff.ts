/*! elch | MIT License | https://github.com/pauwell/elch */

import { ITemplate } from '../../module/template';
import { IVNode } from '../createVNode';
import renderVNode from '../renderVNode';
import diffAttributes from './diffAttributes';
import diffChildren from './diffChildren';

/**
 * Creating a patch to merge changes in the vNodes into the DOM root.
 * @param oldVTree The current vNode tree.
 * @param newVTree The new vNode tree.
 */
const diff = (
  oldVTree: IVNode | string,
  newVTree: IVNode | string,
  context: ITemplate
): ((node: HTMLElement | Text) => HTMLElement | Text) => {
  // Assuming oldVTree is not undefined.
  if (newVTree === undefined) {
    return (node) => {
      node.remove();
      // Returning undefined because there is no new node.
      return undefined;
    };
  }

  // If one or both trees are text nodes.
  if (typeof oldVTree === 'string' || typeof newVTree === 'string') {
    if (oldVTree !== newVTree) {
      // If they differ, just render the new tree.
      return (node) => {
        const newNode = renderVNode(newVTree, context);
        node.replaceWith(newNode);
        return newNode;
      };
    } else {
      // If they are the same just return the current node.
      return (node) => node;
    }
  }

  // If the tag names differ there is no point in attempting
  // To find the differences and we simply render the new tree.
  if (oldVTree.tagName !== newVTree.tagName) {
    return (node) => {
      const newNode = renderVNode(newVTree, context);
      node.replaceWith(newNode);
      return newNode;
    };
  }

  // At this point we can safely assume that:
  // 1. Both trees are virtual elements.
  // 2. Both have the same tag name.
  // 3. Their attributes and children may be different.

  // Create a patch for the attributes.
  const patchAttributes = diffAttributes(oldVTree.attributes, newVTree.attributes, context);

  // Create a patch for the child nodes.
  const patchChildren = diffChildren(oldVTree.children, newVTree.children, context);

  return (node) => {
    // Resolve the patches and return the node.
    patchAttributes(node);
    patchChildren(node);
    return node;
  };
};

export default diff;
