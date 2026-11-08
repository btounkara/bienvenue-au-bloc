const montrerBrouillons = process.env.ELEVENTY_RUN_MODE === "serve";

export default {
  layout: "temoignage.njk",
  rubrique: "La première fois où j'ai…",
  ancre: "premiere-fois",
  retour: "Toutes les premières fois",
  titreTemoignage: "Son témoignage",
  bienveillance:
    "Tout le monde a eu une première fois. Celle-ci est racontée pour vous rappeler que l'appréhension est normale, et qu'elle passe.",
  eleventyComputed: {
    // Un brouillon n'est pas mis en ligne
    permalink: (data) =>
      data.brouillon && !montrerBrouillons ? false : `/la-premiere-fois/${data.page.fileSlug}/`,
  },
};
