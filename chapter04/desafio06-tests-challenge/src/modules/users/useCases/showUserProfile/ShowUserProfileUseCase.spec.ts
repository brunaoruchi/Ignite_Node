import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO";

import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";

import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

import { ShowUserProfileError } from "./ShowUserProfileError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("ShowUserProfile User", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository,
    );
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to show profile user", async () => {
    const user:ICreateUserDTO = {
      name: "UserTest",
      email: "user@email.com",
      password: "password",
    };
    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    if(result.token){
      await showUserProfileUseCase.execute(result.user.id)
    }

    expect(result.user).toHaveProperty("id");
  });

  it("should not be able to show profile user invalid", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute(
        'user_id'
      )
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
