const express = require("express");
const router = express.Router();

const productCtrl = require("../controllers/product");

const multer = require("../middleware/multer-config.js"); //Upload files
const auth = require("../middleware/auth"); // Request authentification
const admin = require("../middleware/isAdmin"); // Request authentification for admin

// * Create a product
router.post("/createproduct", multer, productCtrl.createProduct); //! Retiré admin

// * See all products
router.get("/", productCtrl.getAllProducts); //! Retiré admin

// * See products according to ordering
router.get("/:ordering", productCtrl.getProductsOrdering); //! accès without authorisation

// * See all products actived
router.get("/actived", productCtrl.getProductsActived); //! retiré auth

// * See products according to ordering=1 and 2 AND category AND active=1
router.get("/category/:category", productCtrl.getProductsCategory); //! retiré auth

// * See datas of product
router.get("/datas/:productid", productCtrl.getDatasProduct); //! Retiré auth

// * Modify a product
router.put("/modif/:productid", multer, productCtrl.modifProduct); //! retiré admin

// * Change "active" of a product
router.put("/changeactive/:productid/:active", productCtrl.changeActive); //! retiré admin

// * Check if product must become inactive (after clotureday)
router.put("/checkactive/putinactive", productCtrl.checkActive);

// * Delete a product
router.delete("/delete/:productid", multer, productCtrl.deleteProduct); //! retiré admin

module.exports = router;
