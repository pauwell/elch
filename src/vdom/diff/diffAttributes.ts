'use strict';

/**
 * Compares the new attribute-list with the old one and creates
 * a patch for the DOM-parent to apply the necessary changes.
 * @param oldAttributes The old list of attributes.
 * @param newAttributes The new list of attributes.
 */
const diffAttributes = (oldAttributes: object, newAttributes: object) => {
  // Defaults for undefined.
  oldAttributes = oldAttributes || {};
  newAttributes = newAttributes || {};

  // Adding new attributes to the node.
  const patches: Array<(node: HTMLElement | Text) => HTMLElement | Text> = [];
  for (const [attrKey, attrValue] of Object.entries(newAttributes)) {
    patches.push((node: HTMLElement | Text) => {
      if (typeof node !== 'string') {
        (node as HTMLElement).setAttribute(attrKey, attrValue);
      }
      return node;
    });
  }

  // Removing the old attributes.
  for (const attrKey in oldAttributes) {
    if (!(attrKey in newAttributes)) {
      // Remove the attributes if its not on the new attributes list.
      patches.push((node: HTMLElement | Text) => {
        if (typeof node !== 'string') {
          (node as HTMLElement).removeAttribute(attrKey);
        }
        return node;
      });
    }
  }

  // Apply the patches.
  return (node: HTMLElement | Text) => {
    for (const patch of patches) {
      patch(node);
    }
    return node;
  };
};

export default diffAttributes;
