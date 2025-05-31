const express = require('express');
const router = express.Router();
const { Account, Destination } = require('../models');
const axios = require('axios');

router.post('/incoming_data', async (req, res) => {
  try {
    const token = req.headers['cl-x-token'];
    if (!token) {
      return res.status(401).json({ message: 'Un Authenticate' });
    }

    const account = await Account.findOne({ where: { appSecretToken: token } });
    if (!account) {
      return res.status(401).json({ message: 'Un Authenticate' });
    }

    if (!req.is('application/json')) {
      return res.status(400).json({ message: 'Invalid Data' });
    }

    const data = req.body;

    const destinations = await Destination.findAll({ where: { AccountId: account.id } });

    if (!destinations || destinations.length === 0) {
      return res.status(404).json({ message: 'No destinations found for this account' });
    }

    console.log('Account:', account.accountName);
    console.log('Destinations:', destinations);
    console.log('Incoming Data:', data);

    // Here you can add sending logic, for now just send success
    return res.json({ message: 'Data received and will be forwarded' });
  } catch (error) {
    console.error('Error in /incoming_data:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
