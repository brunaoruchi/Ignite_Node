import request from "supertest";
import { Connection } from "typeorm";

import { app } from '../../../../app';

import createDbConnection from '../../../../database';

let connection: Connection;

describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createDbConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate user", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "User Supertest",
        email: "admin@finapi.com.br",
        password: "admin"
      });

    const response = await request(app)
      .post("/api/v1/sessions").send({
        email: "admin@finapi.com.br",
        password: "admin",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('id');
  });
});
