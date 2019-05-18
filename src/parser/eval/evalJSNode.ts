/*! elch | MIT License | https://github.com/pauwell/elch */

import { ITemplate } from '../../module/template';

// TODO impl.
const evalJSNode = (statement: string, context: ITemplate): string => {
  // Evaluate state variable.
  if (context.state.hasOwnProperty(statement)) {
    return context[statement];
  }

  // Evaluate logic function.
  if (context.logic.hasOwnProperty(statement)) {
    return context[statement]();
  }

  // TODO handle error.
  return 'Unknown variable: ' + statement;
};

export default evalJSNode;
