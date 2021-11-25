const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");

const multer = require("../middleware/multer-config"); //Upload files
const auth = require("../middleware/auth"); // Request authentification
const admin = require("../middleware/isAdmin"); // Request authentification for admin

// * Sign Up
router.post("/signup", userCtrl.signup);

// * Login
router.post("/login", userCtrl.login);

// * See datas for a user via email
router.get("/firstname/:email", userCtrl.firstname); //! Retiré auth

// * Update last connection date + jeton
router.put("/login/:email", userCtrl.lastconn); //! retiré auth

// * See all users
router.get("/allusers", userCtrl.getAllUsers); //! Retiré admin

// * See datas for a user via id
router.get("/getuser/:userid", userCtrl.getUser); //! Retiré admin

// * Comment a user
router.put("/comment/:userid", userCtrl.comment); //! retiré admin

// * Modify password after lost
router.put("/password/:jeton", userCtrl.updatePassword);

// * Delete user
router.delete("/delete/:userid", userCtrl.delete); //! retiré admin

// * send email for updating password
router.post("/emailpassword/:email", userCtrl.emailPassword);

// * Find user from his jeton
router.get("/:jeton", userCtrl.jeton);

// // * send email to all users for ordering
// router.post("/emailorder", userCtrl.emailOrder); //! retiré admin

// * send email to all users for specific information
router.post("/emailinfo", userCtrl.emailInfo); //! retiré admin

module.exports = router;
