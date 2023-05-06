// Regexp nodes are the entire regular expression. They consist of a collection
// of [Match](./match.html) nodes separated by `|`.

import { compact, first, flatten, last, map } from 'lodash-unified';
import Snap from '../../../../snapsvg/snapsvg';
import util from '../../util.js';

export default {
  type: 'regexp',

  // Renders the regexp into the currently set container.
  async _render() {
    const matchContainer = this.container.group()
      .addClass('regexp-matches')
      .transform(Snap.matrix()
        .translate(20, 0));

    // Renders each match into the match container.
    const promiseHandlerList = map(this.matches,
      async match => await match.render(matchContainer.group()),
    );
    const rst = await Promise.all(promiseHandlerList);
    let containerBox,
      paths;

    // Space matches vertically in the match container.
    util.spaceVertically(this.matches, {
      padding: 5,
    });

    containerBox = this.getBBox?.();

    // Creates the curves from the side lines for each match.
    paths = map(this.matches, match => this.makeCurve(containerBox, match));

    // Add side lines to the list of paths.
    paths.push(this.makeSide(containerBox, first(this.matches)));
    paths.push(this.makeSide(containerBox, last(this.matches)));

    // Render connector paths.
    this.container.prepend(
      this.container.path(compact(flatten(paths)).join('')));

    containerBox = matchContainer.getBBox?.();

    // Create connections from side lines to each match and render into
    // the match container.
    paths = map(this.matches, match => this.makeConnector(containerBox, match));
    matchContainer.prepend(
      matchContainer.path(paths.join('')));

    return rst;
  },

  // Returns an array of SVG path strings to draw the vertical lines on the
  // left and right of the node.
  //
  // - __containerBox__ - Bounding box of the container.
  // - __match__ - Match node that the line will be drawn to.
  makeSide(containerBox, match) {
    const box = match.getBBox?.();
    const distance = Math.abs(box.ay - containerBox.cy);

    // Only need to draw side lines if the match is more than 15 pixels from
    // the vertical center of the rendered regexp. Less that 15 pixels will be
    // handled by the curve directly.
    if (distance >= 15) {
      const shift = (box.ay > containerBox.cy) ? 10 : -10;
      const edge = box.ay - shift;

      return [
        `M0,${containerBox.cy}q10,0 10,${shift}V${edge}`,
        `M${containerBox.width + 40},${containerBox.cy}q-10,0 -10,${shift}V${edge}`,
      ];
    }
  },

  // Returns an array of SVG path strings to draw the curves from the
  // sidelines up to the anchor of the match node.
  //
  // - __containerBox__ - Bounding box of the container.
  // - __match__ - Match node that the line will be drawn to.
  makeCurve(containerBox, match) {
    const box = match.getBBox?.();
    const distance = Math.abs(box.ay - containerBox.cy);

    if (distance >= 15) {
      // For match nodes more than 15 pixels from the center of the regexp, a
      // quarter-circle curve is used to connect to the sideline.
      const curve = (box.ay > containerBox.cy) ? 10 : -10;

      return [
        `M10,${box.ay - curve}q0,${curve} 10,${curve}`,
        `M${containerBox.width + 30},${box.ay - curve}q0,${curve} -10,${curve}`,
      ];
    } else {
      // For match nodes less than 15 pixels from the center of the regexp, a
      // slightly curved line is used to connect to the sideline.
      const anchor = box.ay - containerBox.cy;

      return [
        `M0,${containerBox.cy}c10,0 10,${anchor} 20,${anchor}`,
        `M${containerBox.width + 40},${containerBox.cy}c-10,0 -10,${anchor} -20,${anchor}`,
      ];
    }
  },

  // Returns an array of SVG path strings to draw the connection from the
  // curve to match node.
  //
  // - __containerBox__ - Bounding box of the container.
  // - __match__ - Match node that the line will be drawn to.
  makeConnector(containerBox, match) {
    const box = match.getBBox?.();

    return `M0,${box.ay}h${box.ax}M${box.ax2},${box.ay}H${containerBox.width}`;
  },

  setup() {
    if (this.properties.alternates.elements.length === 0) {
      // When there is only one match node to render, proxy to it.
      this.proxy = this.properties.match;
    } else {
      // Merge all the match nodes into one array.
      this.matches = [this.properties.match].concat(
        map(this.properties.alternates.elements,
          element => element.properties.match),
      );
    }
  },
};
