import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = process.env.TABLE_NAME || "tasks";

export const handler = async (event) => {
  try {
    if (!event.body) {
      throw new Error("Missing request body");
    }

    const requestJSON = JSON.parse(event.body);
    const { task } = requestJSON;

    if (!task) {
      throw new Error("Missing required field: task");
    }

    const id = randomUUID();
    console.log("Using Table Name:", tableName);
    console.log("Request Item:", { id, task });

    await dynamo.send(
      new PutCommand({
        TableName: tableName,
        Item: { id, task },
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Added task: ${task}`, id }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: error.message.includes("Missing") ? 400 : 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};