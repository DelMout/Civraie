const express = require("express");
const router = express.Router();

const infoCtrl = require("../controllers/information");

const multer = require("../middleware/multer-config"); //Upload files
const auth = require("../middleware/auth"); // Request authentification
const admin = require("../middleware/isAdmin"); // Request authentification for admin

// * See content from  item
router.get("/supportvente/:item", infoCtrl.supportVente); //! Retiré admin

// * See all ordering OR Weekday (title=Ordering/Weekday)
router.get("/getall/:title", infoCtrl.allInformations); //! Retiré admin
// router.get("/supportvente/:title", infoCtrl.allSupportsVente); //! Retiré admin

// * Get opening hours
router.get("/openhours", infoCtrl.openHours); //! Retiré admin

// * Save modifications of opening hours
router.put("/openhours/modification", infoCtrl.modifOpenHours); //! Retiré admin

module.exports = router;
