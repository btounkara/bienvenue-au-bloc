export default {
  layout: "article.njk",
  eleventyComputed: {
    // Un brouillon n'est pas mis en ligne
    permalink: (data) => (data.brouillon ? false : `/articles/${data.page.fileSlug}/`),
  },
};
