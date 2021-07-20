const express = require("express");
const router = express.Router();

const producerCtrl = require("../controllers/producer");

const multer = require("../middleware/multer-config"); //Upload files
const auth = require("../middleware/auth"); // Request authentification
const admin = require("../middleware/isAdmin"); // Request authentification for admin

// * Create a producer
router.post("/createproducer", producerCtrl.createProducer); //! Retiré admin

// * See all producers
router.get("/", producerCtrl.getAllProducers); //! Retiré admin

// * See a producer via id
router.get("/getproducer/:producerid", producerCtrl.getProducer);

// * Modify a producer
router.put("/modif/:producerid", producerCtrl.modifProducer); //! retiré admin

// * Delete a product
router.delete("/delete/:producerid", producerCtrl.deleteProducer); //! retiré admin

module.exports = router;
