const request = require("supertest");
const app = require("../app");
const path = require("path");
const Image = require("../models/Image");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

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

    test("DELETE /images/:id", async () => {
        if (!id) {
            console.error("ID de imagen no válido.");
            return;
        }

        const res = await request(app)
            .delete(`/images/${id}`)
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(204);
        const deletedImage = await Image.findByPk(id);
        expect(deletedImage).toBeNull();
    });

    afterAll(async () => {
        if (id) {
            await deleteFromCloudinary(id);
        }
    });

