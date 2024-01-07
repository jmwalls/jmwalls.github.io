module.exports = {
  /* Set expected bootstrap navbar state, depending on if the page is active or
   * not.
   *
   * @param {String} pageUrl Active page
   * @param {String} itemUrl Query page
   * @returns {String} class/aria state
   */
  getBootstrapNavbarState(pageUrl, itemUrl) {
    if (itemUrl === pageUrl) {
      return "class=\"nav-link active\" aria-current=\"page\"";
    }
    return "class=\"nav-link\"";
  },
};
