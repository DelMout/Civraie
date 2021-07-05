const express = require("express");
const router = express.Router();

const likepubCtrl = require("../controllers/likepub");

const auth = require("../middleware/auth"); // Request authentification

// * Count likes
router.get("/:pubid/like/", likepubCtrl.countLike);

// * Give symbol selected by user
router.get("/:pubid/user/:userid", likepubCtrl.whichSymbol);

// * Count each symbol
router.get("/:pubid/count/:symbol", likepubCtrl.countSymbol);

// * Add a symbol on publication (heart/thumb/...)
router.post("/:pubid/like/:userid/symbol/:symbol", auth, likepubCtrl.addSymbol);

module.exports = router;
