const express = require("express");
const router = express.Router();

const infoCtrl = require("../controllers/information");

const admin = require("../middleware/isAdmin"); // Request authentification for admin

// * See content from  item
router.get("/supportvente/:item", infoCtrl.supportVente); //! No need admin

// * See all ordering OR Weekday (title=Ordering/Weekday)
router.get("/getall/:title", infoCtrl.allInformations); //! No need admin

// * Get opening hours
router.get("/openhours", infoCtrl.openHours); //! No need admin

// * Save modifications of opening hours
router.put("/openhours/modification", admin, infoCtrl.modifOpenHours);

module.exports = router;
