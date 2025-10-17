const express = require('express');
const router = express.Router();
const { plan } = require('../controllers/budgetController');

router.post('/plan', plan);

module.exports = router;


