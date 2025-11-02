const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const PORT = 3001;
const DB_PATH = path.join(__dirname, 'db.json');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/products');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

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

// Get all customers
app.get('/api/customers', (req, res) => {
  const db = readDB();
  res.json(db.customers);
});

// Get dashboard stats
app.get('/api/dashboard', (req, res) => {
  const db = readDB();
  const totalRevenue = db.orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = db.orders.length;
  const totalCustomers = db.customers.length;
  const totalProducts = db.products.length;

  res.json({
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
  });
});

// Add a new product
app.post('/api/products', upload.single('image'), (req, res) => {
  const db = readDB();
  const newProduct = {
    id: Date.now().toString(),
    ...req.body,
  };

  if (req.file) {
    // Make sure the path is web-accessible
    newProduct.image = `/images/products/${req.file.filename}`;
  }

  db.products.push(newProduct);
  writeDB(db);
  res.status(201).json(newProduct);
});

// Update a product
app.put('/api/products/:id', upload.single('image'), (req, res) => {
  const db = readDB();
  const productId = req.params.id;
  const productIndex = db.products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const updatedProduct = { ...db.products[productIndex], ...req.body };

  if (req.file) {
    updatedProduct.image = `/images/products/${req.file.filename}`;
  }

  db.products[productIndex] = updatedProduct;
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

// Create a new order
app.post('/api/orders', (req, res) => {
  const db = readDB();
  const { items, customer } = req.body;

  const total = items.reduce((sum, item) => sum + (item.price.amount * item.quantity), 0);

  const newOrder = {
    id: `ORD-${Date.now()}`,
    customerName: customer.name,
    date: new Date().toISOString(),
    total,
    items,
  };

  db.orders.unshift(newOrder); // Add to the beginning of the array

  let existingCustomer = db.customers.find(c => c.email === customer.email);
  if (existingCustomer) {
    existingCustomer.totalOrders += 1;
  } else {
    db.customers.push({
      id: `CUST-${Date.now()}`,
      name: customer.name,
      email: customer.email,
      totalOrders: 1,
    });
  }

  writeDB(db);
  res.status(201).json(newOrder);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
