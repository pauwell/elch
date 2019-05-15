/*! elch | MIT License | https://github.com/pauwell/elch */

import parseHTML from '../util/parse-html';
import createVNode, { IVNode } from './../vdom/createVNode';

/** Translate a HTML view to VNodes.
 * @param view The view that should be parsed.
 */
const parseView = (view: string): IVNode => {
  // Handle missing view.
  if (!view || view.length <= 0) {
    return undefined;
  }

  // Parse the string view into HTML and get the root element.
  const htmlRoot: Element = parseHTML(
    view.replace(/{[\t ]*{/g, '<do js="">').replace(/}[\t ]*}/g, '</do>')
  )[0];

  // Build vNodes.
  return buildVNodes(htmlRoot);
};

/**
 * Parse HTML elements into vNodes.
 * @param htmlRoot The HTML root element.
 */
const buildVNodes = (htmlRoot: Element) => {
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
  for (const htmlChild of htmlChildren) {
    if (htmlChild.nodeType === Node.TEXT_NODE) {
      children.push(htmlChild.textContent);
    } else {
      children.push(buildVNodes(htmlChild as Element));
    }
  }
  return children;
};

/** Iterate over a set of HTML attributes and parse them into key-value pairs.
 * @param htmlAttributes The HTML node attributes that should be parsed.
 */
const parseAttributes = (htmlAttributes: NamedNodeMap): object => {
  if (htmlAttributes.length > 0) {
    return [...htmlAttributes]
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

export default parseView;
