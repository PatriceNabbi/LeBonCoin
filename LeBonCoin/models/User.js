// j'active mon package mongoose. // importation de mongoose pour manipuler mongoDB : ici créer le model en base de données
const mongoose = require("mongoose");

// je définis mon model qui sera en lien avec ma base de données mongoDb
// Nom du model : User (sans les guillemets)
// Nom de la collection : "User" (avec les guillemets). Se traduira dans mongoDb par "users".

const User = mongoose.model("User", {
  // je définis les attributs de User (les "documents") et leur typeof
  email: { type: String, unique: true },
  token: String /*Il permet d'autoriser des utilisateurs à entrer leur nom d'utilisateur et leur mot de passe 
afin d'obtenir un jeton qui leur permet d'accèder à une ressource spécifique sans réutiliser un nom d'utilisateur et un mot de passe
Une fois son jeton obtenu, l'utilisateur peut profiter du jeton qui offre un accès à une ressource spécifique 
pour une période de temps précise sur un site distant. En d'autres mots, il permet d'ajouter un niveau d'authentification indirect 
au lieu d'avoir à connecter avec le nom d'utilisateur et mot de passe pour chaque ressource protégée. 
L'utilisateur s'authentifie de cette façon qu'une seule fois (dans une session d'une durée limitée), obtient en retour un jeton 
pour une durée limitée, et utilise ce même jeton pour une authentification supplémentaire au cours de sa session.*/,
  salt: String,
  hash: String,
  account: {
    username: { type: String, required: true },
    phone: { type: String }
  }
});

// j'exporte le modèle  afin d'y avoir accès quand on l'importera dans index.js

module.exports = User;
