import { Reactive } from "@starbeam/reactive";
import { ReactElement, useCallback } from "react";

interface EachProps<T> {
  items: T[];
  children: (item: T) => ReactElement;
  $key: (item: T) => string;
}

export default function Each<T>({
  items,
  children,
  $key,
}: {
  items: Reactive<T[]>;
  $key: (item: T) => string;
  children: (item: T) => ReactElement;
}) {
  // return use(() => {
  //   function Block({ item }: { item: T }) {
  //     return children(item);
  //   }

  //   return () => {
  //     const list: ReactElement[] = items.current.map((item: T) => (
  //       <Block item={item} key={$key(item)} />
  //     ));

  //     return <>{list}</>;
  //   };
  // });

  const Block = useCallback(({ item }: { item: T }) => children(item), []);

  const list = items.current.map((item: T) => (
    <Block item={item} key={$key(item)} />
  ));

  return <>{list}</>;
}

// export default Component(function Each<T>({
//   items,
//   children,
//   $key,
// }: ReactiveProps<EachProps<T>>) {
//   function Block({ item }: { item: T }) {
//     return children(item);
//   }

//   return () => {
//     const list: ReactElement[] = items.current.map((item: T) => (
//       <Block item={item} key={$key(item)} />
//     ));

//     return <>{list}</>;
//   };
// },
// "Each");
