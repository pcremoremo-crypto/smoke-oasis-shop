import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Since we are in an ES module, __dirname is not available. We can create it.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// We need to dynamically import the app since it's a CommonJS module
const app = await import('./server.cjs');

const ORIGINAL_DB_PATH = path.join(__dirname, 'db.json');
const TEST_IMAGE_DIR = path.join(__dirname, 'public/images/products');
const TEST_IMAGE_PATH = path.join(__dirname, 'test-image.png');

describe('API Endpoints', () => {
  let originalDbContent = null;
  const uploadedFiles = [];

  beforeAll(() => {
    // Create a dummy image for testing uploads
    fs.writeFileSync(TEST_IMAGE_PATH, 'dummy content');

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
      if (fs.existsSync(path.join(__dirname, 'public', file))) {
        fs.unlinkSync(path.join(__dirname, 'public', file));
      }
    });
  });

  beforeEach(() => {
    // Reset database before each test
    const initialData = { products: [], orders: [], customers: [] };
    fs.writeFileSync(ORIGINAL_DB_PATH, JSON.stringify(initialData, null, 2));
  });

  it('GET /api/products should return an array of products', async () => {
    const response = await request(app.default).get('/api/products');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('POST /api/products should create a new product with an image', async () => {
    const response = await request(app.default)
      .post('/api/products')
      .field('name', 'Test Hookah')
      .field('price', '99.99')
      .field('stock', '10')
      .attach('image', TEST_IMAGE_PATH);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Test Hookah');
    expect(response.body).toHaveProperty('image');
    expect(response.body.image).toMatch(/\/images\/products\//);

    // Add file to cleanup queue
    uploadedFiles.push(response.body.image);

    // Verify file was created
    const imagePath = path.join(__dirname, 'public', response.body.image);
    expect(fs.existsSync(imagePath)).toBe(true);
  });

  it('POST /api/orders should create a new order', async () => {
    const newOrderPayload = {
      items: [{ product: { node: { title: 'Test Prod' } }, price: { amount: 10 }, quantity: 2 }],
      customer: { name: 'Test Customer', email: 'test@example.com' },
    };

    const response = await request(app.default)
      .post('/api/orders')
      .send(newOrderPayload);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.customerName).toBe('Test Customer');
    expect(response.body.total).toBe(20);

    const db = JSON.parse(fs.readFileSync(ORIGINAL_DB_PATH, 'utf-8'));
    expect(db.customers).toHaveLength(1);
    expect(db.customers[0].name).toBe('Test Customer');
  });
});
