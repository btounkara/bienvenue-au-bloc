// Recherche et filtre par rubrique sur la page d'accueil.
// La recherche porte sur tout le contenu des publications (titre, résumé, citations, témoignage…).
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

  // "anesthesie" trouve "anesthésie", sans tenir compte des majuscules
  const normaliser = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  async function chargerIndex() {
    if (index) return;
    index = {};
    try {
      const reponse = await fetch(grille.dataset.index);
      for (const p of await reponse.json()) index[p.url] = normaliser(p.texte);
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
    compteur.textContent = visibles + (visibles > 1 ? " publications" : " publication");
    vide.hidden = visibles > 0;
    if (!visibles) {
      vide.textContent = mots.length
        ? `Aucune publication ne contient « ${saisie} ». Essayez un autre mot.`
        : "Rien dans cette rubrique pour le moment. Revenez bientôt !";
    }
  }

  function choisirTheme(theme) {
    themeActif = theme;
    zoneThemes.querySelectorAll("button").forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.theme === theme)));
    filtrer();
  }

  champ.addEventListener("input", async () => {
    await chargerIndex();
    filtrer();
  });

  zoneThemes.addEventListener("click", (e) => {
    const bouton = e.target.closest("button");
    if (bouton) choisirTheme(bouton.dataset.theme);
  });

  // Les liens "#portraits" et "#erreurs" (menu, encarts) ouvrent la bonne rubrique
  const depuisAncre = () => {
    if (location.hash === "#portraits") choisirTheme("Les portraits du bloc");
    else if (location.hash === "#erreurs") choisirTheme("L'erreur à ne plus commettre");
  };
  window.addEventListener("hashchange", depuisAncre);
  document.addEventListener("click", (e) => {
    if (e.target.closest('a[href$="#portraits"], a[href$="#erreurs"]')) setTimeout(depuisAncre);
  });
  depuisAncre();
})();
