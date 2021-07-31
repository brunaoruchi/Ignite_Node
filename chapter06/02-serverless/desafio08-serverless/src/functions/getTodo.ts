import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from '../utils/dynamodbClient';

export const handle: APIGatewayProxyHandler = async (event) => {

  const { user_id } = event.pathParameters;
  
  const response = await document.scan({
    TableName: "usersTodos",
  }).promise();
  
  const userTodos = response.Items.filter(element => element.user_id === user_id);

  if(userTodos) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        userTodos
      })
    }
  }

  return { 
    statusCode: 400,
    body: JSON.stringify({
      message: "Todos not found!",
    })
  }
}