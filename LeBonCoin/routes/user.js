const express = require("express"); // j'active mon package express pour créer mes routes
const router = express.Router(); // j'active ma fonctionnalité "Router"
const uid2 = require("uid2");
const SHA256 = require("crypto-js/SHA256");
const encBase64 = require("crypto-js/enc-base64");

// J'importe mon modèle "User". je peux l'importer car je l'avais exporter au préalable dans le modèle avec la fonction : module.exports = User
const User = require("../models/User");

//je crée mon router Post pour s'enregistrer : /sign_up

//1. CREATE ********* Model : USER **********

router.post("/user/sign_up", async (req, res) => {
  try {
    // je défini la condition si l'email existe déjà
    // je défini le cryptage SALT et mon cryptage Hash & mon token
    const salt = uid2(16); // le salt va être ajouté au password pour être "haché"
    const hash = SHA256(req.fields.password + salt).toString(encBase64);
    /*le hash devient ainsi le résultat du cryptage du mot de passe + du 
  code aléatoire Salt*/

    // je défini ma variable token pour vérifier plus tard les droits d'un utilisateur (Cf def dans model User)
    const token = uid2(16);

    // je fais mon try catch qui me servira à CREER tous mes nouveaux utilsateurs
    // console.log("ici");
    const newUser = new User({
      email: req.fields.email,
      account: {
        username: req.fields.username,
        phone: req.fields.phone
      },
      token: token, //
      salt: salt, // = password 1ère vague de cryptage
      hash: hash // = password 2 ème cryptage
    });
    const doubleMail = await User.findOne({ email: req.fields.email });
    const emptyUserName = req.fields.username;
    if (doubleMail !== null) {
      res.json({ message: "user already exist" });
    }
    if (!emptyUserName || !req.fields.email || !req.fields.password) {
      res.json({ message: "Missing parameters" });
      // console.log("là");
    } else await newUser.save();

    // console.log("là 2");
    // console.log(newUser);
    // console.log("là 3");
    res.json({
      _id: newUser._id,
      token: newUser.token,
      email: newUser.email,
      account: newUser.account
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//2. CHECK ********* Model : USER **********

router.post("/user/log_in", async (req, res) => {
  try {
    // on cherche le user qui veut se connecter
    const user = await User.findOne({ email: req.fields.email });

    if (user) {
      // si le hash du mot de passe qu'il vient de saisir est le même que le hash enregistré en BDD lors de son inscription, alors c'est bon !
      if (
        SHA256(req.fields.password + user.salt).toString(encBase64) ===
        user.hash
      ) {
        res.json({
          _id: user._id,
          token: user.token,
          email: user.email,
          account: user.account
        });
      } else {
        // sinon, il n'est pas autorisé à se connecter
        res.json({ error: "Unauthorized" });
      }
    } else {
      res.json({ error: "Unauthorized" });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

// j'exporte la route  afin d'y avoir accès quand on l'importera dans index.js

module.exports = router; // Toujours penser à mettre un export dans les modèles ET les routes
