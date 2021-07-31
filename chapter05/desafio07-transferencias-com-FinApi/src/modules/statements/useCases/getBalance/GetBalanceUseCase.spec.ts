import { ICreateUserDTO } from '@modules/users/useCases/createUser/ICreateUserDTO';

import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '@modules/statements/repositories/in-memory/InMemoryStatementsRepository';

import { CreateUserUseCase } from '@modules/users/useCases/createUser/CreateUserUseCase';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { GetBalanceUseCase } from './GetBalanceUseCase';

import { Statement } from "../../entities/Statement";

import { GetBalanceError } from './GetBalanceError';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

interface IResponse {
  statement: Statement[];
  balance: number;
}

describe("Get GetBalance", () => {
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
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    )
  });

  it("should be able to get the balance", async () => {
    const user: ICreateUserDTO = {
      name: "UserTest",
      email: "user@email.com",
      password: "password",
    };

    const senderUserCreate: ICreateUserDTO ={
      name: "Genevieve Lane",
      email: "res@kesidpif.ao",
      password: "owtxeT"
    }

    let senderUser = await createUserUseCase.execute(senderUserCreate);

    const result  = await createUserUseCase.execute(user);

    let getBalance: IResponse;

    if(result.id) {
      await createStatementUseCase.execute({
        amount: 700,
        description: 'deposit',
        user_id: result.id,
        type: OperationType.DEPOSIT,
      });

      await createStatementUseCase.execute({
        user_id: result.id,
        amount: 100,
        sender_id: senderUser.id,
        description: 'transfer to friend',
        type: OperationType.TRANSFER,

      })

      getBalance = await getBalanceUseCase.execute({user_id: result.id})
    }

    expect(getBalance.balance).toEqual(600);
    expect(getBalance.statement.length).toEqual(2);
  });

  it("should be able to get the balance with user not found", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({user_id: '123'})
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
})
