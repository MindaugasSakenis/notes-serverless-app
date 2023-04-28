import * as AWS from "aws-sdk";

const ddb = new AWS.DynamoDB.DocumentClient();

export const getItem = async ({ note_id }) => {
  const params = {
    TableName: "NotesTable",
    Key: {
      note_id,
    },
  };

  return ddb.get(params).promise();
};

export const getAllItems = async () => {
  const params = {
    TableName: "NotesTable",
  };

  return ddb.scan(params).promise();
};
