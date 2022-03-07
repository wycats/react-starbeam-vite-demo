import { Reactive } from "@starbeam/reactive";
import { Component } from "@starbeam/react";
import { User } from "../database/user";
import Each from "../lib/Each";
import Log from "../lib/Log";
import { UserForm } from "./UserForm";

export default Component(({ users }: { users: Reactive<User[]> }) => {
  return () => {
    return (
      <>
        <Log key="items" info={users} />
        {users.current.map((user) => (
          <UserForm user={user} key={user.id} />
        ))}
      </>
    );
  };
}, "UserList");

type ReactiveProps<Props> = { [P in keyof Props]: Reactive<Props[P]> };

declare function useReactive<Props>(props: Props): ReactiveProps<Props>;
declare function useReactive<T, Props>(
  props: Props,
  callback: (props: { [P in keyof Props]: Reactive<Props[P]> }) => T
): T;

// const UserList2 = Component(({ numbers }: { numbers: Reactive<number[]> }) => {

// })

export function UserList({ numbers }: { numbers: number[] }) {
  let props = useReactive({ numbers });

  return (
    <>
      <Log key="items" info={props.numbers.current} />
      <ul>
        <Each items={props.numbers} $key={(number) => String(number)}>
          {(number) => <li>{number}</li>}
        </Each>
      </ul>
    </>
  );
  // return useReactive({ numbers })(({ numbers }) => {
  //   return (
  //     <>
  //       <Log key="items" info={numbers.current} />
  //       <ul>
  //         <Each items={numbers} $key={(number) => String(number)}>
  //           {(number) => <li>{number}</li>}
  //         </Each>
  //       </ul>
  //     </>
  //   );
  // })

  // return useReactive((numbers) => {
}

// export const Users = Component(({ users }: { users: Reactive<User[]> }) => {});
