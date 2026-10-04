const montrerBrouillons = process.env.ELEVENTY_RUN_MODE === "serve";

export default {
  layout: "erreur.njk",
  rubrique: "L'erreur à ne plus commettre",
  eleventyComputed: {
    // Un brouillon n'est pas mis en ligne
    permalink: (data) =>
      data.brouillon && !montrerBrouillons ? false : `/erreurs/${data.page.fileSlug}/`,
  },
};
