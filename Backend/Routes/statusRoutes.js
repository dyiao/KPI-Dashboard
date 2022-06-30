const express = require('express');
const router = express.Router();
const cors = require('cors');
const statusController = require("../controller/statusController");

router.get('/flagComposition', cors(), statusController.getFlagComposition)

router.get("/stackedBarChart", cors(), statusController.getStackedBarChart)

router.get("/statistics", cors(), statusController.statistics);

router.get("/flagBarChart", cors(), statusController.getFlagBarChart)

module.exports = router;