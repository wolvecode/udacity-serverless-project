import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

import 'source-map-support/register'
import { deleteTodoForUser } from '../../businessLogic/todos'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // TODO: Remove a TODO item by id

  console.log('Event is been processing', event)
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const todoId = event.pathParameters.todoId

  const deleteData = await deleteTodoForUser(todoId, jwtToken)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: deleteData
  }
}
