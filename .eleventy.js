// ABOUTME: Eleventy configuration for dylanreed.com author site.
// ABOUTME: Configures input/output dirs, passthrough copies, custom filters, and book page generation.

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");

  eleventyConfig.addFilter("date", (value, format) => {
    const d = value ? new Date(value) : new Date();
    if (format === "Y") return d.getFullYear().toString();
    if (format === "MMMM D, YYYY") {
      return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    }
    return d.toISOString();
  });

  eleventyConfig.addFilter("genreColor", (genre) => {
    const colors = {
      "Cozy Fantasy": "#6b8e6b",
      "Sci-Fi": "#4a7a8b",
      "Romance": "#b5566a",
      "Steampunk": "#b8860b",
      "Urban Fantasy": "#7b68ae",
      "Noir": "#555555",
      "Space Western": "#c9784c"
    };
    return colors[genre] || "#8b7355";
  });

  eleventyConfig.addFilter("statusLabel", (status) => {
    const labels = {
      "published": "published",
      "submitted": "submitted",
      "available-soon": "available soon",
      "in-revision": "in revision",
      "in-progress": "in progress"
    };
    return labels[status] || status;
  });

  eleventyConfig.addCollection("bookPages", function(collectionApi) {
    try {
      const books = require("./src/_data/books.json");
      return books;
    } catch (e) {
      return [];
    }
  });

  // Generate individual book pages from books.json
  try {
    const books = require("./src/_data/books.json");
    books.forEach(book => {
      eleventyConfig.addTemplate(`books/${book.slug}.njk`, `---
layout: layouts/book.njk
title: "${book.title}"
genre: "${book.genre}"
status: "${book.status}"
wordCount: ${book.wordCount || 0}
universe: ${book.universe ? '"' + book.universe + '"' : "null"}
purchaseLink: ${book.purchaseLink ? '"' + book.purchaseLink + '"' : "null"}
coverImage: ${book.coverImage ? '"' + book.coverImage + '"' : "null"}
permalink: /books/${book.slug}/
---

${book.blurb}`);
    });
  } catch(e) {
    // books.json may not exist yet
  }

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "html"],
    htmlTemplateEngine: "njk"
  };
};
