const express = require('express');
const { setupApi } = require('../bot/services/api');

const router = express.Router();

router.post('/start', (req, res) => setupApi().start(req, res));
router.post('/stop', (req, res) => setupApi().stop(req, res));
router.post('/add-meme-coin', (req, res) => setupApi().addMemeCoin(req, res));
router.post('/update-contract-addresses', (req, res) => setupApi().updateContractAddresses(req, res));
router.post('/update-order-size', (req, res) => setupApi().updateOrderSize(req, res));
router.post('/update-env', (req, res) => setupApi().updateEnv(req, res));

module.exports = router;
