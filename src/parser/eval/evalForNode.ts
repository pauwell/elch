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
    'replaceLoopVarsInHTML', // Evaluate the inner appearances of the loop variable.
    `let loopVar;
      if(/^var |^let /.test('${condition}')){
        loopVar = '${condition}'.slice(
          '${condition}'.indexOf(' '),
          '${condition}'.indexOf('=')
        ).trim();
      }
    for(${condition}){
        if(loopVar){
          multipliedChildren.push(replaceLoopVarsInHTML(loopVar, eval(loopVar), innerHTML));
        } else{
          multipliedChildren.push(innerHTML);
        }
    }` // Add children in each loop.
  ).call(context, multipliedChildren, forNode.innerHTML, replaceLoopVarsInHTML);

  return multipliedChildren.join('');
};

/**
 * Find loop variables in HTML (e.g. $i, $xyz) and replace them with their actual value.
 * @param loopVar The name of the variable.
 * @param varValue The actual value of the variable.
 * @param innerHTML The HTML that needs to be replaced.
 */
const replaceLoopVarsInHTML = (loopVar: string, varValue: number, innerHTML: string) => {
  // Naive solution, just replace:
  while (innerHTML.indexOf('$' + loopVar) >= 0) {
    innerHTML = innerHTML.replace('$' + loopVar, String(varValue));
  }

  // Fix this solution please:
  /* const findVarRegex = /<do.*?js.*?>.*?(\$i).*?<\/do>/;
  while (findVarRegex.test(innerHTML)) {
    innerHTML = innerHTML.replace(findVarRegex, String(varValue));
  } */
  return innerHTML;
};

export default evalForNode;
