// CharsetEscape nodes are for escape sequences inside of character sets. They
// differ from other [Escape](./escape.html) nodes in that `\b` matches a
// backspace character instead of a word boundary.

import { extend } from 'lodash-unified';
import Escape from './escape.js';

export default extend({}, Escape, {
  type: 'charset-escape',

  b: ['backspace', 0x08, true],
});
