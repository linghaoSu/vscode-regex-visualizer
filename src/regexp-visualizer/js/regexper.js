// The Regexper class manages the top-level behavior for the entire
// application. This includes event handlers for all user interactions.

import { mockDocument as document } from '../../constant';
import util from './util.js';
import Parser from './parser/javascript.js';

export default class Regexper {
  constructor(root) {
    this.root = root;

    this.svgContainer = root.querySelector('#regexp-render');
  }

  // Currently state of the application. Useful values are:
  //  - `''` - State of the application when the page initially loads
  //  - `'is-loading'` - Displays the loading indicator
  //  - `'has-error'` - Displays the error message
  //  - `'has-results'` - Displays rendered results
  set state(state) {
    this.root.className = state;
  }

  get state() {
    return this.root.className;
  }

  // Start the rendering of a regular expression.
  //
  // - __expression__ - Regular expression to display.
  async showExpression(expression) {
    this.state = '';

    if (expression !== '') {
      try {
        await this.renderRegexp(expression);
      } catch (e) {
        util.exposeError(e);
      }
    }
  }

  // Creates a blob URL for linking to a rendered regular expression image.
  //
  // - __content__ - SVG image markup.
  // buildBlobURL(content) {
  //   // Blob object has to stick around for IE, so the instance is stored on the
  //   // `window` object.
  //   window.blob = new Blob([content], { type: 'image/svg+xml' });
  //   return URL.createObjectURL(window.blob);
  // }
  // create svg image;
  // loader.src = `data:image/svg+xml,${encodeURIComponent(svg.innerHTML)}`;

  // Display any warnings that were generated while rendering a regular expression.
  //
  // - __warnings__ - Array of warning messages to display.
  // displayWarnings(warnings) {
  //   this.warnings.innerHTML = map(warnings, warning => (
  //     `<li class="inline-icon">${util.icon('#warning')}${warning}</li>`
  //   )).join('');
  // }

  // Render regular expression
  //
  // - __expression__ - Regular expression to render
  async renderRegexp(expression) {
    let parseError = false;

    // When a render is already in progress, cancel it and try rendering again
    // after a short delay (canceling a render is not instantaneous).
    if (this.running) {
      this.running.cancel();

      return util.wait(10).then(() => this.renderRegexp(expression));
    }

    this.state = 'is-loading';

    this.running = new Parser(this.svgContainer);

    try {
      const parser = await this.running
        // Parse the expression.
        .parse(expression);

      try {
        const renderRst = await parser.render();

        return renderRst;
      } catch (message) {
        if (message === 'Render cancelled') {
          this.state = '';
        } else if (!parseError) {
          throw message;
        }
      }
    } catch (message) {
      this.state = 'has-error';
      this.error.innerHTML = '';
      this.error.appendChild(document.createTextNode(message));

      parseError = true;

      throw message;
    }

    // return this.running
    //   // Parse the expression.
    //   .parse(expression)
    //   // Display any error messages from the parser and abort the render.
    //   .catch((message) => {
    //     this.state = 'has-error';
    //     this.error.innerHTML = '';
    //     this.error.appendChild(document.createTextNode(message));

    //     parseError = true;

    //     throw message;
    //   })
    //   // When parsing is successful, render the parsed expression.
    //   .then(parser => parser.render())
    //   // Once rendering is complete:
    //   //  - Update links
    //   //  - Display any warnings
    //   //  - Track the completion of the render and how long it took
    //   .then(() => {
    //     this.state = 'has-results';
    //     // this.displayWarnings(this.running.warnings);
    //   })
    //   // Handle any errors that happened during the rendering pipeline.
    //   // Swallows parse errors and render cancellations. Any other exceptions
    //   // are allowed to continue on to be tracked by the global error handler.
    //   .catch((message) => {
    //     if (message === 'Render cancelled') {
    //       this.state = '';
    //     } else if (!parseError) {
    //       throw message;
    //     }
    //   })
    //   // Finally, mark rendering as complete (and pass along any exceptions
    //   // that were thrown).
    //   .then(
    //     () => {
    //       this.running = false;
    //     },
    //     (message) => {
    //       this.running = false;
    //       throw message;
    //     },
    //   );
  }
}
