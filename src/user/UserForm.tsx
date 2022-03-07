import { useReactive } from "@starbeam/react";
import { FormEvent, Fragment } from "react";
import { User } from "../database/user.js";

export function UserForm({ user }: { user: User }) {
  return useReactive(
    () => {
      let draft = user.draft;

      function update(event: FormEvent<HTMLFormElement>) {
        let data = new FormData(event.currentTarget);

        let newName = data.get("name") as string;
        let newCountry = data.get("country") as string;

        draft.set("name", newName);
        draft.set("country", newCountry);
      }

      function finalize(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        draft.commit();
      }

      return () => (
        <>
          <form key={user.id} onInput={update} onSubmit={finalize}>
            <input name="name" defaultValue={draft.columns.name} />
            <input name="country" defaultValue={draft.columns.country} />
            {draft.isDirty ? <button type="submit">Done</button> : null}
          </form>
        </>
      );
    },
    { user }
  );
}
