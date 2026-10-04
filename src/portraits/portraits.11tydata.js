const montrerBrouillons = process.env.ELEVENTY_RUN_MODE === "serve";

export default {
  layout: "portrait.njk",
  rubrique: "Les portraits du bloc",
  eleventyComputed: {
    // Un brouillon n'est pas mis en ligne
    permalink: (data) =>
      data.brouillon && !montrerBrouillons ? false : `/portraits/${data.page.fileSlug}/`,
  },
};
