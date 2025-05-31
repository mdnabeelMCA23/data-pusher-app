const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');

router.post('/', destinationController.createDestination);
router.get('/', destinationController.getDestinations);
router.get('/:id', destinationController.getDestinationById);
router.put('/:id', destinationController.updateDestination);
router.delete('/:id', destinationController.deleteDestination);

// Get destinations by accountId
router.get('/account/:accountId', destinationController.getDestinationsByAccount);

module.exports = router;
