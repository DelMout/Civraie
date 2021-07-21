const express = require("express");
const router = express.Router();

const orderCtrl = require("../controllers/order");

const multer = require("../middleware/multer-config"); //Upload files
const auth = require("../middleware/auth"); // Request authentification
const admin = require("../middleware/isAdmin"); // Request authentification for admin

// * Create an order
router.post("/createorder/:userid/:dateid", orderCtrl.createOrder); //! Retiré auth

// * See order according to delivery date
router.get("/getorders/:dateid", orderCtrl.getAllOrders); //! Retiré admin

// * Sort orders by user
router.get("/getorders/:dateid/user", orderCtrl.getOrdersByUser); //! retiré admin

// * Sort orders by product
router.get("/getorders/:dateid/product", orderCtrl.getOrdersByProd); //! retiré admin

// * Send email for order confirmation
router.post("/emailconf/:userid/:dateid", orderCtrl.emailConfirm); //! Retiré auth

module.exports = router;
