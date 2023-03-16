// AnyCharacter nodes are for `*` regular expression syntax. They are rendered
// as just an "any character" label.

export default {
  type: 'any-character',

  async _render() {
    return await this.renderLabel('any character');
  },
};
