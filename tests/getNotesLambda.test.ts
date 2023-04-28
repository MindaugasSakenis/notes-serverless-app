import { handler, Field } from "../lambdas/getNotes";
import { getItem, getAllItems } from "../lambdas/dynamo-helpers";

jest.mock("../lambdas/dynamo-helpers", () => ({
  getItem: jest.fn(),
  getAllItems: jest.fn(),
}));

describe("handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when the field is GET_NOTE", () => {
    it("should return a note when the note id is valid", async () => {
      const event = {
        field: Field.GET_NOTE,
        arguments: {
          note_id: "1",
        },
      };
      const data = { Item: { id: "1", title: "test note" } };
      (getItem as jest.Mock).mockResolvedValueOnce(data);

      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(data.Item);
    });

    it("should return a 500 error when there is an error fetching the note", async () => {
      const event = {
        field: Field.GET_NOTE,
        arguments: {
          note_id: "1",
        },
      };
      const error = new Error("error");
      (getItem as jest.Mock).mockRejectedValueOnce(error);

      const result = await handler(event);

      expect(result.statusCode).toBe(500);
      expect(result.body).toBe(error);
    });

    it("should throw an error if no note_id is provided", async () => {
      const event = {
        field: Field.GET_NOTE,
      };

      await expect(handler(event)).rejects.toThrowError(
        "Missing value 'note_id' in arguments"
      );
    });
    it("should return a 404 status when note not found", async () => {
      const event = {
        field: Field.GET_NOTE,
        arguments: {
          note_id: "notfound",
        },
      };
      (getItem as jest.Mock).mockResolvedValueOnce(null);
      const result = await handler(event);

      expect(result.statusCode).toBe(404);
      expect(result.body).toBe("Note by id: notfound not found");
    });
  });

  describe("when the field is GET_ALL_NOTES", () => {
    it("should return all notes when they exist", async () => {
      const event = {
        field: Field.GET_ALL_NOTES,
      };
      const data = {
        Items: [
          { id: "1", title: "test note 1" },
          { id: "2", title: "test note 2" },
        ],
      };
      (getAllItems as jest.Mock).mockResolvedValueOnce(data);

      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(data.Items);
    });

    it("should return a empty array when there are no notes", async () => {
      const event = {
        field: Field.GET_ALL_NOTES,
      };
      const data = { Items: [] };
      (getAllItems as jest.Mock).mockResolvedValueOnce(data);

      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      expect(result.body).toStrictEqual([]);
    });

    it("should return a 500 error when there is an error fetching all notes", async () => {
      const event = {
        field: Field.GET_ALL_NOTES,
      };
      const error = new Error("error");
      (getAllItems as jest.Mock).mockRejectedValueOnce(error);

      const result = await handler(event);

      expect(result.statusCode).toBe(500);
      expect(result.body).toBe(error);
    });
  });

  it("should throw an error if no field value is received", async () => {
    const event = {};
    await expect(handler(event as any)).rejects.toThrowError(
      "Missing value 'field'"
    );
  });

  it("should throw error if invalid field value received", async () => {
    const event = {
      field: "invalid-field-value",
    };

    await expect(handler(event as any)).rejects.toThrowError(
      "Invalid field value received"
    );
  });
});
