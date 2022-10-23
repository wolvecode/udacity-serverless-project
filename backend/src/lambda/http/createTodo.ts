import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import 'source-map-support/register'
import { createTodoForUser } from '../../businessLogic/todos'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // TODO: Implement creating a new TODO item

  console.log('Event is been processing', event)

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  const toDoItem = await createTodoForUser(newTodo, jwtToken)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: toDoItem
    })
  }
}
