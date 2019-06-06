/*! elch | MIT License | https://github.com/pauwell/elch */

import { ITemplate } from '../../module/template';

/**
 * Evaluate sandboxed `js`-expression nodes.
 * @param statement The statement that gets evaluated.
 * @param context The context in which it should be evaluated.
 */
const evalJSNode = (statement: string, context: ITemplate): string => {
  // Trim to search for property.
  statement = statement.trim();

  // Evaluate state variable.
  if (context.state.hasOwnProperty(statement)) {
    return context.state[statement];
  }

  // Evaluate logic function.
  if (context.logic.hasOwnProperty(statement)) {
    return context.logic[statement]();
  }

  // Evaluate expression.
  return new Function('return ' + statement + ';').call(context);
};

export default evalJSNode;
