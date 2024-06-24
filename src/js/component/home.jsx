import React, { useEffect, useState } from "react";

//include images into your bundle

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    getTasks();
  }, []);

  async function getTasks() {
    try {
      const response = await fetch(
        "https://playground.4geeks.com/todo/users/ListaCompra"
      );
      if (!response.ok) {
        if (response.status === 404) {
          await createUser();
          await getTasks();
        } else {
          throw new Error(`Error:${response.statusText}`);
        }
      } else {
        const data = await response.json();
        setTodos(data.todos);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function createUser() {
    try {
      const response = await fetch(
        "https://playground.4geeks.com/todo/users/ListaCompra",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            label: inputValue,
            is_done: false,
          }),
        }
      );
      if (!response.ok) {
        throw new error(`error al crear usuario:${response.statusText}`);
      }
    } catch (error) {
      // Gestion error
      console.log(error);
    }
  }

  async function addTodo(e) {
    if (e.key === "Enter") {
      try {
        console.log("va todo bien");
        const response = await fetch(
          "https://playground.4geeks.com/todo/todos/ListaCompra",
          {
            method: "POST",
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              label: inputValue,
              is_done: false,
            }),
          }
        );

        const data = await response.json();
        if (response.ok) {
          setInputValue("");
          getTasks();
        }
      } catch (error) {
        // Gestion error
        console.log(error);
      }
    }
  }

  async function deleteOne(id) {
    try {
      console.log(id);
      const response = await fetch(
        `https://playground.4geeks.com/todo/todos/${id}`,
        {
          method: "DELETE",
        }
      );
      console.log(response);
      if (response.ok) setTodos(todos.filter((item, index) => item.id != id));
    } catch (error) {
      console.log(error);
    }
  }

  const deleteAll = async () => {
    try {
      const promises = todos.map((todo) => {
        return fetch(`https://playground.4geeks.com/todo/todos/${todo.id}`, {
          method: "DELETE",
        });
      });

      const responses = await Promise.all(promises);
      responses.forEach((response, index) => {
        console.log(responses);
      });
      getTasks();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center text-success">Lista de la compra</h1>
      <ul className="row p-0">
        <li className="border-0 p-0 ">
          <input
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            onKeyDown={addTodo}
            name="text"
            placeholder="Me falta..."
            className="input "
            type="text"
          />
        </li>

        {todos.map((item, index) => (
          <li key={index}>
            {item.label}
            <i
              className="icono mt-1 fa fa-solid fa-delete-left"
              onClick={() => deleteOne(item.id)}
            ></i>
          </li>
        ))}
        <div className="p-0 text-white">{todos.length} elemento</div>
      </ul>
      <div className="d-grid gap-2 col-6 mx-auto">
        <button
          onClick={deleteAll}
          className="btn btn-outline-danger"
          type="button"
        >
          Delete All
        </button>
      </div>
    </div>
  );
};

export default Home;
