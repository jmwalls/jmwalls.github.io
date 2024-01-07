const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = config => {
    // Custom template to create code blocks in markdown inputs.
    /*
    config.addPairedShortcode("codeblock", function(content) {
        return `<pre><code>
        ${content}
        </code></pre>`;
    });
    */

    // Convenience shortcode to insert images with consistent formatting.
    config.addShortcode("picture", function(path, caption) {
        return `<div class="mx-auto text-center">
          <figure class="figure">
            <img class="rounded" src=${path} alt=${caption}>
            <figcaption class="figure-caption text-start">${caption}</figcaption>
          </figure>
          </div>`;
    });

    // Datetime string utilities.
    config.addFilter("dateToIso", function(value) {
      const dateObj = new Date(value);
      return dateObj.toISOString();
    });

    config.addFilter("formatDateStr", function(value) {
      const dateObj = new Date(value);
      return dateObj.toLocaleDateString(
          "en-US",
          {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
              timeZone: "UTC"
          }
      );
    });

    // Add plugins.
    config.addPlugin(syntaxHighlight);

    // Pass through images
    config.addPassthroughCopy('./src/images/');

    // Returns a collection of blog posts in reverse date order
    config.addCollection("posts", function(collection) {
      return [...collection.getFilteredByGlob("./src/posts/*.md")].reverse();
    });

    return {
        markdownTemplateEngine: "njk",
        dataTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        dir: {
            input: "src",
            output: "dist"
        },
    };
};
