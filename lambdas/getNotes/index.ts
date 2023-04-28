import { getItem, getAllItems } from "../dynamo-helpers";

export enum Field {
  GET_NOTE = "getNote",
  GET_ALL_NOTES = "getAllNotes",
}

interface Note {
  note_id: string;
}

export const handler = async (event: {
  field: Field;
  arguments?: { note_id: string };
}) => {
  const { field, arguments: args } = event;
  if (!field) throw Error("Missing value 'field'");

  switch (field) {
    case Field.GET_NOTE:
      if (!args?.note_id) throw Error("Missing value 'note_id' in arguments");

      try {
        const data = await getItem({ note_id: args.note_id });

        if (!data?.Item) {
          return {
            statusCode: 404,
            body: `Note by id: ${args.note_id} not found`,
          };
        }

        return {
          statusCode: 200,
          body: data.Item,
        };
      } catch (err) {
        console.log("Error getting Note", err);
        return {
          statusCode: 500,
          body: err,
        };
      }
    case Field.GET_ALL_NOTES:
      try {
        const data = await getAllItems();

        return {
          statusCode: 200,
          body: data.Items,
        };
      } catch (err) {
        console.log("Error getting all Notes:", err);
        return {
          statusCode: 500,
          body: err,
        };
      }
    default:
      throw Error("Invalid field value received");
  }
};
