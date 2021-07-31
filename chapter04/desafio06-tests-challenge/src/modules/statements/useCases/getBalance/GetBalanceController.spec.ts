import request from "supertest";
import { Connection } from "typeorm";

import { app } from '../../../../app';

import createDbConnection from '../../../../database';

let connection: Connection;

describe("Get Balance Controller", () => {
  beforeAll(async () => {
    connection = await createDbConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get balance", async () => {
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

    await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 100,
        description: 'withdraw',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.statement.length).toEqual(2);
    expect(response.body.balance).toEqual(200);
  });
});
