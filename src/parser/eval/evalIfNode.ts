/*! elch | MIT License | https://github.com/pauwell/elch */

import { ITemplate } from '../../module/template';

/**
 * Evaluate an`if`-node condition.
 * @param condition The condition to evaluate.
 * @param context The context in which it gets evaluated.
 */
const evalIfNode = (condition: string, context: ITemplate): boolean => {
  return Function(`return ${condition};`).call(context);
};

export default evalIfNode;
