// Match nodes are used for the parts of a regular expression between `|`
// symbols. They consist of a series of [MatchFragment](./match_fragment.html)
// nodes. Optional `^` and `$` symbols are also allowed at the beginning and
// end of the Match.

import { compact, first, last, map, reduce } from 'lodash-unified';
import util from '../../util.js';

export default {
  type: 'match',

  definedProperties: {
    // Default anchor is overridden to attach the left point of the anchor to
    // the first element, and the right point to the last element.
    _anchor: {
      get() {
        const start = util.normalizeBBox(this.start.getBBox?.());
        const end = util.normalizeBBox(this.end.getBBox?.());
        const matrix = this.transform().localMatrix;

        return {
          ax: matrix.x(start.ax, start.ay),
          ax2: matrix.x(end.ax2, end.ay),
          ay: matrix.y(start.ax, start.ay),
        };
      },
    },
  },

  // Renders the match into the currently set container.
  async _render() {
    // Render each of the match fragments.
    const partPromises = await map(this.parts, async part => await part.render(this.container.group()));
    let items = compact(partPromises);

    // Handle the situation where a regular expression of `()` is rendered.
    // This leads to a Match node with no fragments. Something must be rendered
    // so that the anchor can be calculated based on it.
    //
    // Furthermore, the content rendered must have height and width or else the
    // anchor calculations fail.
    if (items.length === 0) {
      items = [this.container.group().path('M0,0h10')];
    }

    const rst = await Promise.all(items);
    // Find SVG elements to be used when calculating the anchor.
    this.start = first(rst);
    this.end = last(rst);

    util.spaceHorizontally(rst, {
      padding: 10,
    });

    // Add lines between each item.
    this.container.prepend(
      this.container.path(this.connectorPaths(rst).join('')));
  },

  // Returns an array of SVG path strings between each item.
  // - __items__ - Array of SVG elements or nodes.
  connectorPaths(items) {
    let prev, next;

    prev = util.normalizeBBox(first(items).getBBox?.());
    return map(items.slice(1), (item) => {
      try {
        next = util.normalizeBBox(item.getBBox?.());
        return `M${prev.ax2},${prev.ay}H${next.ax}`;
      } finally {
        prev = next;
      }
    });
  },

  setup() {
    // Merged list of MatchFragments to be rendered.
    this.parts = reduce(this.properties.parts.elements, (result, node) => {
      const lastItem = last(result);

      if (lastItem && node.canMerge && lastItem.canMerge) {
        // Merged the content of `node` into `last` when possible. This also
        // discards `node` in the process since `result` has not been changed.
        lastItem.content.merge(node.content);
      } else {
        // `node` cannot be merged with the previous node, so it is added to
        // the list of parts.
        result.push(node);
      }

      return result;
    }, []);

    // When there is only one part, then proxy to the part.
    if (this.parts.length === 1) {
      this.proxy = this.parts[0];
    }
  },
};
