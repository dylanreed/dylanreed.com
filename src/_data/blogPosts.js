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

      const decodeEntities = (str) => str
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

      const title = decodeEntities(getTag("title").replace(/&amp;/g, "&"));
      const link = getTag("link");
      const pubDate = getTag("pubDate");
      const description = getTag("description");

      // Decode HTML entities first, then strip tags
      // RSS double-encodes entities (e.g. &amp;ldquo;), so decode &amp; first
      const unescaped = description
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&");
      const decoded = decodeEntities(unescaped);

      const excerpt = decoded
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
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

    return items.filter(item => item.title).slice(0, 10);
  } catch (error) {
    console.warn("Failed to fetch blog feed:", error.message);
    return [];
  }
};
