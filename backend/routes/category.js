const express = require("express");
const router = express.Router();

const categoCtrl = require("../controllers/category");

// * Get datas of categories
router.get("/getcategories", categoCtrl.getCategories);

// * Get datas from category Id
router.get("/getcategory/:categoryId", categoCtrl.getCategory);

module.exports = router;
