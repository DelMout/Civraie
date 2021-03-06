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

// * See products according to producerId
router.get("/producerid/:producerid", productCtrl.getProductsProducerid); //! No need Admin

// * See all products actived
router.get("/getproducts/actived", productCtrl.getProductsActived); //! No need auth

// * See all products with stock-manag
router.get("/getproducts/stockmanag", admin, productCtrl.getProductsStockManag);

// * See products according to ordering=1 and 2 AND category AND active=1
router.get("/category/:category", productCtrl.getProductsCategory);

// * See datas of product
router.get("/datas/:productid", admin, productCtrl.getDatasProduct);

// * Modify a product
router.put("/modif/:productid", admin, multer, productCtrl.modifProduct);

// * Change "active" of a product
router.put("/changeactive/:productid/:active", auth, productCtrl.changeActive);

// * Change "stock_manag" of a product
router.put("/changestockmanag/:productid/:stockmanag", admin, productCtrl.changeStockManag);

// * Decremente "stock_updated" of a product
router.put("/stockmanag/decrementestock/:productid/:qty", auth, productCtrl.decrementeStock);

// * Put all products on "active"
router.put("/putallproducts/actived", admin, productCtrl.putProductsActived);

// * Put all products on "INactive"
router.put("/putallproducts/inactived", admin, productCtrl.putProductsInactived);

// * Check if product must become inactive (after clotureday)
router.put("/checkactive/putinactive", productCtrl.checkActive);

// * Delete a product
router.delete("/delete/:productid", admin, multer, productCtrl.deleteProduct);

module.exports = router;
