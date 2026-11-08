const montrerBrouillons = process.env.ELEVENTY_RUN_MODE === "serve";

export default {
  layout: "temoignage.njk",
  rubrique: "Si c'était à refaire",
  ancre: "refaire",
  retour: "Toutes les expériences",
  titreTemoignage: "Son témoignage",
  bienveillance:
    "Cette situation aurait pu arriver à n'importe qui. Merci à la personne qui a accepté de la partager pour que d'autres en tirent profit.",
  eleventyComputed: {
    // Un brouillon n'est pas mis en ligne
    permalink: (data) =>
      data.brouillon && !montrerBrouillons ? false : `/si-c-etait-a-refaire/${data.page.fileSlug}/`,
  },
};
