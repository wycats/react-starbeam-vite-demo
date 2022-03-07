import { Hook } from "@starbeam/core";
import { InferReturn } from "@starbeam/fundamental";
import { Component } from "@starbeam/react";
import { Cell, Memo, Reactive } from "@starbeam/reactive";
import { FormEvent } from "react";
import Slider from "./slider";

export default Component((_, component) => {
  const count = Cell(0);

  const ticker = component.use((parent) => {
    const count = Cell(0);

    const timeout = setInterval(() => {
      count.update((prev) => prev + 1);
    }, 1000);

    parent.on.finalize(() => clearInterval(timeout));

    return count;
  });

  function increment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // console.log("updating count to", count.current + 1);
    count.update((prev) => prev + 1);
  }

  function reset(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    count.set(0);
  }

  return () => {
    return (
      <>
        <form onSubmit={increment} onReset={reset}>
          <Display count={count.current} />
          <button type="submit">++</button>
          <button type="reset">[reset]</button>
        </form>
      </>
    );
  };
}, "StarbeamCounter");

function logged<T, Args extends unknown[]>(
  callback: (...args: Args) => T,
  message: string | (() => string)
): (...args: Args) => T {
  const lazyMessage = typeof message === "string" ? () => message : message;

  return (...args) => {
    // console.log(`running ${lazyMessage()}`);
    return callback(...args);
  };
}

export const Equation = Component((_, component) => {
  const count = Cell(0);

  const timeout = setInterval(() => {
    count.update((prev) => prev + 1);
  }, 1000);

  component.on.finalize(() => clearInterval(timeout));

  const counter = component.use((parent) => {
    const count = Cell(0);

    const timeout = setInterval(() => {
      count.update((prev) => prev + 1);
    }, 1000);

    parent.on.finalize(() => clearInterval(timeout));

    return count;
  });

  const extra = Cell(0);
  const slider = Slider(0);

  const totalTick = Memo(() => counter.current + extra.current);

  function ticks() {
    return math(
      ["Tick", counter.current],
      "+",
      ["Extra", extra.current],
      totalTick.current
    );
  }

  function total() {
    return math(
      ["Slider", slider.value],
      "x",
      ["Tick", totalTick.current],
      slider.value * totalTick.current
    );
  }

  return () => (
    <>
      <h2>Slider</h2>
      {slider.element}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          extra.update((prev) => prev + 1);
        }}
        onReset={(e) => {
          extra.current = 0;
          slider.update(0);
        }}
      >
        <button type="submit">++</button>
        <button type="reset">[reset]</button>
      </form>

      <pre>{ticks()}</pre>
      <pre>{total()}</pre>
    </>
  );
});

function math(
  left: [name: string, value: number],
  operator: string,
  right: [name: string, value: number],
  equals: number
) {
  let [leftLabel, rightLabel] = alignStart(`  ${left[0]}`, `  ${right[0]}`);
  rightLabel = operator + rightLabel.slice(1);

  let [leftValue, rightValue] = alignEnd(String(left[1]), String(right[1]));

  const lines = [
    `${leftLabel} : ${leftValue}`,
    `${rightLabel} : ${rightValue}`,
  ];

  const total = String(equals);

  const width = Math.max(total.length, ...lines.map((line) => line.length));

  const equal = "=".repeat(width);

  return [...lines, equal, total.padStart(width, " ")].join("\n");
}

function alignStart<S extends string[]>(
  ...items: S
): { [P in keyof S]: string } {
  let width = Math.max(...items.map((item) => item.length));

  return items.map((item) => item.padEnd(width, " ")) as InferReturn;
}

function alignEnd<S extends string[]>(...items: S): { [P in keyof S]: string } {
  let width = Math.max(...items.map((item) => item.length));

  return items.map((item) => item.padStart(width, " ")) as InferReturn;
}

export function Display({ count }: { count: number }) {
  return <p>{count}</p>;
}

export function EachTick(callback: () => void) {
  return Hook((hook) => {
    const timer = setInterval(callback, 1000);

    hook.onDestroy(() => clearInterval(timer));

    return Reactive.from(undefined) as Reactive<void>;
  }, `tick`);
}
