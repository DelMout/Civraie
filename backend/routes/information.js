const express = require("express");
const router = express.Router();

const infoCtrl = require("../controllers/information");

const multer = require("../middleware/multer-config"); //Upload files
const auth = require("../middleware/auth"); // Request authentification
const admin = require("../middleware/isAdmin"); // Request authentification for admin

// * See content from  item
router.get("/supportvente/:item", infoCtrl.supportVente); //! Retiré admin

// * See all ordering (title=Ordering)
router.get("/supportvente", infoCtrl.allSupportsVente); //! Retiré admin

module.exports = router;
