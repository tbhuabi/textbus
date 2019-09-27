import { DropdownHandlerOption, HandlerType } from '../toolbar/help';
import { Subject } from 'rxjs';
import { StyleFormatter } from '../toolbar/fomatter/style-formatter';

const selector = document.createElement('div');
const updateEvent = new Subject<string>();
const hideEvent = new Subject<void>();

selector.innerHTML = `
<ul>
  <li></li>
</ul>
`;

export const imageHandler: DropdownHandlerOption = {
  type: HandlerType.Dropdown,
  classes: ['tanbo-editor-icon-image'],
  tooltip: '图片',
  onHide: hideEvent.asObservable(),
  viewContents: selector,
  execCommand: new StyleFormatter('color', updateEvent.asObservable())
};
