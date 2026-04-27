// ABOUTME: Eleventy configuration for dylanreed.com author site.
// ABOUTME: Configures input/output dirs, passthrough copies, custom filters, and book page generation.

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/assets/downloads");

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
      "Space Western": "#c9784c",
      "YA Superhero": "#e06040"
    };
    return colors[genre] || "#8b7355";
  });

  eleventyConfig.addFilter("titleHash", (title) => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = ((hash << 5) - hash) + title.charCodeAt(i);
      hash = hash & hash;
    }
    hash = Math.abs(hash);

    const noteRotation = (hash % 60 - 30) / 10;
    const tape1Rotation = ((hash >> 4) % 50 - 25);
    const tape2Rotation = ((hash >> 8) % 50 - 25);
    const tape1Width = 42 + ((hash >> 12) % 13);
    const tape2Width = 42 + ((hash >> 16) % 13);
    const tape1Top = -3 - ((hash >> 3) % 4);
    const tape1Side = -5 - ((hash >> 7) % 6);
    const tape2Bottom = -3 - ((hash >> 11) % 4);
    const tape2Side = -5 - ((hash >> 15) % 6);
    const mirrorCorners = (hash % 2 === 0);

    return {
      noteRotation,
      tape1Rotation: mirrorCorners ? tape1Rotation : -tape1Rotation,
      tape2Rotation: mirrorCorners ? tape2Rotation : -tape2Rotation,
      tape1Width,
      tape2Width,
      tape1Top,
      tape1Side: mirrorCorners ? `left: ${tape1Side}px` : `right: ${tape1Side}px`,
      tape2Bottom,
      tape2Side: mirrorCorners ? `right: ${tape2Side}px` : `left: ${tape2Side}px`
    };
  });

  eleventyConfig.addFilter("statusLabel", (status) => {
    const labels = {
      "published": "published",
      "submitted": "submitted",
      "available-soon": "available soon",
      "in-revision": "in revision",
      "in-progress": "in progress",
      "drafting": "drafting",
      "first draft complete": "first draft complete",
      "editing": "editing"
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
    delete require.cache[require.resolve("./src/_data/books.json")];
    const books = require("./src/_data/books.json");
    books.forEach(book => {
      eleventyConfig.addTemplate(`books/${book.slug}.njk`, `---
layout: layouts/book.njk
title: "${book.title}"
genre: "${book.genre}"
series: ${book.series ? '"' + book.series + '"' : "null"}
status: "${book.status}"
wordCount: ${book.wordCount || 0}
universe: ${book.universe ? '"' + book.universe + '"' : "null"}
purchaseLink: ${book.purchaseLink ? '"' + book.purchaseLink + '"' : "null"}
coverImage: ${book.coverImage ? '"' + book.coverImage + '"' : "null"}
freeWithNewsletter: ${book.freeWithNewsletter ? "true" : "false"}
permalink: /books/${book.slug}/
---

${book.blurb}`);
    });
  } catch(e) {
    // books.json may not exist yet
  }

  // Generate individual universe pages from universes.json
  try {
    delete require.cache[require.resolve("./src/_data/universes.json")];
    delete require.cache[require.resolve("./src/_data/books.json")];
    const universes = require("./src/_data/universes.json");
    const books = require("./src/_data/books.json");
    universes.forEach(universe => {
      const hasBooks = books.some(b => b.universe === universe.id);
      if (hasBooks) {
        eleventyConfig.addTemplate(`books/${universe.id}.njk`, `---
layout: layouts/universe.njk
title: "${universe.name}"
universeName: "${universe.name}"
universeId: "${universe.id}"
universeDescription: "${universe.description.replace(/"/g, '\\"')}"
genre: "${universe.genre}"
permalink: /books/${universe.id}/
---`);
      }
    });
  } catch(e) {
    // universes.json may not exist yet
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
