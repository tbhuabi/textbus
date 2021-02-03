import {
  ChildSlotMode,
  FormatAbstractData,
  FormatEffect,
  FormatRendingContext,
  FormatterPriority,
  InlineFormatter,
  ReplaceMode,
  VElement
} from '../core/_api';

abstract class MarginFormatter extends InlineFormatter {
  reg: RegExp;

  protected constructor(private tags: string[]) {
    super({}, FormatterPriority.InlineStyle);
    this.reg = new RegExp(`^(${tags.join('|')})$`, 'i');
  }

  match(p: HTMLElement | FormatAbstractData): FormatEffect {
    if (!this.reg.test(p instanceof FormatAbstractData ? p.tag : p.tagName)) {
      return FormatEffect.Invalid;
    }
    const styleKeys = ['margin', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom']
    if (p instanceof FormatAbstractData) {
      return styleKeys.map(key => p.styles.get(key)).filter(i => !!i).length > 0 ? FormatEffect.Valid : FormatEffect.Invalid;
    }
    return styleKeys.map(key => p.style[key]).filter(i => !!i).length > 0 ? FormatEffect.Valid : FormatEffect.Invalid;
  }

  read(node: HTMLElement): FormatAbstractData {
    return this.extractData(node, {
      styleName: ['marginLeft', 'marginRight', 'marginTop', 'marginBottom']
    });
  }

  render(context: FormatRendingContext, existingElement?: VElement): ReplaceMode | ChildSlotMode | null {
    const margin = [
      context.abstractData.styles.get('marginTop'),
      context.abstractData.styles.get('marginRight'),
      context.abstractData.styles.get('marginLeft'),
      context.abstractData.styles.get('marginBottom'),
    ].map(i => i || 0);
    if (existingElement && this.reg.test(existingElement.tagName)) {
      existingElement.styles.set('margin', margin.join(' '));
      return null;
    }
    existingElement = new VElement('span');
    existingElement.styles.set('margin', margin.join(' '));
    return new ChildSlotMode(existingElement);
  }
}

export class InlineMarginFormatter extends MarginFormatter {
  static inlineTags = 'span,em,i,s,del,sup,sub,u,strong'.split(',');

  constructor() {
    super(InlineMarginFormatter.inlineTags);
  }
}

export class BlockMarginFormatter extends MarginFormatter {
  static blockTags = 'div,p,h1,h2,h3,h4,h5,h6,nav,header,footer,td,th,li,article'.split(',');

  constructor() {
    super(BlockMarginFormatter.blockTags);
  }
}

export const inlineMarginFormatter = new InlineMarginFormatter();
export const blockMarginFormatter = new BlockMarginFormatter();
