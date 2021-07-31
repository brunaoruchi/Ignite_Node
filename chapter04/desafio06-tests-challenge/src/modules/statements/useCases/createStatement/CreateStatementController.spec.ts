import request from "supertest";
import { Connection } from "typeorm";

import { app } from '../../../../app';

import createDbConnection from '../../../../database';

let connection: Connection;

describe("Create Statement Controller", () => {
  beforeAll(async () => {
    connection = await createDbConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create statement deposit", async () => {
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

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 300,
        description: 'deposit',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it("should be able to create statement withdraw", async () => {
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

    const { token } = responseToken.body;

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 300,
        description: 'deposit',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 100,
        description: 'withdraw',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });
});
