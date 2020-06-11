import { helper } from '@ember/component/helper';
import Inputmask from 'inputmask';

export function formatPhone([value, mask = '(999) 999-9999']) {
  return Inputmask.format(value, { mask: mask });
}

export default helper(formatPhone);
