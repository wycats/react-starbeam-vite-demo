import { Component } from "@starbeam/react";
import { FormEvent, useEffect, useState } from "react";
import { Reactive } from "@starbeam/core";

export default function ReactCounter() {
  const [count, setCount] = useState(0);

  function increment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCount((count) => count + 1);
  }

  function reset(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCount(0);
  }

  return (
    <form onSubmit={increment} onReset={reset}>
      <Display count={count} />
      <button type="submit">++</button>
      <button type="reset">[reset]</button>
    </form>
  );
}

export const Display = Component(({ count }: { count: Reactive<number> }) => {
  return () => {
    const [tick, setTick] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => setTick((tick) => tick + 1), 1000);

      return () => clearInterval(timer);
    }, []);

    return (
      <>
        <p>Tick: {tick}</p>
        <p>{count.current}</p>
      </>
    );
  };
});
