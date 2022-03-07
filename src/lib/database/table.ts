import { is, reactive } from "@starbeam/core";
import { InferArgument, InferReturn } from "@starbeam/fundamental";
import { verify } from "@starbeam/verify";
import { ColumnsFor, Row } from "./row.js";

interface RowClass<R extends Row> {
  new (...args: any[]): R;
  from(id: string, columns: any): R;
}

export interface TableDescription<
  R extends Row = Row,
  Id extends string = string,
  Cols extends { readonly [P in Id]: any } = { readonly [P in Id]: any }
> {
  readonly name: string;
  readonly Row: { new (...args: any[]): R; from(id: string, columns: Cols): R };
  readonly id: Id;
}

export type TableFor<T extends TableDescription<any>> = Table<TableRow<T>>;

export type TableName<T extends TableDescription<any>> = T extends {
  readonly name: infer N;
}
  ? N
  : never;

export type TableRow<T extends TableDescription<any>> = T extends {
  readonly Row: { new (...args: any[]): infer I };
}
  ? I
  : never;

export class Table<R extends Row> {
  static create<T extends TableDescription>(
    description: T
  ): T extends { Row: abstract new (...args: any[]) => infer R }
    ? R extends Row
      ? Table<R>
      : never
    : never {
    return new Table(
      reactive(Map) as InferArgument,
      description
    ) as InferReturn;
  }

  readonly #values: Map<string, R>;
  readonly #description: TableDescription<R>;

  private constructor(
    values: Map<string, R>,
    description: TableDescription<R>
  ) {
    this.#values = values;
    this.#description = description;
  }

  get name(): string {
    return this.#description.name;
  }

  insert(record: ColumnsFor<R> & { readonly id: string }): R;
  insert(id: string, record: ColumnsFor<R>): R;
  insert(...args: InsertArgs<R>): R {
    let { Row: RowClass } = this.#description;
    let { record, id } = normalizeInsert(args);

    let row = RowClass.from(id, record) as R;
    this.#values.set(id, row);
    return row;
  }

  update(id: string, updates: Partial<ColumnsFor<R>>): void {
    const record = this.#values.get(id) as Mutable<R>;

    verify(record, is.Present);

    for (let [key, value] of entries(updates)) {
      // @ts-expect-error
      record[key] = value as R[keyof R];
    }
  }

  get all(): IterableIterator<R> {
    return this.#values.values();
  }
}

type InsertArgs<R extends Row> =
  | [record: ColumnsFor<R> & { readonly id: string }]
  | [id: string, record: ColumnsFor<R>];

function normalizeInsert<R extends Row>(
  args: InsertArgs<R>
): { record: ColumnsFor<R>; id: string } {
  if (args.length === 1) {
    let [record] = args;
    return { record, id: record.id };
  } else {
    let [id, record] = args;
    return { record, id };
  }
}

type Mutable<R extends object> = {
  -readonly [P in keyof R]: R[P];
};

type Entry<T extends object, K extends keyof T = keyof T> = [K, T[K & keyof T]];

export function entries<T extends object>(object: T): Iterable<Entry<T>> {
  return Object.entries(object) as Iterable<Entry<T>>;
}

export function keys<T extends object>(object: T): Iterable<keyof T> {
  return Object.keys(object) as Iterable<keyof T>;
}
