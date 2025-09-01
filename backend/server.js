const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// In-memory storage for demo purposes
const users = [];
const transactions = [];

function calculateCommission(amount) {
  return amount * 0.002; // 0.20%
}

// Authentication endpoints
app.post('/auth/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing credentials' });
  }
  users.push({ username, password, balance: 0 });
  res.json({ message: 'Registered successfully' });
});

app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ message: 'Logged in', user: { username: user.username } });
});

// Deposit Solana
app.post('/wallet/deposit', (req, res) => {
  const { username, amount } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  user.balance += amount;
  res.json({ balance: user.balance });
});

// Trade tokens (placeholder)
app.post('/trade', (req, res) => {
  // This is a stub. Real implementation would interact with Solana SDK.
  res.json({ message: 'Trade executed (stub)' });
});

// Purchase with fiat conversion
app.post('/purchase', (req, res) => {
  const { username, amount } = req.body; // amount in SOL
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const commission = calculateCommission(amount);
  const total = amount + commission; // ignoring solana fees here
  if (user.balance < total) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }
  user.balance -= total;
  const txn = { username, amount, commission, date: new Date().toISOString() };
  transactions.push(txn);
  // A real implementation would convert SOL to fiat via an external service.
  res.json({ message: 'Purchase completed', transaction: txn });
});

// Admin route
app.get('/admin/transactions', (req, res) => {
  // In production, authenticate admin user
  res.json({ transactions });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
