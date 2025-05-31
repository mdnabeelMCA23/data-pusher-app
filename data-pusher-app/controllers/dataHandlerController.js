const Account = require('../models/account');
const Destination = require('../models/destination');
const axios = require('axios');

exports.handleIncomingData = async (req, res) => {
  try {
    const appToken = req.header('CL-X-TOKEN');
    const data = req.body;

    if (!appToken) {
      return res.status(401).json({ message: 'Un Authenticate' });
    }

    const account = await Account.findOne({ where: { appSecretToken: appToken } });

    if (!account) {
      return res.status(404).json({ message: 'Invalid Token' });
    }

    const destinations = await Destination.findAll({ where: { accountId: account.id } });

    if (!destinations || destinations.length === 0) {
      return res.status(404).json({ message: 'No destinations found for this account' });
    }

    for (const dest of destinations) {
      const url = dest.url;
      const method = dest.httpMethod.toLowerCase();
      const headers = dest.headers;

      try {
        if (method === 'get') {
          // Convert JSON to query params
          const params = new URLSearchParams(data).toString();
          await axios.get(`${url}?${params}`, { headers });
        } else if (['post', 'put'].includes(method)) {
          await axios({ method, url, headers, data });
        } else {
          console.log(`Unsupported HTTP method: ${method}`);
        }
      } catch (err) {
        console.error(`Error sending data to ${url}:`, err.message);
      }
    }

    res.json({ message: 'Data forwarded to all destinations' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
