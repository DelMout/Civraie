const express = require("express");
const router = express.Router();

const orderCtrl = require("../controllers/order");

const multer = require("../middleware/multer-config"); //Upload files
const auth = require("../middleware/auth"); // Request authentification
const admin = require("../middleware/isAdmin"); // Request authentification for admin

// * Create an order
router.post("/createorder/:userid", orderCtrl.createOrder); //! Retiré auth

// * See order according to delivery date
router.get("/getorders/:delivery_date", orderCtrl.getAllOrders); //! Retiré admin

// * Sort orders by user
router.get("/getorders/:delivery_date/user", orderCtrl.getOrdersByUser); //! retiré admin

// * Sort orders by product
router.get("/getorders/:delivery_date/product", orderCtrl.getOrdersByProd); //! retiré admin

module.exports = router;
