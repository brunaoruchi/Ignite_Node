import request from "supertest";
import { Connection } from "typeorm";

import { app } from '../../../../app';

import createDbConnection from '../../../../database';

let connection: Connection;

describe("Show User Profile Controller", () => {
  beforeAll(async () => {
    connection = await createDbConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show user profile", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "User Supertest",
        email: "admin@finapi.com.br",
        password: "admin"
      });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "admin@finapi.com.br",
      password: "admin",
    });

    const { token, user } = responseToken.body;

    const response = await request(app)
      .get("/api/v1/profile")
      .send({
        id: user.id
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id')
  });
});
