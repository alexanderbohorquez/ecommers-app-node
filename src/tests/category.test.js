const request = require('supertest');
const app = require('../app')

let id;
let token;

beforeAll(async() => {
    const body = {
        email: "test@gmail.com",
        password: "alexander96*"
    }
    const res = await request(app).post('/users/login').send(body)
    token = res.body.token;
})


test("GET / categories", async () => {
    const res = await request(app).get('/categories');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
})

test("post / categories", async () => {
    const categories = {name: "phone"}
    const res = await request(app)
    .post('/categories')
    .send(categories)
    .set('Authorization', `Bearer ${token}`);
    id = res.body.id
    expect(res.status).toBe(201);
    expect(res.body.name).toBe(categories.name)
    expect(res.body.id).toBeDefined();
})

test('PUT /users/:id', async () => {
    const body = {
        name: 'Alex updated'
    }
    const res = await request(app).put(`/categories/${id}`)
        .send(body)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe(body.firstName);
});

test('DELETE /categories', async () => {
    const res = await request(app)
        .delete(`/categories/${id}`)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
});