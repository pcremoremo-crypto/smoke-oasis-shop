import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Since we are in an ES module, __dirname is not available. We can create it.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// We need to dynamically import the app since it's a CommonJS module
const appModule = await import('./server.cjs');
const app = appModule.default; // Access the default export

const ORIGINAL_DB_PATH = path.join(__dirname, 'db.json');
const TEST_IMAGE_PATH = path.join(__dirname, 'test-image.png');
const UPLOAD_DIR = path.join(__dirname, 'public/images/products');

describe('API Endpoints', () => {
  let originalDbContent = null;
  const uploadedFiles = [];

  beforeAll(() => {
    // Create a dummy image for testing uploads
    fs.writeFileSync(TEST_IMAGE_PATH, 'dummy content');

    // Ensure upload directory exists
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    // Backup original db if it exists
    if (fs.existsSync(ORIGINAL_DB_PATH)) {
      originalDbContent = fs.readFileSync(ORIGINAL_DB_PATH);
    }
  });

  afterAll(() => {
    // Restore original db
    if (originalDbContent) {
      fs.writeFileSync(ORIGINAL_DB_PATH, originalDbContent);
    }
    // Clean up dummy image
    if (fs.existsSync(TEST_IMAGE_PATH)) {
      fs.unlinkSync(TEST_IMAGE_PATH);
    }
    // Clean up any uploaded files
    uploadedFiles.forEach(file => {
      const filePath = path.join(UPLOAD_DIR, path.basename(file));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    // Clean up upload directory if empty (optional)
    if (fs.existsSync(UPLOAD_DIR) && fs.readdirSync(UPLOAD_DIR).length === 0) {
      fs.rmdirSync(UPLOAD_DIR);
    }
  });

  beforeEach(() => {
    // Reset database before each test
    const initialData = {
      products: [],
      orders: [],
      customers: [],
    };
    fs.writeFileSync(ORIGINAL_DB_PATH, JSON.stringify(initialData, null, 2));
  });

  // Helper to read DB content
  const readDB = () => JSON.parse(fs.readFileSync(ORIGINAL_DB_PATH, 'utf-8'));

  // --- Product Endpoints ---

  it('GET /api/products should return an array of products', async () => {
    const response = await request(app).get('/api/products');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.products)).toBe(true);
    expect(response.body).toHaveProperty('totalProducts');
  });

  it('GET /api/products should return paginated products', async () => {
    // Add some products first
    let db = readDB();
    for (let i = 0; i < 5; i++) {
      db.products.push({ id: `p${i}`, name: `Product ${i}`, description: `Desc ${i}`, price: 10, stock: 5, image: '' });
    }
    fs.writeFileSync(ORIGINAL_DB_PATH, JSON.stringify(db, null, 2));

    const response = await request(app).get('/api/products?page=1&limit=2');
    expect(response.statusCode).toBe(200);
    expect(response.body.products).toHaveLength(2);
    expect(response.body.totalProducts).toBe(5);
    expect(response.body.currentPage).toBe(1);
    expect(response.body.totalPages).toBe(3);
  });

  it('GET /api/products should return filtered products by query', async () => {
    let db = readDB();
    db.products.push({ id: 'p1', name: 'Hookah Alpha', description: 'Best hookah', price: 10, stock: 5, image: '' });
    db.products.push({ id: 'p2', name: 'Coal Beta', description: 'Good coal', price: 5, stock: 10, image: '' });
    fs.writeFileSync(ORIGINAL_DB_PATH, JSON.stringify(db, null, 2));

    const response = await request(app).get('/api/products?q=hookah');
    expect(response.statusCode).toBe(200);
    expect(response.body.products).toHaveLength(1);
    expect(response.body.products[0].name).toBe('Hookah Alpha');
  });

  it('GET /api/products/:id should return a single product', async () => {
    let db = readDB();
    db.products.push({ id: 'p1', name: 'Test Product', description: 'Desc', price: 10, stock: 5, image: '' });
    fs.writeFileSync(ORIGINAL_DB_PATH, JSON.stringify(db, null, 2));

    const response = await request(app).get('/api/products/p1');
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe('Test Product');
  });

  it('GET /api/products/:id should return 404 for non-existent product', async () => {
    const response = await request(app).get('/api/products/nonexistent');
    expect(response.statusCode).toBe(404);
  });

  it('POST /api/products should create a new product with an image', async () => {
    const response = await request(app)
      .post('/api/products')
      .field('name', 'New Product')
      .field('description', 'New Description')
      .field('price', '123.45')
      .field('stock', '20')
      .attach('image', TEST_IMAGE_PATH);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('New Product');
    expect(response.body.image).toMatch(/\/images\/products\/\d+-.+\.png$/);

    uploadedFiles.push(response.body.image); // For cleanup

    const db = readDB();
    expect(db.products).toHaveLength(1);
    expect(db.products[0].name).toBe('New Product');
  });

  it('POST /api/products should return 400 for invalid data', async () => {
    const response = await request(app)
      .post('/api/products')
      .field('name', '') // Invalid name
      .field('description', 'Desc')
      .field('price', '-10') // Invalid price
      .field('stock', '5');

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(2); // name and price errors
  });

  it('PUT /api/products/:id should update a product without changing image', async () => {
    let db = readDB();
    db.products.push({ id: 'p1', name: 'Old Name', description: 'Old Desc', price: 10, stock: 5, image: '/images/products/old.png' });
    fs.writeFileSync(ORIGINAL_DB_PATH, JSON.stringify(db, null, 2));

    const response = await request(app)
      .put('/api/products/p1')
      .field('name', 'Updated Name')
      .field('description', 'Updated Desc')
      .field('price', '20.00')
      .field('stock', '10');

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe('Updated Name');
    expect(response.body.price).toBe(20);
    expect(response.body.image).toBe('/images/products/old.png'); // Image should remain same

    const updatedDb = readDB();
    expect(updatedDb.products[0].name).toBe('Updated Name');
  });

  it('PUT /api/products/:id should update a product with a new image', async () => {
    let db = readDB();
    db.products.push({ id: 'p1', name: 'Old Name', description: 'Old Desc', price: 10, stock: 5, image: '/images/products/old.png' });
    fs.writeFileSync(ORIGINAL_DB_PATH, JSON.stringify(db, null, 2));

    const response = await request(app)
      .put('/api/products/p1')
      .field('name', 'Updated Name')
      .field('description', 'Updated Desc')
      .field('price', '20.00')
      .field('stock', '10')
      .attach('image', TEST_IMAGE_PATH);

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe('Updated Name');
    expect(response.body.image).toMatch(/\/images\/products\/\d+-.+\.png$/);

    uploadedFiles.push(response.body.image); // For cleanup

    const updatedDb = readDB();
    expect(updatedDb.products[0].name).toBe('Updated Name');
    expect(updatedDb.products[0].image).not.toBe('/images/products/old.png');
  });

  it('PUT /api/products/:id should return 400 for invalid data', async () => {
    let db = readDB();
    db.products.push({ id: 'p1', name: 'Old Name', description: 'Old Desc', price: 10, stock: 5, image: '' });
    fs.writeFileSync(ORIGINAL_DB_PATH, JSON.stringify(db, null, 2));

    const response = await request(app)
      .put('/api/products/p1')
      .field('name', '') // Invalid name
      .field('description', 'Desc')
      .field('price', 'abc') // Invalid price
      .field('stock', '5');

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(2); // name and price errors
  });

  it('DELETE /api/products/:id should delete a product', async () => {
    let db = readDB();
    db.products.push({ id: 'p1', name: 'Test Product', description: 'Desc', price: 10, stock: 5, image: '' });
    fs.writeFileSync(ORIGINAL_DB_PATH, JSON.stringify(db, null, 2));

    const response = await request(app).delete('/api/products/p1');
    expect(response.statusCode).toBe(204);

    const updatedDb = readDB();
    expect(updatedDb.products).toHaveLength(0);
  });

  it('DELETE /api/products/:id should return 404 for non-existent product', async () => {
    const response = await request(app).delete('/api/products/nonexistent');
    expect(response.statusCode).toBe(404);
  });

  // --- Order Endpoints ---

  it('POST /api/orders should create a new order and customer', async () => {
    const newOrderPayload = {
      items: [{ product: { node: { title: 'Test Prod' } }, price: { amount: 10 }, quantity: 2 }],
      customer: { name: 'Test Customer', email: 'test@example.com' },
    };

    const response = await request(app)
      .post('/api/orders')
      .send(newOrderPayload);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.customerName).toBe('Test Customer');
    expect(response.body.total).toBe(20);

    const db = readDB();
    expect(db.orders).toHaveLength(1);
    expect(db.customers).toHaveLength(1);
    expect(db.customers[0].name).toBe('Test Customer');
  });

  it('POST /api/orders should update existing customer totalOrders', async () => {
    let db = readDB();
    db.customers.push({ id: 'c1', name: 'Existing Customer', email: 'existing@example.com', totalOrders: 1 });
    fs.writeFileSync(ORIGINAL_DB_PATH, JSON.stringify(db, null, 2));

    const newOrderPayload = {
      items: [{ product: { node: { title: 'Prod' } }, price: { amount: 5 }, quantity: 1 }],
      customer: { name: 'Existing Customer', email: 'existing@example.com' },
    };

    await request(app).post('/api/orders').send(newOrderPayload);

    const updatedDb = readDB();
    expect(updatedDb.customers).toHaveLength(1);
    expect(updatedDb.customers[0].totalOrders).toBe(2);
  });

  it('GET /api/orders should return an array of orders', async () => {
    const response = await request(app).get('/api/orders');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // --- Customer Endpoints ---

  it('GET /api/customers should return an array of customers', async () => {
    const response = await request(app).get('/api/customers');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // --- Dashboard Endpoints ---

  it('GET /api/dashboard should return dashboard statistics', async () => {
    let db = readDB();
    db.products.push({ id: 'p1', name: 'Prod1', description: 'Desc', price: 10, stock: 5, image: '' });
    db.orders.push({ id: 'o1', customerName: 'Cust1', date: new Date().toISOString(), total: 100, items: [] });
    db.customers.push({ id: 'c1', name: 'Cust1', email: 'c1@e.com', totalOrders: 1 });
    fs.writeFileSync(ORIGINAL_DB_PATH, JSON.stringify(db, null, 2));

    const response = await request(app).get('/api/dashboard');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('totalRevenue', 100);
    expect(response.body).toHaveProperty('totalOrders', 1);
    expect(response.body).toHaveProperty('totalCustomers', 1);
    expect(response.body).toHaveProperty('totalProducts', 1);
    expect(Array.isArray(response.body.recentSales)).toBe(true);
  });

  // --- Auth Endpoints ---

  it('POST /api/login should return a token for valid credentials', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ username: 'admin', password: 'password123' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.token).toMatch(/^fake-token-/);
  });

  it('POST /api/login should return 401 for invalid credentials', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ username: 'wrong', password: 'credentials' });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid credentials');
  });
});