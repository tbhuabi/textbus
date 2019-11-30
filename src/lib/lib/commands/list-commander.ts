import { Commander, ReplaceModel } from './commander';
import { FormatState } from '../matcher/matcher';
import { FormatRange } from '../parser/format-range';
import { TBSelection } from '../selection/selection';
import { Handler } from '../toolbar/handlers/help';

export class ListCommander implements Commander<any> {
  recordHistory = true;
  constructor(private tagName: string) {
  }

  command(selection: TBSelection, handler: Handler, overlap: boolean): void {
  }

  render(state: FormatState, rawElement?: HTMLElement): ReplaceModel {
    return;
  }
}
