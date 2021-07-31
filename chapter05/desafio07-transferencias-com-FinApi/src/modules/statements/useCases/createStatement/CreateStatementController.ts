import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateStatementUseCase } from './CreateStatementUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { amount, description } = request.body;

    const splittedPath = request.originalUrl.split('/')

    let type;

    if(splittedPath[splittedPath.length - 1] === 'deposit' ||
       splittedPath[splittedPath.length - 1] === 'withdraw'){
      type = splittedPath[splittedPath.length - 1] as OperationType;
    } else{
      type = OperationType.TRANSFER;
    }

    const createStatement = container.resolve(CreateStatementUseCase);

    let sender_id;

    if(request.params) {
      sender_id = request.params.id;
    }

    let statement;

    if(sender_id){
      statement = await createStatement.execute({
        user_id,
        sender_id,
        type,
        amount,
        description
      });
    } else {
      statement = await createStatement.execute({
        user_id,
        type,
        amount,
        description
      });
    }
    return response.status(201).json(statement);
  }
}
