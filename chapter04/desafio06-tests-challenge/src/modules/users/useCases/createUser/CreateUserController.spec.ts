
import request from 'supertest';
import { app } from '../../../../app';

import createDbConnection from '../../../../database';
import { Connection } from 'typeorm';

let connection: Connection;

describe("Create User Controller", () => {

  beforeAll(async () => {
    connection = await createDbConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("should be able to create an user", async () => {
    const response = await request(app)
      .post("/api/v1/users")
      .send({
        name: "User Supertest",
        email: "user@email.com",
        password: "123"
      });

    expect(response.status).toBe(201);
  })
})
