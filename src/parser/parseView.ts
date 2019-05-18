/*! elch | MIT License | https://github.com/pauwell/elch */

import parseHTML from '../util/parse-html';
import createVNode, { IVNode } from './../vdom/createVNode';
import buildVTree from './buildVTree';
import parseDoNodes from './parseDoNodes';

/** Translate a HTML view to VNodes.
 * @param view The view that should be parsed.
 * @param context Provide the context in which the statements are evaluated.
 */
const parseView = (view: string, context: any): IVNode => {
  // Handle missing view.
  if (!view || view.length <= 0) {
    return undefined;
  }

  // Parse do-nodes.
  const htmlRoot = parseDoNodes(view, context);

  // Build vNodes.
  return buildVTree(htmlRoot);
};

export default parseView;
