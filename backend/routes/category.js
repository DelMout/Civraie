const express = require("express");
const router = express.Router();

const categoCtrl = require("../controllers/category");

const admin = require("../middleware/isAdmin"); // Request authentification for admin

// * Get datas of categories
router.get("/getcategories", categoCtrl.getCategories);

// * Get datas from category Id
router.get("/getcategory/:categoryId", categoCtrl.getCategory);

// * Modify cloture_day of a category
router.put("/modifclotureday/:categoryId", admin, categoCtrl.modifClotureDay);

module.exports = router;
