const montrerBrouillons = process.env.ELEVENTY_RUN_MODE === "serve";

export default {
  layout: "premiere-fois.njk",
  rubrique: "La première fois où j'ai…",
  eleventyComputed: {
    // Un brouillon n'est pas mis en ligne
    permalink: (data) =>
      data.brouillon && !montrerBrouillons ? false : `/la-premiere-fois/${data.page.fileSlug}/`,
  },
};
