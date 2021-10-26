const express = require("express");
const router = express.Router();

const categoCtrl = require("../controllers/category");

// * Get datas of categories
router.get("/getcategories", categoCtrl.getCategories);

module.exports = router;
