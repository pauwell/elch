/*! elch | MIT License | https://github.com/pauwell/elch */

/** Mount a DOM node to a given root node.
 * @param node The node that should be mounted.
 * @param target The targeted node that should be replaced.
 */
export default (node: HTMLElement | Text, target: HTMLElement): HTMLElement => {
  target.replaceWith(node);
  return node as HTMLElement;
};
