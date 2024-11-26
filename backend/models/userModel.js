import { bookshelfInstance } from "../config/dbConfig.js";

const createBookshelfModel = (tableName) => {
  return bookshelfInstance.Model.extend({
    tableName: tableName,

  });
};

export { createBookshelfModel };
