const request = require('supertest');
const app = require('../src/index');

describe('Products API', () => {
  describe('GET /api/products', () => {
    it('should return all products', async () => {
      const res = await request(app).get('/api/products');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter by category', async () => {
      const res = await request(app).get('/api/products?category=Accessories');
      expect(res.statusCode).toBe(200);
      res.body.data.forEach(p => {
        expect(p.category).toBe('Accessories');
      });
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({ name: 'Test Product', price: 9.99, category: 'Test', stock: 10 });
      expect(res.statusCode).toBe(201);
      expect(res.body.data.name).toBe('Test Product');
    });

    it('should return 400 for invalid price', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({ name: 'Bad Price', price: -5, category: 'Test' });
      expect(res.statusCode).toBe(400);
    });
  });
});
