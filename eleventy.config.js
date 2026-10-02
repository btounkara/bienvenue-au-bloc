import { HtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  // Sur GitHub Pages le site peut vivre dans un sous-dossier (/bienvenueaubloc/) :
  // ce plugin corrige automatiquement tous les liens et images.
  eleventyConfig.addPlugin(HtmlBasePlugin);

  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/assets");

  // Articles publiés (hors brouillons), du plus récent au plus ancien
  eleventyConfig.addCollection("articles", (api) =>
    api
      .getFilteredByGlob("src/articles/*.md")
      .filter((a) => !a.data.brouillon)
      .sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addFilter("dateFr", (date) =>
    new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(date)
  );
  eleventyConfig.addFilter("dateIso", (date) => date.toISOString().slice(0, 10));

  // Dans le titre d'accueil, les mots entre *étoiles* s'affichent en rose corail
  const echapper = (t = "") => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  eleventyConfig.addFilter("motsEnCouleur", (t) => echapper(t).replace(/\*([^*]+)\*/g, "<em>$1</em>"));

  const texteBrut = (html = "") =>
    html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
  eleventyConfig.addFilter("texteBrut", texteBrut);
  eleventyConfig.addFilter("dureeLecture", (html) =>
    Math.max(1, Math.round(texteBrut(html).split(" ").length / 200))
  );

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
}
