/*! elch | MIT License | https://github.com/pauwell/elch */

import { ITemplate } from '../../module/template';

/**
 * Evaluate `event`-nodes.
 * @param statement The statement that needs to be evaluated.
 * @param context The context in which it gets used.
 */
const evalDoEvent = (statement: string, context: ITemplate) => {
  const eventType = statement.split(':')[0];
  const eventListener = context.logic[statement.split(':')[1]] || null;
  return {
    type: eventType,
    listener: eventListener
  };
};

export default evalDoEvent;
