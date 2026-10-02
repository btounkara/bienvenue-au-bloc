// Recherche et filtre par catégorie sur la page d'accueil.
// La recherche porte sur le titre, le résumé, la catégorie et le texte complet des articles.
(function () {
  const grille = document.getElementById("grille");
  const champ = document.getElementById("champ-recherche");
  const zoneThemes = document.getElementById("themes");
  const compteur = document.getElementById("compteur");
  const vide = document.getElementById("vide");
  if (!grille || !champ) return;

  const cartes = [...grille.querySelectorAll(".carte")];
  const premiere = cartes[0];
  let themeActif = "Tous";
  let index = null; // url -> texte, chargé à la première recherche

  // "sterile" trouve "stérile", sans tenir compte des majuscules
  const normaliser = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  async function chargerIndex() {
    if (index) return;
    index = {};
    try {
      const reponse = await fetch(grille.dataset.index);
      for (const a of await reponse.json()) index[a.url] = normaliser(a.texte);
    } catch {
      // Sans index, on cherche au moins dans ce qui est affiché sur les cartes
    }
  }

  function texteCarte(carte) {
    return (index && index[carte.dataset.url]) || normaliser(carte.textContent);
  }

  function filtrer() {
    const saisie = champ.value.trim();
    const mots = normaliser(saisie).split(/\s+/).filter(Boolean);
    let visibles = 0;
    for (const carte of cartes) {
      const bonTheme = themeActif === "Tous" || carte.dataset.theme === themeActif;
      const ok = bonTheme && mots.every((m) => texteCarte(carte).includes(m));
      carte.hidden = !ok;
      if (ok) visibles++;
    }
    premiere.classList.toggle("une", themeActif === "Tous" && mots.length === 0);
    compteur.textContent = visibles + (visibles > 1 ? " articles" : " article");
    vide.hidden = visibles > 0;
    if (!visibles) {
      vide.textContent = mots.length
        ? `Aucun article ne contient « ${saisie} »${themeActif !== "Tous" ? " dans le thème " + themeActif : ""}. Essayez un autre mot.`
        : "Aucun article dans ce thème pour le moment.";
    }
  }

  champ.addEventListener("input", async () => {
    await chargerIndex();
    filtrer();
  });

  zoneThemes.addEventListener("click", (e) => {
    const bouton = e.target.closest("button");
    if (!bouton) return;
    themeActif = bouton.dataset.theme;
    zoneThemes.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === bouton)));
    filtrer();
  });
})();
