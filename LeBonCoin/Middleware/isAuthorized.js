// j'importe le modèle User pour que ma référence fonctionne
const User = require("../models/User");

// j'importe le modèle Announce pour que la référence fonctionne
const Announce = require("../models/Announce");

// je crée mon cas d'autentification qui permettra au user de publier une annonce

const isAuthorized = async (req, res, next) => {
  console.log(req.headers.authorization);
  if (req.headers.authorization) {
    // permet d'identifier le user via son token
    // je cherche mon utilisateur via son token pour l'identifier comme étant apte à publier
    const publisher = await User.findOne({
      token: req.headers.authorization.replace("Bearer ", "")
    });
    // je crée une condition si il n'est pas autorisé à publier + un message approprié
    if (!publisher) {
      return res.json({
        error: "you are not authorized to published an announce"
      });
      // si il est autorisé à publier... --> débloquera la route "annonce""
    } else {
      req.publisher = publisher; // je crée une clé publisher dans req. Côté route on va pouvoir récupérer req.publisher
      next(); // permet de passer à la suite et de rentrer dans la route(obligatoire sinon il n'y aura jamais de réponse de la route définie
    }
    // si l'utilisateur n'est pas identifié alors j'envoie un message de non autorisation (Première boucle "if")
  } else {
    return res.json({ message: "Unauthorized" });
  }
};

module.exports = isAuthorized;
