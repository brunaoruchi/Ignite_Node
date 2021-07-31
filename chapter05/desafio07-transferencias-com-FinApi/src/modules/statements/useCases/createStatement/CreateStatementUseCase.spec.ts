
import { ICreateUserDTO } from '@modules/users/useCases/createUser/ICreateUserDTO';
import { ICreateStatementDTO } from './ICreateStatementDTO';

import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '@modules/statements/repositories/in-memory/InMemoryStatementsRepository';

import { CreateUserUseCase } from '@modules/users/useCases/createUser/CreateUserUseCase';
import { CreateStatementUseCase } from './CreateStatementUseCase';

import { CreateStatementError } from './CreateStatementError';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository
    );
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create an statement type deposit", async () => {
    const user: ICreateUserDTO = {
      name: "UserTest",
      email: "user@email.com",
      password: "password",
    };

    const result  = await createUserUseCase.execute(user);

    let statement: ICreateStatementDTO;

    if(result.id) {
      statement = await createStatementUseCase.execute({
        amount: 300,
        description: 'deposit',
        user_id: result.id,
        type: OperationType.DEPOSIT,
      })
    }

    expect(statement).toHaveProperty("id");
    expect(statement.type).toEqual("deposit");
  });

  it("should be able to create an statement type withdraw", async () => {
    const user: ICreateUserDTO = {
      name: "UserTest",
      email: "user@email.com",
      password: "password",
    };

    const result  = await createUserUseCase.execute(user);

    let statement: ICreateStatementDTO;

    if(result.id) {
      await createStatementUseCase.execute({
        amount: 300,
        description: 'deposit',
        user_id: result.id,
        type: OperationType.DEPOSIT,
      })

      statement = await createStatementUseCase.execute({
        amount: 100,
        description: 'withdraw',
        user_id: result.id,
        type: OperationType.WITHDRAW,
      })
    }

    expect(statement).toHaveProperty("id");
    expect(statement.type).toEqual("withdraw");
  });

  it("should be not able to create an statement with user not found", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        amount: 300,
        description: 'deposit',
        user_id: '123',
        type: OperationType.DEPOSIT,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should be not able to create an statement with insufficient founds", async () => {
    const user: ICreateUserDTO = {
      name: "UserTest",
      email: "user@email.com",
      password: "password",
    };

    const result  = await createUserUseCase.execute(user);

    expect(async () => {
      if(result.id){
        await createStatementUseCase.execute({
          amount: 300,
          description: 'withdraw',
          user_id: result.id,
          type: OperationType.WITHDRAW,
        });
      }
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
})
