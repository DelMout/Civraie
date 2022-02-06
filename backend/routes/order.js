const express = require("express");
const router = express.Router();

const orderCtrl = require("../controllers/order");

const auth = require("../middleware/auth"); // Request authentification
const admin = require("../middleware/isAdmin"); // Request authentification for admin

// * Create an order
router.post("/createorder/:userid/:delivery_date", auth, orderCtrl.createOrder);

// * See order according to delivery date and if snails products
router.get("/getallorders/:escarg/:delivery_date", admin, orderCtrl.getAllOrders);

// * Send email for order confirmation
router.post("/emailconf/:userid/:contenu", auth, orderCtrl.emailConfirm);
module.exports = router;
