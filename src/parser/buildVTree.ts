/*! elch | MIT License | https://github.com/pauwell/elch */

import createVNode, { IVNode } from '../vdom/createVNode';

/**
 * Parse HTML elements into a `vNode`-tree.
 * @param htmlRoot The HTML root element.
 */
const buildVTree = (htmlRoot: Element) => {
  return createVNode(
    htmlRoot.tagName,
    parseAttributes(htmlRoot.attributes),
    parseChildren(htmlRoot.childNodes)
  );
};

/** Parse a set of HTML children into an array of vNodes.
 * @param htmlChildren The HTML child nodes to parse.
 */
const parseChildren = (htmlChildren: NodeListOf<ChildNode>): Array<IVNode | string> => {
  const children: Array<IVNode | string> = [];
  for (const htmlChild of htmlChildren as any) {
    if (htmlChild.nodeType === Node.TEXT_NODE) {
      children.push(htmlChild.textContent);
    } else {
      children.push(buildVTree(htmlChild as Element));
    }
  }
  return children;
};

/** Iterate over a set of HTML attributes and parse them into key-value pairs.
 * @param htmlAttributes The HTML node attributes that should be parsed.
 */
const parseAttributes = (htmlAttributes: NamedNodeMap): object => {
  if (htmlAttributes.length > 0) {
    // Convert nodemap to array because browserify fails on [...htmlAttributes].
    const htmlAttributesArray: Attr[] = [];
    for (let prop = 0; prop < htmlAttributes.length; ++prop) {
      if (prop in htmlAttributes) {
        htmlAttributesArray.push(htmlAttributes[prop]);
      }
    }
    return htmlAttributesArray
      .map((htmlAttribute: Attr) => {
        // Create the correct key-value format.
        return {
          [htmlAttribute.name]: htmlAttribute.value || ''
        };
      })
      .reduce((total: { [x: string]: string }, curr: { [x: string]: string }) => {
        // Join the properties together.
        total = { ...total, ...curr };
        return total;
      });
  }

  return {};
};

export default buildVTree;
