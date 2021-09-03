const express = require("express");
const router = express.Router();

const multer = require("../middleware/multer-config"); //Upload files
const auth = require("../middleware/auth"); // Request authentification
const admin = require("../middleware/isAdmin"); // Request authentification for admin

const dateCtrl = require("../controllers/date");

// * Find dateId according to today's date
router.get("/find", dateCtrl.find);

// // //! fcatice
// // * Find dateId according to today's date
// router.get("/suggest", dateCtrl.suggest);

// * Modify dates
router.put("/update/:dateid", dateCtrl.update); //! retiré admin

// * Get datas of date via id
router.get("/getdate/:dateid", dateCtrl.getDate);

// * Find dateId and delivery_date from 2 weeks before today and the future
router.get("/suggest", dateCtrl.suggest);

module.exports = router;
