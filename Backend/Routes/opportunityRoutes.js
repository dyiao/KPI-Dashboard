const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken');
require('dotenv').config()
const cors = require('cors')
const opportunityController = require('../controller/opportunityController')
const jwtRequired = passport.authenticate('jwt', { session: false });

router.get('/opportunityBarChart', cors(), opportunityController.getOppBarChart);

router.get('/oppTable', cors(), opportunityController.getOppStatistics);

router.get('/oppFlag', cors(), opportunityController.getOppFlag);

router.get('/colourBand', cors(), opportunityController.getOppColourBand);

module.exports = router;
