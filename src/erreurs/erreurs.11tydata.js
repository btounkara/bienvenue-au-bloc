const montrerBrouillons = process.env.ELEVENTY_RUN_MODE === "serve";

export default {
  layout: "erreur.njk",
  rubrique: "Si c'était à refaire",
  eleventyComputed: {
    // Un brouillon n'est pas mis en ligne
    permalink: (data) =>
      data.brouillon && !montrerBrouillons ? false : `/si-c-etait-a-refaire/${data.page.fileSlug}/`,
  },
};
