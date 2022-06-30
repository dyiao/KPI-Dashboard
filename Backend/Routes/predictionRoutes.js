const express = require('express');
const router = express.Router();
const cors = require('cors');
const predictionController = require("../controller/predictionController");

router.get("/flagComposition", cors(), predictionController.getFlagComposition);

router.get("/flagStatistics", cors(), predictionController.getFlagStatistics);

router.get("/errors", cors(), predictionController.getDailyErrors);

module.exports = router;