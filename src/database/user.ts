import { Row } from "../lib/database/row.js";

export class User extends Row<{ name: string; country: string }> {
  display(): string {
    return `${this.columns.name} (${this.columns.country})`;
  }
}
