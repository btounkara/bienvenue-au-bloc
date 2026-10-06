import { HtmlBasePlugin } from "@11ty/eleventy";

// En aperçu sur l'ordinateur (npm start), les brouillons sont visibles ; jamais sur le site en ligne.
const montrerBrouillons = process.env.ELEVENTY_RUN_MODE === "serve";

export default function (eleventyConfig) {
  // Préfixe d'adresse fourni par GitHub Pages au build (vide sur www.bienvenueaubloc.fr) :
  // ce plugin corrige automatiquement tous les liens et images.
  eleventyConfig.addPlugin(HtmlBasePlugin);

  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.addGlobalData("montrerBrouillons", montrerBrouillons);

  // Publications visibles, de la plus récente à la plus ancienne
  const publiees = (api, dossier) =>
    api
      .getFilteredByGlob(`src/${dossier}/*.md`)
      .filter((p) => montrerBrouillons || !p.data.brouillon)
      .sort((a, b) => b.date - a.date);

  eleventyConfig.addCollection("portraits", (api) => publiees(api, "portraits"));
  eleventyConfig.addCollection("erreurs", (api) => publiees(api, "erreurs"));
  eleventyConfig.addCollection("publications", (api) =>
    [...publiees(api, "portraits"), ...publiees(api, "erreurs")].sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addFilter("dateFr", (date) =>
    new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(date)
  );
  eleventyConfig.addFilter("dateIso", (date) => date.toISOString().slice(0, 10));

  const echapper = (t = "") =>
    String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  // Dans le titre d'accueil, les mots entre *étoiles* s'affichent en rose corail
  eleventyConfig.addFilter("motsEnCouleur", (t) => echapper(t).replace(/\*([^*]+)\*/g, "<em>$1</em>"));

  // Texte saisi sur plusieurs lignes -> paragraphes
  eleventyConfig.addFilter("paragraphes", (t = "") =>
    String(t)
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => `<p>${echapper(p).replace(/\n/g, "<br>")}</p>`)
      .join("\n")
  );

  eleventyConfig.addFilter("texteBrut", (html = "") =>
    String(html).replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim()
  );

  // Lien Spotify ("Partager > Copier le lien") -> adresse du lecteur intégré
  eleventyConfig.addFilter("lecteurSpotify", (lien = "") => {
    const m = String(lien).match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(episode|show)\/([A-Za-z0-9]+)/);
    return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator` : "";
  });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
}
