const express = require('express');
const router = express.Router();
const cors = require('cors');
const performanceController = require("../controller/performanceController");

router.get('/bothComposition', cors(), performanceController.getBothComposition);

router.get('/statistics', cors(), performanceController.getStatistics);

router.get('/MLPerformance', cors(), performanceController.getMLPerformance);

router.get('/colourBandStatistics', cors(), performanceController.getColourBandStatistics);

module.exports = router;