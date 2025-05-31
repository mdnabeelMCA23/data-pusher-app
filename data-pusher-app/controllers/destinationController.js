const Destination = require('../models/destination');
const Account = require('../models/account');

exports.createDestination = async (req, res) => {
  try {
    const { accountId, url, httpMethod, headers } = req.body;

    if (!accountId || !url || !httpMethod || !headers) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const account = await Account.findByPk(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const destination = await Destination.create({ accountId, url, httpMethod, headers });
    res.status(201).json(destination);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDestinations = async (req, res) => {
  try {
    const destinations = await Destination.findAll();
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDestinationById = async (req, res) => {
  try {
    const { id } = req.params;
    const destination = await Destination.findByPk(id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.json(destination);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const { url, httpMethod, headers } = req.body;

    const destination = await Destination.findByPk(id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    if (url) destination.url = url;
    if (httpMethod) destination.httpMethod = httpMethod;
    if (headers) destination.headers = headers;

    await destination.save();
    res.json(destination);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const destination = await Destination.findByPk(id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    await destination.destroy();
    res.json({ message: 'Destination deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all destinations by accountId
exports.getDestinationsByAccount = async (req, res) => {
  try {
    const { accountId } = req.params;
    const destinations = await Destination.findAll({ where: { accountId } });
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
