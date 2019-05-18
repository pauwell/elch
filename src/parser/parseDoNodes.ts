/*! elch | MIT License | https://github.com/pauwell/elch */

import parseHTML from '../util/parse-html';
import evalForNode from './eval/evalForNode';
import evalIfNode from './eval/evalIfNode';
import evalJSNode from './eval/evalJSNode';

const parseDoNodes = (view: string, context: any) => {
  console.log('Parsing do-nodes');

  // Parse the string view into HTML and get the root element.
  const htmlRoot: Element = parseHTML(
    view.replace(/{[\t ]*{/g, '<do js="">').replace(/}[\t ]*}/g, '</do>')
  )[0];

  return parseNodes(htmlRoot as HTMLElement, context);
};

/**
 * Call this function recusively
 * @param htmlRoot The root HTML element.
 * @param context The context in which the statements are evaluated.
 */
const parseNodes = (htmlRoot: HTMLElement, context: any): HTMLElement => {
  // Get next do-node.
  const doNode: HTMLElement = htmlRoot.querySelector('do[if], do[for], do[js]');

  // Stop parsing if no more nodes are left.
  if (doNode == null) {
    return htmlRoot;
  }

  // Create new node to replace the `do`-node.
  const newNode = document.createElement('span');
  newNode.innerHTML = doNode.innerHTML;

  if (doNode.hasAttribute('js')) {
    newNode.innerText = evalJSNode(doNode.textContent, context);
    doNode.parentNode.replaceChild(newNode, doNode);
  } else if (doNode.hasAttribute('if')) {
    // If statement false => return root?
    if (evalIfNode(doNode.getAttribute('if'), context) === false) {
      doNode.parentNode.removeChild(doNode);
    } else {
      doNode.parentNode.replaceChild(newNode, doNode);
    }
  } else if (doNode.hasAttribute('for')) {
    newNode.innerHTML = evalForNode(newNode, doNode.getAttribute('for'), context);
    doNode.parentNode.replaceChild(newNode, doNode);
  }

  // Call this function again recursively with the modified root.
  return parseNodes(htmlRoot, context);
};

/**
 * Types of `do`-nodes.
 */
enum DoNodeType {
  None,
  Js,
  If,
  For
}

/**
 * Get the type of a given `do`-node
 * @param node The targeted node.
 */
const getDoNodeType = (node: HTMLElement): DoNodeType => {
  return node.hasAttribute('for')
    ? DoNodeType.For
    : node.hasAttribute('if')
    ? DoNodeType.For
    : node.hasAttribute('js')
    ? DoNodeType.Js
    : DoNodeType.None;
};

export default parseDoNodes;
