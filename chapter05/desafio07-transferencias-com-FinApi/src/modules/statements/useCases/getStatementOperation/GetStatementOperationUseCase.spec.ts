import { ICreateUserDTO } from '@modules/users/useCases/createUser/ICreateUserDTO';

import { InMemoryStatementsRepository } from '@modules/statements/repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';

import { CreateUserUseCase } from '@modules/users/useCases/createUser/CreateUserUseCase';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';

import { GetStatementOperationError } from './GetStatementOperationError';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Statement Operation", () => {
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
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to get the statement operation", async () => {
    const user: ICreateUserDTO = {
      name: "UserTest",
      email: "user@email.com",
      password: "password",
    };

    const result  = await createUserUseCase.execute(user);

    let getStatementOperation;
    let statement;

    if(result.id) {
      statement = await createStatementUseCase.execute({
        amount: 300,
        description: 'deposit',
        user_id: result.id,
        type: OperationType.DEPOSIT,
      });

      if(statement.id){
        getStatementOperation = await getStatementOperationUseCase.execute({
          user_id: result.id,
          statement_id: statement.id,
        })
      }
    }

    expect(getStatementOperation.user_id).toEqual(result.id);
    expect(getStatementOperation.id).toEqual(statement.id);
  });

  it("should be able to get the balance with user not found", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "123",
        statement_id: '456'})
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should be able to get the balance with statement not found", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "UserTest",
        email: "user@email.com",
        password: "password",
      };

      const result  = await createUserUseCase.execute(user);

      if(result.id) {
        await getStatementOperationUseCase.execute({
          user_id: result.id,
          statement_id: "123",
        })
      }
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
})
