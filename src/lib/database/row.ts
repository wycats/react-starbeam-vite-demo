import { reactive } from "@starbeam/core";
import {
  AnyDict,
  AnyIndex,
  InferArgument,
  InferReturn,
  Metaprogramming,
} from "@starbeam/fundamental";
import { entries, keys } from "./table.js";

type AtomicValue = unknown;

export type Columns = Record<string, AtomicValue>;

export type DraftRecord<C extends Columns> = {
  -readonly [P in keyof C]?: C[P];
};

export type DraftRecordFor<R extends Row> = R extends Row<infer C>
  ? {
      -readonly [P in keyof C]?: C[P];
    }
  : never;

export class DraftForNew<R extends Row, Id extends string | null> {
  static of<Class extends RowClass, Id extends string | null>(
    Row: Class,
    id: Id
  ): Class extends abstract new (...args: any[]) => infer R
    ? R extends Row
      ? DraftForNew<R, Id>
      : never
    : never {
    return new DraftForNew(Row, id ?? null, reactive({})) as InferReturn;
  }

  readonly #Class: RowClass<R>;
  readonly #id: Id;
  readonly #columns: AnyDict;

  private constructor(Class: RowClass<R>, id: Id, columns: AnyDict) {
    this.#Class = Class;
    this.#id = id;
    this.#columns = columns;
  }

  get id(): string | null {
    return this.#columns["id"] ?? null;
  }

  get columns(): Readonly<DraftRecordFor<R>> {
    return this.#columns as InferReturn;
  }

  get mutate(): DraftRecordFor<R> {
    return this.#columns as InferReturn;
  }

  create(this: DraftForNew<R, string>): R;
  create(id: string): R;
  create(id?: any): R {
    // TODO: Find a way to check this, at least in debug mode
    return this.#Class.from(this.#id ?? id, this.#columns as InferArgument);
  }
}

export class DraftForUpdate<R extends Row> {
  static of<R extends Row>(row: R): DraftForUpdate<R> {
    let snapshot = { ...row.columns };
    return new DraftForUpdate(
      row,
      reactive(snapshot),
      reactive(snapshot)
    ) as InferReturn;
  }

  readonly #row: R;
  readonly #columns: AnyDict;
  readonly #original: AnyDict;

  private constructor(row: R, columns: AnyDict, original: AnyDict) {
    this.#row = row;
    this.#columns = columns;
    this.#original = original;
  }

  get isClean() {
    return !this.isDirty;
  }

  get isDirty() {
    return [...entries(this.#original)].some(
      ([key, original]) => this.#columns[key] !== original
    );
  }

  get columns(): Readonly<DraftRecordFor<R>> {
    return this.#columns as InferReturn;
  }

  get mutate(): DraftRecordFor<R> {
    return this.#columns as InferReturn;
  }

  get id(): string {
    return this.#row.id;
  }

  set<K extends keyof ColumnsFor<R>>(key: K, newValue: ColumnsFor<R>[K]): void {
    // @ts-expect-error
    if (this.columns[key] !== newValue) {
      // @ts-expect-error
      this.mutate[key] = newValue;
    }
  }

  commit() {
    let mutate = this.#row.mutate;
    let columns = this.#columns;
    let original = this.#original;

    for (let key of keys(columns)) {
      if (key === "id") {
        continue;
      }

      original[key] = mutate[key] = columns[key];
    }
  }
}

const ID_SYMBOL = Symbol("ID");

export abstract class Row<C extends Columns = Columns> {
  static from<
    C extends Columns,
    This extends new (id: string, columns: C) => any
  >(this: This, id: string, columns: C): InstanceType<This> {
    return new this(id, reactive(columns)) as InferReturn;
  }

  static create<
    C extends Columns,
    This extends new (id: string, columns: C) => R,
    R extends Row
  >(this: This): DraftForNew<R, string>;
  static create<
    C extends Columns,
    This extends new (id: string, columns: C) => R,
    R extends Row
  >(this: This, id?: string): DraftForNew<R, null>;
  static create(id?: string): InferReturn {
    return DraftForNew.of(this, id ?? null);
  }

  readonly #id: string;
  readonly #columns: C;

  constructor(id: string, columns: C) {
    this.#id = id;
    this.#columns = columns;

    Object.defineProperty(this, "[ID]", {
      enumerable: true,
      configurable: true,
      value: this.#id,
    });

    for (let key of Reflect.ownKeys(columns)) {
      if (key === "id") {
        continue;
      }

      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get(this: Row<C>): Metaprogramming {
          return this.columns[key as AnyIndex];
        },
      });
    }
  }

  readonly name = this.constructor.name;

  get mutate(): C {
    return this.#columns;
  }

  get columns(): Readonly<C> {
    return this.#columns;
  }

  get id(): string {
    return this.#id;
  }

  get draft(): DraftForUpdate<this> {
    return DraftForUpdate.of(this);
  }

  toString() {
    return `${this.name} { id: ${this.#id} }`;
  }
}

export class AnonymousRow<C extends Columns = Columns> extends Row<C> {}

export type RowClass<Instance extends Row = Row> = {
  from(id: string, columns: ColumnsFor<Instance>): Instance;
};

export type RowInstance<R extends RowClass> = R extends RowClass<infer Instance>
  ? Instance
  : never;

export type ColumnsFor<R extends Row<any>> = R extends Row<infer Columns>
  ? Columns
  : never;
