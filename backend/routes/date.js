const express = require("express");
const router = express.Router();

const dateCtrl = require("../controllers/date");

const multer = require("../middleware/multer-config"); //Upload files
const auth = require("../middleware/auth"); // Request authentification
const admin = require("../middleware/isAdmin"); // Request authentification for admin

// * Find dateId according to today's date
router.get("/find", dateCtrl.find); //! Retiré auth

// * Modify dates
router.put("/update/:dateid", dateCtrl.update); //! retiré admin

module.exports = router;
