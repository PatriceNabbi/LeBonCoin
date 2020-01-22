// Pour créer un compte : nom de la route à créer : sign_up -> Méthode à utiliser : POST
// Pour s'identifier : nom de la route à créer : log_in -> Méthode à utiliser  : POST

// Activation du package express
const express = require("express");
const app = express();

// Activation du package express-formidable (package pour récupérer  les paramètres tramsmis lors des requêtes HTTP de type POST permet d'utiliser les "req.fieds")
const formidableMiddleware = require("express-formidable");
app.use(formidableMiddleware());

// Activation du module Router inclu dans le package express (sera utilisé si j'utilise mes modèles et mes routes en dehors de mon index.js)
const router = express.Router(); //non obligatoire si on utilise pas le router dans ce fichier (grisé si c'est le cas)

// Activation du package mongoose  (package pour manipuler des BDD MongoDB)
const mongoose = require("mongoose");

// Activation des packages qui vont me permettre de crypter le mot de passe
const uid2 = require("uid2");
const SHA256 = require("crypto-js/SHA256");
const encBase64 = require("crypto-js/enc-base64");

// Activation d'une connexion à une base de donnée MongoDB (ici je la nommerai "LeBonCoin")

mongoose.connect("mongodb://localhost/LeBonCoin", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

//Activation de l'utilisation des routes :
const userRoutes = require("./routes/user");

//Importation des routes
app.use(userRoutes);

//Gestion des routes erronées

app.all("*", (req, res) => {
  res.json({ message: "Page not found" });
});

// Création du LOCALHOST

app.listen(3000, () => {
  console.log("Server has started");
});
