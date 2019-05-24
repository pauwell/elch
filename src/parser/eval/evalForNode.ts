/*! elch | MIT License | https://github.com/pauwell/elch */

import { ITemplate } from '../../module/template';

/**
 * Evaluate a`for`-loop node.
 * @param condition The loop condition.
 * @param context The context in which it gets evaluated.
 */
const evalForNode = (forNode: HTMLSpanElement, condition: string, context: ITemplate): string => {
  const multipliedChildren: string[] = [];

  // TODO: Variable context.

  Function(
    'multipliedChildren', // The multiplied content of the for-node.
    'innerHTML', // The content of the for-node.
    'replaceLoopVarsInHTML', // Evaluate the inner appearances of the loop variable.
    `let loopVar;
      if(/^var |^let /.test('${condition}')){
        console.log('${condition}'.slice('${condition}'.indexOf(' '), '${condition}'.indexOf('=')).trim());
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
 * TODO
 * @param loopVar TODO
 * @param innerHTML TODO
 */
const replaceLoopVarsInHTML = (loopVar: string, varValue: number, innerHTML: string) => {
  // TODO only replace the variables between mustaches {{ $i }}
  /* const findVarRegex = /{{.*?(\$i).*?}}/g;
  while (findVarRegex.test(innerHTML)) {
    innerHTML.replace(findVarRegex, loopVar);
  } */
  while (innerHTML.indexOf('$' + loopVar) >= 0) {
    innerHTML = innerHTML.replace('$' + loopVar, String(varValue));
  }

  return innerHTML;
};

export default evalForNode;
