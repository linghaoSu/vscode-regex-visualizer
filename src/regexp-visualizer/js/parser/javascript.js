// Entry point for the JavaScript-flavor regular expression parsing and
// rendering. Actual parsing code is in
// [parser.js](./javascript/parser.html) and the grammar file. Rendering code
// is contained in the various subclasses of
// [Node](./javascript/node.html)

import { defaults, union, without } from 'lodash-unified';
import Snap from '../../../snapsvg/snapsvg';
import { mockDocument as document } from '../../../constant';
import util from '../util.js';
import javascript from './javascript/parser.js';
import ParserState from './javascript/parser_state.js';

import Root from './javascript/root.js';
import Regexp from './javascript/regexp.js';
import Match from './javascript/match.js';
import MatchFragment from './javascript/match_fragment.js';
import Anchor from './javascript/anchor.js';
import Subexp from './javascript/subexp.js';
import Charset from './javascript/charset.js';
import CharsetEscape from './javascript/charset_escape.js';
import CharsetRange from './javascript/charset_range.js';
import Literal from './javascript/literal.js';
import Escape from './javascript/escape.js';
import AnyCharacter from './javascript/any_character.js';
import Repeat from './javascript/repeat.js';
import RepeatAny from './javascript/repeat_any.js';
import RepeatOptional from './javascript/repeat_optional.js';
import RepeatRequired from './javascript/repeat_required.js';
import RepeatSpec from './javascript/repeat_spec.js';

const parseTypes = {
  Root,
  Regexp,
  Match,
  MatchFragment,
  Anchor,
  Subexp,
  Charset,
  CharsetEscape,
  CharsetRange,
  Literal,
  Escape,
  AnyCharacter,
  Repeat,
  RepeatAny,
  RepeatOptional,
  RepeatRequired,
  RepeatSpec,
};

export default class Parser {
  // - __container__ - DOM node that will contain the rendered expression
  // - __options.keepContent__ - Boolean indicating if content of the container
  //    should be preserved after rendering. Defaults to false (don't keep
  //    contents)
  constructor(container, options) {
    this.options = options || {};
    defaults(this.options, {
      keepContent: false,
    });

    this.container = container;

    // The [ParserState](./javascript/parser_state.html) instance is used to
    // communicate between the parser and a running render, and to update the
    // progress bar for the running render.
    this.state = new ParserState(this.container.querySelector('.progress div'));
  }

  // DOM node that will contain the rendered expression. Setting this will add
  // the base markup necessary for rendering the expression, and set the
  // `svg-container` class
  set container(cont) {
    this._container = cont;
    this._container.innerHTML = [
      document.querySelector('#svg-container-base').innerHTML,
      this.options.keepContent ? this.container.innerHTML : '',
    ].join('');
    this._addClass('svg-container');
  }

  get container() {
    return this._container;
  }

  // Helper method to simplify adding classes to the container.
  _addClass(className) {
    this.container.className = union(this.container.className.split(' '), [className])
      .join(' ');
  }

  // Helper method to simplify removing classes from the container.
  _removeClass(className) {
    this.container.className = without(this.container.className.split(' '), className)
      .join(' ');
  }

  // Parse a regular expression into a tree of
  // [Nodes](./javascript/node.html) that can then be used to render an SVG.
  // - __expression__ - Regular expression to parse.
  parse(expression) {
    this._addClass('loading');

    // Allow the browser to repaint before parsing so that the loading bar is
    // displayed before the (possibly lengthy) parsing begins.
    return util.tick().then(() => {
      javascript.Parser.SyntaxNode.state = this.state;

      this.parsed = javascript.parse(expression.replace(/\n/g, '\\n'), { types: parseTypes });
      return this;
    });
  }

  // Render the parsed expression to an SVG.
  render() {
    const svg = Snap(this.container.querySelector('svg'));

    return this.parsed.render(svg.group())
      // return this.parsed.render(svg.group())
      // Once rendering is complete, the rendered expression is positioned and
      // the SVG resized to create some padding around the image contents.
      .then((result) => {
        const box = result.getBBox?.();

        result.transform(Snap.matrix()
          .translate(10 - box.x, 10 - box.y));
        svg.attr({
          width: box.width + 20,
          height: box.height + 20,
        });
      })
      // Stop and remove loading indicator after render is totally complete.
      .then(() => {
        this._removeClass('loading');
        this.container.removeChild(this.container.querySelector('.progress'));
      });
  }

  // Cancels any currently in-progress render.
  cancel() {
    this.state.cancelRender = true;
  }

  // Returns any warnings that may have been set during the rendering process.
  get warnings() {
    return this.state.warnings;
  }
}
