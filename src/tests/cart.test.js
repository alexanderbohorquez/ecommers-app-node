const request = require('supertest');
const app = require('../app');
require('../models');

let token;
let id;

beforeAll(async () => {
    const body = {
        email: "test@gmail.com",
        password: "alexander96*",
    };
    const res = await request(app).post("/users/login").send(body);
    token = res.body.token;
});

test("GET /carts", async () => {
    const res = await request(app).get('/carts').set('Authorization', `Bearer ${token}`);
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
});

test('POST /carts', async () => {
    const body = { quantity: 5 };
    const res = await request(app)
      .post('/carts')
      .send(body)
      .set('Authorization', `Bearer ${token}`);
    id = res.body.id;
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.quantity).toBe(body.quantity);
});

test('GET /carts/:id', async () => {
    const res = await request(app)
        .get(`/carts/${id}`)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.id).toBe(id);
});

test('PUT /carts/:id', async () => {
    const updatedQuantity = 10;
    const res = await request(app)
        .put(`/carts/${id}`)
        .send({ quantity: updatedQuantity })
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.id).toBe(id);
    expect(res.body.quantity).toBe(updatedQuantity);
});

test('DELETE /carts/:id', async () => {
    const res = await request(app)
        .delete(`/carts/${id}`)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
});
