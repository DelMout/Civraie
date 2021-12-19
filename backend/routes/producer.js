const express = require("express");
const router = express.Router();

const producerCtrl = require("../controllers/producer");

const admin = require("../middleware/isAdmin"); // Request authentification for admin

// * Create a producer
router.post("/createproducer", admin, producerCtrl.createProducer);

// * See all producers
router.get("/", admin, producerCtrl.getAllProducers);

// * See a producer via id
router.get("/getproducer/:producerid", producerCtrl.getProducer);

// * See the producerId via entreprise
router.get("/getproducerid/:entreprise", producerCtrl.getProducerId);

// * Modify a producer
router.put("/modif/:producerid", admin, producerCtrl.modifProducer);

// // * Delete a producer
// router.delete("/delete/:producerid", admin, producerCtrl.deleteProducer);

module.exports = router;
