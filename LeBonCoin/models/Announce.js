// j'active mon package mongoose. // importation de mongoose pour manipuler mongoDB : ici créer le model en base de données
const mongoose = require("mongoose");

// je définis mon model qui sera en lien avec ma base de données mongoDb
// Nom du model : Announce (sans les guillemets)
// Nom de la collection : "Announce" (avec les guillemets). Se traduira dans mongoDb par "announces".

// je définis les attributs de Announce (les "documents") et leur typeof
const Announce = mongoose.model("Announce", {
  title: String,
  description: String,
  price: Number,
  created: {
    type: Date,
    default: Date.now
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = Announce;
