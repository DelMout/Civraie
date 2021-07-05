const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");

const multer = require("../middleware/multer-config"); //Upload files
const auth = require("../middleware/auth"); // Request authentification
const admin = require("../middleware/isAdmin"); // Request authentification for admin
const { route } = require("./publication");

// * Voir tous users
router.get("/users", userCtrl.getAllUsers); //! Retiré admin

// * Sign Up
router.post("/signup", admin, multer, userCtrl.signup);

// * Login
router.post("/login", userCtrl.login);

// * Update last connection date
router.put("/login/:userid", auth, userCtrl.lastconn);

// * Demand Modify user datas
router.get("/modif/:userid", auth, userCtrl.demandmodif);

// * Modify user datas
router.put("/modif/:userid", auth, multer, userCtrl.modif);

// * Modify user datas without connection
router.put("/modifpassword/:userid", userCtrl.modifPassword);

// * Delete user
router.delete("/delete/:userid", auth, multer, userCtrl.delete);

// * Identify user
router.get("/ident/:userid", userCtrl.ident);

// * send email for updating password
router.post("/emailpassword/:prenom/:message", userCtrl.emailPassword);

// * send email automatic when new publication
router.post("/emailpub/:prenom/:titre", auth, userCtrl.emailPub);

// * send email automatic when new comment
router.post("/emailcom/:pubid", auth, userCtrl.emailCom);

// * Find user from his jeton
router.get("/user/:jeton", userCtrl.userJeton);

// // * Find user by email
// router.get("/find/:email", admin, userCtrl.findUser);

module.exports = router;
