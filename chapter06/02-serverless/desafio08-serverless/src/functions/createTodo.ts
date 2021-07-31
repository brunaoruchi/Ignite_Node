import { v4 } from 'uuid';
import { APIGatewayProxyHandler } from "aws-lambda";
import {document} from "../utils/dynamodbClient";

interface ICreateTodo {
  title: string;
  deadline: string;
}

export const handle: APIGatewayProxyHandler  = async (event) => {
  const { title, deadline } = JSON.parse(event.body) as ICreateTodo;
  const { user_id } = event.pathParameters;
  
  await document.put({ 
    TableName: "usersTodos",
    Item: {
      id: v4(),
      user_id,
      title,
      done: false,
      deadline
    }
  }).promise();
  
  return { 
    statusCode: 200,
    body: JSON.stringify({
      message: "Todo created!",
    }),
    headers: {
      "Content-type": "application/json",
    }
  }
}