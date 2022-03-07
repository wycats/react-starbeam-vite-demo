import { reactive } from "@starbeam/core";
import { useReactive } from "@starbeam/react";
import { Cell } from "@starbeam/reactive";
import "./App.css";
import { Equation } from "./counter/starbeam-counter";
import { tables } from "./database/db";
import Log from "./lib/Log";
import { UserForm } from "./user/UserForm";
import UserList from "./user/UserList";
// import Users from "./user/Users";

const Users = tables.users;
Users.insert({ id: "1", name: "Tom Dale", country: "United States" });
Users.insert({ id: "2", name: "Yehuda Katz", country: "United States" });

function App() {
  return useReactive(() => {
    const count = Cell(0);

    function addUser() {
      Users.insert({ id: "3", name: "Chirag Patel", country: "United States" });
    }

    const users = reactive(() => [...Users.all]);
    const names = reactive(() =>
      users.current.map((user) => user.columns.name).join(", ")
    );

    return () => {
      return (
        <div className="App">
          <header className="App-header">
            <p>List of users: {names.current}</p>

            <Log key="users" info={users} />
            <UserList users={users} />

            <button onClick={addUser}>Add a user</button>

            <h2>Equation</h2>
            <Equation />

            {/* <h2>Starbeam Counter</h2>
            <StarbeamCounter />
  
            <h2>React Counter</h2>
            <ReactCounter /> */}
          </header>
        </div>
      );
    };
  }, {});
}

export default App;
