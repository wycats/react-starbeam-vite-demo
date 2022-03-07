import { Database } from "../lib/database/db.js";
import { User } from "./user.js";

export const DB = Database.empty().define({
  name: "users",
  Row: User,
  id: "id",
});

export const tables = DB.tables;
