/*! elch | MIT License | https://github.com/pauwell/elch */

import parseView from '../parser/parseView';
import diff from '../vdom/diff/diff';
import mount from '../vdom/mount';
import renderVNode from '../vdom/renderVNode';
import { IVNode } from './../vdom/createVNode';

export interface ITemplate {
  name: string;
  state: { [x: string]: any };
  logic: { [x: string]: any };
  view: () => string;
}

export default class Template {
  private _template: ITemplate;
  private _parsedView: IVNode;
  private _renderedView: HTMLElement;
  private _rootElement: HTMLElement;
  private _stateChanged = false;

  /**
   * TODO
   * @param properties TODO
   */
  constructor(properties: ITemplate) {
    this.create(properties);
  }

  /**
   * TODO
   * @param properties TODO
   */
  public create(properties: ITemplate) {
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
        set(value: any) {
          property = value;
          console.log('Calling setter for ' + property);
          // this._stateChanged = true; TODO access `this`.
        }
      });
    });

    // Bind `state` as context to `logic`-methods.
    for (const logicProp in this._template.logic) {
      if (this._template.logic.hasOwnProperty(logicProp)) {
        this._template.logic[logicProp] = this._template.logic[logicProp].bind(
          this._template.state
        );
      }
    }

    // Parse the string view into virtual nodes.
    this._parsedView = parseView(this._template.view());
  }

  /**
   * TODO
   */
  public update() {
    // Parse the string view into virtual nodes.
    const newParsedView: IVNode = parseView(this._template.view());

    // Create patches for the DOM by diffing with the old view.
    const patch = diff(this._parsedView, newParsedView);

    // Apply the created patches to the root element.
    this._rootElement = patch(this._rootElement) as HTMLElement;

    // Update the internal reference.
    this._parsedView = newParsedView;
  }

  /** Render the vNode view and insert it into the DOM. This usually gets called once.
   * @param rootEl The DOM element that will be replaced by the rendered view.
   */
  public mountTo(rootEl: HTMLElement) {
    // Render the view.
    this._renderedView = renderVNode(this._parsedView) as HTMLElement;

    // Replace the root element with the result.
    this._rootElement = mount(this._renderedView, rootEl);
  }
}
