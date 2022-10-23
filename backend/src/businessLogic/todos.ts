import { TodoUpdate } from "../models/TodoUpdate";
import { ToDoAccess } from "../dataLayer/ToDoAccess";
import { parseUserId } from "../auth/utils";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { TodoItem } from "../models/TodoItem";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";


// TODO: Implement businessLogic
const todoAccess = new ToDoAccess();
const uuidv4 = require('uuid/v4');


export async function getTodoForUser(
    jwtToken: string
    ): Promise<TodoItem[]> {

    const userId = parseUserId(jwtToken);
    return todoAccess.getTodoForUser(userId);
}

export function createTodoForUser(
    createTodoRequest: CreateTodoRequest, 
    jwtToken: string
    ): Promise<TodoItem> {

    const userId = parseUserId(jwtToken);
    const todoId =  uuidv4();
    const s3BucketName = process.env.S3_BUCKET_NAME;
    
    return todoAccess.createTodoForUser({
        userId: userId,
        todoId: todoId,
        
        attachmentUrl:  `https://${s3BucketName}.s3.amazonaws.com/${todoId}`, 
        createdAt: new Date().getTime().toString(),
        done: false,

        ...createTodoRequest,
    });
}

export function updateTodoForUser(
    updateTodoRequest: UpdateTodoRequest, 
    todoId: string, 
    jwtToken: string
    ): Promise<TodoUpdate> {
        
    const userId = parseUserId(jwtToken);
    
    return todoAccess.updateTodoForUser(updateTodoRequest, todoId, userId);
}

export function deleteTodoForUser(
    todoId: string, 
    jwtToken: string): Promise<string> {
    const userId = parseUserId(jwtToken);
    
    return todoAccess.deleteTodoForUser(todoId, userId);
}

export function createPresignedUrl(
    todoId: string): Promise<string> {
    
    return todoAccess.createPresignedUrl(todoId);
}