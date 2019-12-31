import { View } from './view';
import { Fragment } from './fragment';
import { ChildSlotModel, ReplaceModel } from '../commands/commander';
import { VIRTUAL_NODE } from './help';
import { Handler } from '../toolbar/handlers/help';
import { FormatRange } from './format';
import { getCanApplyFormats, mergeFormat } from './utils';
import { VMediaNode } from '../renderer/virtual-dom';

export class Single extends View {
  private formatMatrix = new Map<Handler, FormatRange[]>();

  constructor(public parent: Fragment, public tagName: string) {
    super();
  }

  getFormatRangesByHandler(handler: Handler) {
    return this.formatMatrix.get(handler);
  }

  cleanFormats() {
    this.formatMatrix.clear();
  }

  getFormatHandlers() {
    return Array.from(this.formatMatrix.keys());
  }

  getFormatRanges() {
    return Array.from(this.formatMatrix.values()).reduce((v, n) => v.concat(n), []);
  }

  mergeFormat(format: FormatRange, important = false) {
    mergeFormat(this.formatMatrix, format, important);
  }

  setFormats(key: Handler, formatRanges: FormatRange[]) {
    this.formatMatrix.set(key, formatRanges);
  }

  // createVDom() {
  //   const index = this.parent.find(this);
  //   return new VMediaNode(this.parent, getCanApplyFormats(this.formatMatrix), index);
  // }

  clone(): Single {
    const s = new Single(this.parent, this.tagName);
    s.formatMatrix = new Map<Handler, FormatRange[]>();
    Array.from(this.formatMatrix.keys()).forEach(key => {
      s.formatMatrix.set(key, this.formatMatrix.get(key).map(f => {
        return f.clone();
      }));
    });
    return s;
  }

  render() {
    const host = document.createDocumentFragment();
    let container: HTMLElement;
    let slotContainer: HTMLElement;

    const canApplyFormats = this.getCanApplyFormats();
    const index = this.parent.find(this);
    const vNode = new VMediaNode(this.parent, canApplyFormats, index);
    const el = document.createElement(this.tagName);
    // vNode.elementRef = el;
    el[VIRTUAL_NODE] = vNode;
    const node = canApplyFormats.reduce((node, next) => {
      if (next.handler) {
        const renderModel = next.handler.execCommand.render(next.state, node, next.cacheData);
        if (renderModel instanceof ReplaceModel) {
          container = renderModel.replaceElement;
          container[VIRTUAL_NODE] = vNode;
          // vNode.elementRef = container;
          slotContainer = container;
          return renderModel.replaceElement;
        } else if (renderModel instanceof ChildSlotModel) {
          if (node) {
            node.appendChild(renderModel.slotElement);
          } else {
            container = renderModel.slotElement;
          }
          slotContainer = renderModel.slotElement;
          slotContainer[VIRTUAL_NODE] = vNode;
          // vNode.elementRef = slotContainer;
          return renderModel.slotElement;
        }
      }
      return node;
    }, el);
    if (node) {
      host.appendChild(node);
    }
    return host;
  }

  private getCanApplyFormats() {
    return getCanApplyFormats(this.formatMatrix);
  }
}
