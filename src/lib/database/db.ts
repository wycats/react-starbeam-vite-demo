import { reactive } from "@starbeam/core";
import { InferReturn } from "@starbeam/fundamental";
import { Row } from "./row.js";
import { Table, TableDescription } from "./table.js";

type Tables = {
  [P in keyof any]: Table<Row>;
};

export class Database<T extends Tables> {
  static empty(): Database<{}> {
    return new Database(reactive({}));
  }

  readonly #tables: T;

  private constructor(tables: T) {
    this.#tables = tables;
  }

  table<K extends keyof T>(name: K): T[K] {
    return this.#tables[name];
  }

  get tables(): { readonly [P in keyof T]: T[P] } {
    return this.#tables;
  }

  define<K extends Exclude<string, keyof T>, D extends TableDescription>(
    description: D & { name: K }
  ): Database<
    T & {
      [P in K]: D extends {
        Row: abstract new (...args: any[]) => infer R;
      }
        ? R extends Row
          ? Table<R>
          : never
        : never;
    }
  > {
    this.#add(description);
    return this as InferReturn;
  }

  #add<R extends Row>(description: TableDescription<R>): void {
    (this.#tables as Tables)[description.name] = Table.create(description);
  }
}
