import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO";

import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";

import { CreateUserUseCase } from "../createUser/CreateUserUseCase";

import { CreateUserError } from "./CreateUserError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create an user", async () => {
    const user: ICreateUserDTO = {
      name: "UserTest",
      email: "user@email.com",
      password: "password",
    };
    const result  = await createUserUseCase.execute(user);

    expect(result).toHaveProperty("id");
  });

  it("should not be able to create an user equal", () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: "user@email.com",
        password: "password",
        name: "User Test Error",
      };

      await createUserUseCase.execute(user);

      await createUserUseCase.execute(user);

    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
