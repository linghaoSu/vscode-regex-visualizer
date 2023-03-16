// Root nodes contain the top-level [Regexp](./regexp.html) node. Any flags
// and a few decorative elements are rendered by the root node.

import { uniq } from 'lodash-unified';
import Snap from '../../../../snapsvg/snapsvg';

export default {
  type: 'root',

  flagLabels: {
    i: 'Ignore Case',
    g: 'Global',
    m: 'Multiline',
    y: 'Sticky',
    u: 'Unicode',
  },

  // Renders the root into the currently set container.
  async _render() {
    let flagText;

    // Render a label for any flags that have been set of the expression.
    if (this.flags.length > 0) {
      flagText = this.container.text(0, 0, `Flags: ${this.flags.join(', ')}`);
    }

    // Render the content of the regular expression.
    await this.regexp.render(this.container.group());
    // Move rendered regexp to account for flag label and to allow for
    // decorative elements.
    if (flagText) {
      this.regexp.transform(Snap.matrix()
        .translate(10, flagText.getBBox?.().height));
    } else {
      this.regexp.transform(Snap.matrix()
        .translate(10, 0));
    }

    const box = this.regexp.getBBox?.();

    // Render decorative elements.
    this.container.path(`M${box.ax},${box.ay}H0M${box.ax2},${box.ay}H${box.x2 + 10}`);
    this.container.circle(0, box.ay, 5);
    this.container.circle(box.x2 + 10, box.ay, 5);
  },

  setup() {
    // Convert list of flags into text describing each flag.
    this.flags = uniq(this.properties.flags.textValue).sort()
      .map(flag => this.flagLabels[flag]);

    this.regexp = this.properties.regexp;
  },
};
