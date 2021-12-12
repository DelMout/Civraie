const express = require("express");
const router = express.Router();

const productCtrl = require("../controllers/product");

const multer = require("../middleware/multer-config.js"); //Upload files
const auth = require("../middleware/auth"); // Request authentification
const admin = require("../middleware/isAdmin"); // Request authentification for admin

// * Create a product
router.post("/createproduct", admin, multer, productCtrl.createProduct);

// * See all products
router.get("/", admin, productCtrl.getAllProducts);

// // * See products according to ordering
// router.get("/:ordering", productCtrl.getProductsOrdering);

// * See products according to producerId
router.get("/producerid/:producerid", admin, productCtrl.getProductsProducerid);

// * See all products actived
router.get("/getproducts/actived", productCtrl.getProductsActived); //! No auth

// * See products according to ordering=1 and 2 AND category AND active=1
router.get("/category/:category", productCtrl.getProductsCategory);

// * See datas of product
router.get("/datas/:productid", admin, productCtrl.getDatasProduct);

// * Modify a product
router.put("/modif/:productid", admin, multer, productCtrl.modifProduct);

// * Change "active" of a product
router.put("/changeactive/:productid/:active", admin, productCtrl.changeActive);

// * Check if product must become inactive (after clotureday)
router.put("/checkactive/putinactive", productCtrl.checkActive);

// * Delete a product
router.delete("/delete/:productid", admin, multer, productCtrl.deleteProduct);

module.exports = router;
