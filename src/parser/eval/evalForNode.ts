/*! elch | MIT License | https://github.com/pauwell/elch */

import { ITemplate } from '../../module/template';

/**
 * Evaluate a`for`-loop node.
 * @param condition The loop condition.
 * @param context The context in which it gets evaluated.
 */
const evalForNode = (forNode: HTMLSpanElement, condition: string, context: ITemplate): string => {
  const multipliedChildren: string[] = [];
  Function(
    'multipliedChildren', // The multiplied content of the for-node.
    'innerHTML', // The content of the for-node.
    `for(${condition}){
        multipliedChildren.push(innerHTML);
    }` // Add children in each loop.
  ).call(context, multipliedChildren, forNode.innerHTML);

  return multipliedChildren.join('');
};

export default evalForNode;
