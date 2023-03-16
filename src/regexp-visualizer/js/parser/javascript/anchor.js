export default {
  async _render() {
    const label = await this.renderLabel(this.label);
    label.addClass('anchor');
    return label;
  },

  setup() {
    if (this.textValue === '^') {
      this.label = 'Start of line';
    } else {
      this.label = 'End of line';
    }
  },
};
