const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(bodyParser.json());

// Helper function to read the database
const readDB = () => {
  const db = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(db);
};

// Helper function to write to the database
const writeDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// Get all products
app.get('/api/products', (req, res) => {
  const db = readDB();
  res.json(db.products);
});

// Get all orders
app.get('/api/orders', (req, res) => {
  const db = readDB();
  res.json(db.orders);
});

// Add a new product
app.post('/api/products', (req, res) => {
  const db = readDB();
  const newProduct = {
    id: Date.now().toString(),
    ...req.body,
  };
  db.products.push(newProduct);
  writeDB(db);
  res.status(201).json(newProduct);
});

// Update a product
app.put('/api/products/:id', (req, res) => {
  const db = readDB();
  const productId = req.params.id;
  const productIndex = db.products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  db.products[productIndex] = { ...db.products[productIndex], ...req.body };
  writeDB(db);
  res.json(db.products[productIndex]);
});

// Delete a product
app.delete('/api/products/:id', (req, res) => {
  const db = readDB();
  const productId = req.params.id;
  const newProducts = db.products.filter(p => p.id !== productId);

  if (newProducts.length === db.products.length) {
    return res.status(404).json({ message: 'Product not found' });
  }

  db.products = newProducts;
  writeDB(db);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
