import * as AWS from "aws-sdk";
import { TodoUpdate } from "../models/TodoUpdate";
import { Types } from 'aws-sdk/clients/s3';
import { TodoItem } from "../models/TodoItem";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)



// TODO: Implement the dataLayer logic

export class ToDoAccess {
    constructor(
        private readonly s3Client: Types = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly todoTable = process.env.TODOS_TABLE,
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly s3BucketName = process.env.S3_BUCKET_NAME) {
    }

    async getTodoForUser(userId: string): 
    Promise<TodoItem[]> {
        console.log
            ("Fetching all todos");

        const params = {
            TableName: this.todoTable,
            KeyConditionExpression: "#userId = :userId",
            ExpressionAttributeNames: {"#userId": "userId"},
            ExpressionAttributeValues: {":userId": userId}
        };

        const result = 
            await this.docClient.query(params).promise();
        console.log(result);
        const items = result.Items;

        return items as TodoItem[];
    }

    async createTodoForUser(todoItem: TodoItem): 
        Promise<TodoItem> {
        console.log
            ("create a new todo");

        const params = {TableName: this.todoTable, Item: todoItem,};

        const result = 
            await this.docClient.put(params).promise();
        console.log(result);

        return todoItem as TodoItem;
    }

    async updateTodoForUser(
        todoUpdate: TodoUpdate, 
        todoId: string, 
        userId: string
        ): Promise<TodoUpdate> {
        console.log
            ("Update existing todo");

        const params = {
            TableName: this.todoTable,
            Key: {"userId": userId,"todoId": todoId},
            UpdateExpression: "set #a = :a, #b = :b, #c = :c",
            ExpressionAttributeNames: {"#a": "name","#b": "dueDate","#c": "done"},
            ExpressionAttributeValues: {":a": todoUpdate['name'],":b": todoUpdate['dueDate'],":c": todoUpdate['done']},
            ReturnValues: "ALL_NEW"
        };

        const result = 
        await this.docClient.update(params).promise();
        console.log(result);
        const attributes = result.Attributes;

        return attributes as TodoUpdate;
    }

    async deleteTodoForUser(
        todoId: string, 
        userId: string): 
        Promise<string> {
        console.log
            ("delete an existing todo");

        const params = {
            TableName: this.todoTable,
            Key: {"userId": userId,"todoId": todoId},
        };

        const result = 
        await this.docClient.delete(params).promise();
        console.log(result);

        return "" as string;
    }

    async createPresignedUrl(
        todoId: string): 
        Promise<string> {
        console.log
            ("Generating an upload URL");

        const url = this.s3Client.getSignedUrl('putObject', {Bucket: this.s3BucketName,Key: todoId,Expires: 1000,});
        console.log(url);

        return url as string;
    }
}