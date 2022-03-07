import { IntoReactive } from "@starbeam/core";
import { Abstraction } from "@starbeam/debug";

export default function Log({
  info,
  from = Abstraction.callerFrame(),
}: {
  info: IntoReactive<any>;
  from?: string;
}) {
  return <></>;
}
