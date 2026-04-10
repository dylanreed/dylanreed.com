// ABOUTME: Fetches blog posts from dylan.blog RSS feed at build time.
// ABOUTME: Uses eleventy-fetch for caching. Returns parsed post array.

const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = async function() {
  const feedUrl = "https://dylan.blog/index.xml";

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

      const title = getTag("title");
      const link = getTag("link");
      const pubDate = getTag("pubDate");
      const description = getTag("description");

      const excerpt = description
        .replace(/<[^>]*>/g, "")
        .substring(0, 150)
        .trim();

      items.push({
        title,
        link,
        date: pubDate ? new Date(pubDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        }) : "",
        rawDate: pubDate,
        excerpt: excerpt + (description.length > 150 ? "…" : "")
      });
    }

    return items.slice(0, 10);
  } catch (error) {
    console.warn("Failed to fetch blog feed:", error.message);
    return [];
  }
};
