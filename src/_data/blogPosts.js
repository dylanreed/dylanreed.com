// ABOUTME: Fetches writing-category blog posts from dylan.blog RSS feed at build time.
// ABOUTME: Uses eleventy-fetch for caching. Returns parsed post array with full content for local rendering.

const EleventyFetch = require("@11ty/eleventy-fetch");

function decodeEntities(str) {
  return str
    .replace(/&ldquo;/g, "\u201C")
    .replace(/&rdquo;/g, "\u201D")
    .replace(/&lsquo;/g, "\u2018")
    .replace(/&rsquo;/g, "\u2019")
    .replace(/&hellip;/g, "\u2026")
    .replace(/&mdash;/g, "\u2014")
    .replace(/&ndash;/g, "\u2013")
    .replace(/&#34;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num)))
    .replace(/&amp;/g, "&");
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 80);
}

module.exports = async function() {
  const feedUrl = "https://dylan.blog/categories/writing/feed.xml";

  try {
    const feed = await EleventyFetch(feedUrl, {
      duration: "1d",
      type: "text"
    });

    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(feed)) !== null) {
      const itemXml = match[1];
      const getTag = (tag) => {
        const tagMatch = itemXml.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`));
        return tagMatch ? tagMatch[1].trim() : "";
      };

      const title = decodeEntities(getTag("title").replace(/&amp;/g, "&"));
      const link = getTag("link");
      const pubDate = getTag("pubDate");
      const description = getTag("description");

      // Full HTML content — decode double-encoded entities
      const fullContent = decodeEntities(
        description
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
      ).replace(/^\s*<p>\s*<img[^>]*\/?>\s*<\/p>\s*/i, "");

      // Plain text excerpt for listings
      const excerpt = fullContent
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .substring(0, 150)
        .trim();

      const slug = slugify(title);

      items.push({
        title,
        slug,
        link,
        canonicalUrl: link,
        date: pubDate ? new Date(pubDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        }) : "",
        rawDate: pubDate,
        excerpt: excerpt + (fullContent.length > 150 ? "\u2026" : ""),
        content: fullContent
      });
    }

    return items.filter(item => item.title);
  } catch (error) {
    console.warn("Failed to fetch blog feed:", error.message);
    return [];
  }
};
