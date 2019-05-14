(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Elch = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const template_1 = require("./module/template");
//  This is the main entry.
// Just expose the template.
module.exports = template_1.default;

},{"./module/template":2}],2:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const parseView_1 = require("../parser/parseView");
const diff_1 = require("../vdom/diff/diff");
const mount_1 = require("../vdom/mount");
const renderVNode_1 = require("../vdom/renderVNode");
class Template {
    /**
     * TODO
     * @param properties TODO
     */
    constructor(properties) {
        this._stateChanged = false;
        this.create(properties);
    }
    /**
     * TODO
     * @param properties TODO
     */
    create(properties) {
        // Initialize the template.
        this._template = properties;
        // Add get, set to all properties of this._template.state.
        const stateProperties = [];
        for (const stateProp in this._template.state) {
            if (this._template.state.hasOwnProperty(stateProp)) {
                stateProperties.push(stateProp);
            }
        }
        stateProperties.forEach((property) => {
            Object.defineProperty(this._template.state, property, {
                get() {
                    console.log('Calling getter for ' + property);
                    return property;
                },
                set(value) {
                    property = value;
                    console.log('Calling setter for ' + property);
                    // this._stateChanged = true; TODO access `this`.
                }
            });
        });
        // Bind `state` as context to `logic`-methods.
        for (const logicProp in this._template.logic) {
            if (this._template.logic.hasOwnProperty(logicProp)) {
                this._template.logic[logicProp] = this._template.logic[logicProp].bind(this._template.state);
            }
        }
        // Parse the string view into virtual nodes.
        this._parsedView = parseView_1.default(this._template.view());
    }
    /**
     * TODO
     */
    update() {
        // Parse the string view into virtual nodes.
        const newParsedView = parseView_1.default(this._template.view());
        // Create patches for the DOM by diffing with the old view.
        const patch = diff_1.default(this._parsedView, newParsedView);
        // Apply the created patches to the root element.
        this._rootElement = patch(this._rootElement);
        // Update the internal reference.
        this._parsedView = newParsedView;
    }
    /** Render the vNode view and insert it into the DOM. This usually gets called once.
     * @param rootEl The DOM element that will be replaced by the rendered view.
     */
    mountTo(rootEl) {
        // Render the view.
        this._renderedView = renderVNode_1.default(this._parsedView);
        // Replace the root element with the result.
        this._rootElement = mount_1.default(this._renderedView, rootEl);
    }
}
exports.default = Template;

},{"../parser/parseView":3,"../vdom/diff/diff":6,"../vdom/mount":9,"../vdom/renderVNode":10}],3:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const parse_html_1 = require("../util/parse-html");
const createVNode_1 = require("./../vdom/createVNode");
/** Translate a HTML view to VNodes.
 * @param view The view that should be parsed.
 */
const parseView = (view) => {
    // Handle missing view.
    if (!view || view.length <= 0) {
        return undefined;
    }
    // Parse the string view into HTML and get the root element.
    const htmlRoot = parse_html_1.default(view.replace(/{[\t ]*{/g, '<do js="">').replace(/}[\t ]*}/g, '</do>'))[0];
    // Build vNodes.
    return buildVNodes(htmlRoot);
};
/**
 * Parse HTML elements into vNodes.
 * @param htmlRoot The HTML root element.
 */
const buildVNodes = (htmlRoot) => {
    return createVNode_1.default(htmlRoot.tagName, parseAttributes(htmlRoot.attributes), parseChildren(htmlRoot.childNodes));
};
/** Parse a set of HTML children into an array of vNodes.
 * @param htmlChildren The HTML child nodes to parse.
 */
const parseChildren = (htmlChildren) => {
    const children = [];
    for (const htmlChild of htmlChildren) {
        if (htmlChild.nodeType === Node.TEXT_NODE) {
            children.push(htmlChild.textContent);
        }
        else {
            children.push(buildVNodes(htmlChild));
        }
    }
    return children;
};
/** Iterate over a set of HTML attributes and parse them into key-value pairs.
 * @param htmlAttributes The HTML node attributes that should be parsed.
 */
const parseAttributes = (htmlAttributes) => {
    if (htmlAttributes.length > 0) {
        return [...htmlAttributes]
            .map((htmlAttribute) => {
            // Create the correct key-value format.
            return {
                [htmlAttribute.name]: htmlAttribute.value || ''
            };
        })
            .reduce((total, curr) => {
            // Join the properties together.
            total = Object.assign({}, total, curr);
            return total;
        });
    }
    return {};
};
exports.default = parseView;

},{"../util/parse-html":4,"./../vdom/createVNode":5}],4:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Parse a string to a HTML collection.
 * @param html Input string to parse.
 * @returns The resulting HTML collection.
 */
function default_1(html) {
    const newDocument = document.implementation.createHTMLDocument();
    newDocument.body.innerHTML = html;
    return newDocument.body.children;
}
exports.default = default_1;

},{}],5:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/** Create a new virtual node.
 * @param tagName The HTML tag of the node.
 * @param attributes The attributes of the node.
 * @param children The child nodes.
 */
exports.default = (tagName, attributes, children) => {
    return {
        attributes: attributes || {},
        children: children || [],
        tagName
    };
};

},{}],6:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const renderVNode_1 = require("../renderVNode");
const diffAttributes_1 = require("./diffAttributes");
const diffChildren_1 = require("./diffChildren");
/**
 * Creating a patch to merge changes in the vNodes into the DOM root.
 * @param oldVTree The current vNode tree.
 * @param newVTree The new vNode tree.
 */
const diff = (oldVTree, newVTree) => {
    // Assuming oldVTree is not undefined.
    if (newVTree === undefined) {
        return (node) => {
            node.remove();
            // Returning undefined because there is no new node.
            return undefined;
        };
    }
    // If one or both trees are text nodes.
    if (typeof oldVTree === 'string' || typeof newVTree === 'string') {
        if (oldVTree !== newVTree) {
            // If they differ, just render the new tree.
            return (node) => {
                const newNode = renderVNode_1.default(newVTree);
                node.replaceWith(newNode);
                return newNode;
            };
        }
        else {
            // If they are the same just return the current node.
            return (node) => node;
        }
    }
    // If the tag names differ there is no point in attempting
    // To find the differences and we simply render the new tree.
    if (oldVTree.tagName !== newVTree.tagName) {
        return (node) => {
            const newNode = renderVNode_1.default(newVTree);
            node.replaceWith(newNode);
            return newNode;
        };
    }
    // At this point we can safely assume that:
    // 1. Both trees are virtual elements.
    // 2. Both have the same tag name.
    // 3. Their attributes and children may be different.
    // Create a patch for the attributes.
    const patchAttributes = diffAttributes_1.default(oldVTree.attributes, newVTree.attributes);
    // Create a patch for the child nodes.
    const patchChildren = diffChildren_1.default(oldVTree.children, newVTree.children);
    return (node) => {
        // Resolve the patches and return the node.
        patchAttributes(node);
        patchChildren(node);
        return node;
    };
};
exports.default = diff;

},{"../renderVNode":10,"./diffAttributes":7,"./diffChildren":8}],7:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Compares the new attribute-list with the old one and creates
 * a patch for the DOM-parent to apply the necessary changes.
 * @param oldAttributes The old list of attributes.
 * @param newAttributes The new list of attributes.
 */
const diffAttributes = (oldAttributes, newAttributes) => {
    // Defaults for undefined.
    oldAttributes = oldAttributes || {};
    newAttributes = newAttributes || {};
    // Adding new attributes to the node.
    const patches = [];
    for (const [attrKey, attrValue] of Object.entries(newAttributes)) {
        patches.push((node) => {
            if (typeof node !== 'string') {
                node.setAttribute(attrKey, attrValue);
            }
            return node;
        });
    }
    // Removing the old attributes.
    for (const attrKey in oldAttributes) {
        if (!(attrKey in newAttributes)) {
            // Remove the attributes if its not on the new attributes list.
            patches.push((node) => {
                if (typeof node !== 'string') {
                    node.removeAttribute(attrKey);
                }
                return node;
            });
        }
    }
    // Apply the patches.
    return (node) => {
        for (const patch of patches) {
            patch(node);
        }
        return node;
    };
};
exports.default = diffAttributes;

},{}],8:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const renderVNode_1 = require("../renderVNode");
const diff_1 = require("./diff");
/** Compares the new child list with the old one and creates
 * a patch for the DOM-parent to apply the necessary changes.
 * @param oldChildren The old list of children.
 * @param newChildren The new list of children.
 */
const diffChildren = (oldChildren, newChildren) => {
    // Defaults for undefined.
    oldChildren = oldChildren || [];
    newChildren = newChildren || [];
    // Loop through all old children and diff them.
    const childPatches = [];
    oldChildren.forEach((oldChild, i) => {
        childPatches.push(diff_1.default(oldChild, newChildren[i]));
    });
    // Render additional children (if any) and append them to the node.
    const additionalPatches = [];
    for (const additionalChild of newChildren.slice(oldChildren.length)) {
        additionalPatches.push((node) => {
            node.appendChild(renderVNode_1.default(additionalChild));
            return node;
        });
    }
    return (parent) => {
        // Apply diffed child patches. Use parent.
        parent.childNodes.forEach((child, i) => {
            childPatches[i](child);
        });
        // Apply additional child patches.
        for (const patch of additionalPatches) {
            patch(parent);
        }
        return parent;
    };
};
exports.default = diffChildren;

},{"../renderVNode":10,"./diff":6}],9:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/** Mount a DOM node to a given root node.
 * @param node The node that should be mounted.
 * @param target The targeted node that should be replaced.
 */
exports.default = (node, target) => {
    target.replaceWith(node);
    return node;
};

},{}],10:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/** Translate a string into a DOM text node.
 * @param vNode The content of the text node.
 */
const renderText = (vNode) => {
    return document.createTextNode(vNode);
};
/** Translate a vNode into a DOM node.
 * @param vNode The vNode that should be rendered.
 */
const renderElem = (vNode) => {
    // Default values.
    vNode.attributes = vNode.attributes || {};
    vNode.children = vNode.children || [];
    // Create a new DOM node.
    const $el = document.createElement(vNode.tagName);
    // Insert attributes from the vNode into the DOM node.
    for (const [k, v] of Object.entries(vNode.attributes)) {
        $el.setAttribute(k, v);
    }
    // Render child vNodes.
    for (const child of vNode.children) {
        // Recursively call this function again on child vNode.
        const $child = renderVNode(child);
        // Add the parsed child to the DOM node.
        $el.appendChild($child);
    }
    return $el;
};
const renderVNode = (vNode) => {
    if (typeof vNode === 'string') {
        // Render text node.
        return renderText(vNode);
    }
    // Render virtual node.
    return renderElem(vNode);
};
exports.default = renderVNode;

},{}]},{},[1])(1)
});
