import { reactive } from "@starbeam/core";
import { FormEvent } from "react";

// class SliderState {
//   @reactive value: number;

//   constructor(readonly element: ReactElement, value: number) {
//     this.value = value;
//   }
// }

/**
 * Returns a slider and its associated value. No need for ref(), onChange() or
 * anything like that.
 */
export default function Slider(value: number) {
  function onInput(e: FormEvent<HTMLInputElement>) {
    // console.log(`input changed to ${e.currentTarget.valueAsNumber}`);

    state.value = e.currentTarget.valueAsNumber;
  }

  const input = (
    <input type="range" key={value} defaultValue={value} onInput={onInput} />
  );

  const state = reactive({
    element: input,
    value,
    update: (value: number) => (state.value = value),
  });
  // const state = new SliderState(input, value);

  return state;
}
