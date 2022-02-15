import { useAtom, useReactive } from "@starbeam/react";
import { is, memo, reactive, verify } from "starbeam";
import "./App.css";
import logo from "./logo.svg";

interface User {
  name: string;
  country: string;
}

class Users {
  readonly #values: Map<string, User> = reactive(Map);

  insert(id: string, user: User): Readonly<User> {
    let row = reactive(user);
    this.#values.set(id, row);
    return row;
  }

  update(id: string, updates: Partial<User>): void {
    let user = this.#values.get(id);

    verify(user, is.Present);

    for (let [key, value] of Object.entries(updates)) {
      user[key as keyof User] = value;
    }
  }

  get all(): IterableIterator<User> {
    return this.#values.values();
  }
}

function App() {
  const count = useAtom(0);

  const users = new Users();

  users.insert("1", { name: "Tom Dale", country: "United States" });
  users.insert("2", { name: "Yehuda Katz", country: "United States" });

  function addUser() {
    users.insert("3", { name: "Chirag Patel", country: "United States" });
  }

  const names = useReactive(
    memo(() => [...users.all].map((user) => user.name))
  ).join(", ");

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>{names}</p>
        <button onClick={addUser}>Add a user</button>
        <p>
          <button type="button" onClick={() => count.update(count.current + 1)}>
            count is: {count.current}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {" | "}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
