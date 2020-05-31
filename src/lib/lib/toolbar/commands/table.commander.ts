import { Commander, TBSelection } from '../../core/_api';
import { AttrState } from '../forms/help';

export class TableCommander implements Commander<AttrState[]> {
  recordHistory = true;

  updateValue(value: AttrState[]) {
  }

  command(selection: TBSelection, overlap: boolean): void {
    console.log(selection)
  }
}