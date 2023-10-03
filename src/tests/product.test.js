const request = require("supertest");
const app = require("../app");
const Category = require("../models/Category");
const Image = require("../models/Image");
require("../models");

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

test("GET / products", async () => {
  const res = await request(app).get("/products");
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
});

test("post / products", async () => {
  try {
    const category = await Category.create({ name: "phone" });
    const body = {
      title: "test headline",
      description: "test lead",
      brand: "test author",
      price: 1,
      categoryId: category.id,
    };
    const res = await request(app)
      .post("/products")
      .send(body)
      .set("Authorization", `Bearer ${token}`);
    id = res.body.id;
    console.log(res.body);
    await category.destroy();
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.description).toBe(body.description);
  } catch (error) {
    console.log(error);
  }
});

test("GET /products/:id", async () => {
  const res = await request(app).get(`/products/${id}`);
  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.id).toBe(id);
});

test("PUT /products/:id (not found)", async () => {
  const body = {
    title: "Updated Test Headline",
    description: "Updated Test Description",
    brand: "Updated Test Brand",
    price: 10,
    categoryId: 1, 
  };

  const res = await request(app)
    .put(`/products/9999999`) 
    .send(body)
    .set("Authorization", `Bearer ${token}`);

  expect(res.status).toBe(404);
});


test("post /products/:id/images", async () => {
  const image = await Image.create({
    url: "https://picsum.photos/200/300",
    publicId: "id",
  });
  const res = await request(app)
    .post(`/products/${id}/images`)
    .send([image.id])
    .set("Authorization", `Bearer ${token}`);
  await image.destroy();
  expect(res.status).toBe(200);
  expect(res.body.length).toBe(1);
});

test("DELETE /products", async () => {
  const res = await request(app)
    .delete(`/products/${id}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
