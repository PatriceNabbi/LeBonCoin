const express = require("express"); // j'active mon package express pour créer ma route "annonce"
const router = express.Router(); // j'active ma fonctionnalité "Router"

// J'importe mon modèle "Announce". je peux l'importer car je l'avais exporter au préalable dans le modèle avec la fonction : module.exports = Announce
const Announce = require("../models/Announce");
const isAuthorized = require("../Middleware/isAuthorized");

// *** 1) Je crée mon router Post pour créer mon annonce : /offer/publish (format params)
// *** 2) Je vérifie que mon utilisateur est bien enregistré pour lui accorder le droit de poster une annonce  --> middleware: canPublished

router.post("/offer/publish", isAuthorized, async (req, res) => {
  try {
    console.log("coucou");

    // Création d'une nouvelle annonce
    const newAnnounce = new Announce({
      title: req.fields.title,
      description: req.fields.description,
      price: req.fields.price,
      user: req.fields.user
    });
    const descriptionIsShort = req.fields.description.length <= 500;
    // console.log(descriptionIsShort);
    const priceMax = req.fields.price <= 100000;
    // console.log(priceMax);
    const titleIsShort = req.fields.title.length <= 50;
    // console.log(titleIsShort);

    // console.log("A");
    // console.log("req.publisher ===>", req.publisher);

    // gestion d'une annonce déjà existante pour le même utilisateur
    const doubleAnnounce = await Announce.findOne({ _id: req.fields.id });
    if (!descriptionIsShort) {
      res.send("Please, make a shorter description");
    }
    if (!titleIsShort) {
      res.send("The title is too long");
    }
    if (!priceMax) {
      res.send("The price is too expensive");
    }
    if (doubleAnnounce) {
      res.json({ message: "you have already posted this announce" });
    }
    // gestion d'une annonce incomplète (titre et prix. Pas nécessaire en ce qui concerne la description)
    if (!req.fields.price || !req.fields.title) {
      res.json({ message: "missing information" });
      //   console.log("C");
    } else {
      await newAnnounce.save();
    }
    // console.log("D");
    // Gestion du retour attendu
    res.json({
      _id: newAnnounce._id,
      title: newAnnounce.title,
      description: newAnnounce.description,
      price: newAnnounce.price,
      created: newAnnounce.created,
      creator: { account: req.publisher.account, _id: req.publisher._id }
    });
    // console.log("E");
    // gestion des cas d'erreur
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// j'exporte la route  afin d'y avoir accès quand on l'importera dans index.js

module.exports = router; // Toujours penser à mettre un export dans les modèles ET les routes
