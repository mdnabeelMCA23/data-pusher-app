const Account = require('../models/account');

exports.createAccount = async (req, res) => {
  try {
    const { email, accountName, website } = req.body;

    if (!email || !accountName) {
      return res.status(400).json({ message: 'Email and accountName are required' });
    }

    const existing = await Account.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const account = await Account.create({ email, accountName, website });
    res.status(201).json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAccounts = async (req, res) => {
  try {
    const accounts = await Account.findAll();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAccountById = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await Account.findByPk(id);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, accountName, website } = req.body;

    const account = await Account.findByPk(id);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (email) account.email = email;
    if (accountName) account.accountName = accountName;
    if (website) account.website = website;

    await account.save();
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await Account.findByPk(id);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    await account.destroy();
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
