'use strict';

/** A virtual node. */
export interface IVNode {
  tagName: string;
  attributes?: object;
  children?: Array<IVNode | string>;
}

/** Create a new virtual node.
 * @param tagName The HTML tag of the node.
 * @param attributes The attributes of the node.
 * @param children The child nodes.
 */
export default (
  tagName: string,
  attributes?: object,
  children?: Array<IVNode | string>
): IVNode => {
  return {
    attributes: attributes || {},
    children: children || [],
    tagName
  };
};
