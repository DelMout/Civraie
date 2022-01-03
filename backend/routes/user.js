const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");

const auth = require("../middleware/auth"); // Request authentification
const ident = require("../middleware/ident"); // Request identification (connectedId = Req.params.id)
const admin = require("../middleware/isAdmin"); // Request authentification for admin

// * Sign Up
router.post("/signup", userCtrl.signup);

// * Login
router.post("/login", userCtrl.login);

// // * See datas for a user via email
// router.get("/firstname/:email", userCtrl.firstname);

// * Update last connection date + jeton
router.put("/login/:email", auth, userCtrl.lastconn);

// * Update phone number
router.put("/account/phone/:userid", auth, userCtrl.updatePhone);

// * See all users
router.get("/allusers", admin, userCtrl.getAllUsers);

// * See datas for a user via id
router.get("/getuser/:userid", auth, userCtrl.getUser);

// * Comment a user
router.put("/comment/:userid", admin, userCtrl.comment);

// * Modify password after lost
router.put("/password/:jeton", userCtrl.updatePassword);

// * Delete user from admin
router.delete("/delete/:userid", admin, userCtrl.delete);

// * Delete user from user
router.delete("/deletemyaccount/:userid", ident, userCtrl.deleteMyAccount);

// * send email for updating password
router.post("/emailpassword/:email", userCtrl.emailPassword);

// * Find user from his jeton
router.get("/:jeton", userCtrl.jeton);

// * send email to all users for specific information
router.post("/emailinfo", admin, userCtrl.emailInfo);

module.exports = router;
