const express = require('express');
const router = express.Router();

const hwController = require('../controllers/hwController');

router.post('/', hwController.createHw);

router.get('/', hwController.getAllHws);

router.get('/:id', hwController.getHwById);

router.delete('/:id', hwController.deleteHw);

module.exports = router;