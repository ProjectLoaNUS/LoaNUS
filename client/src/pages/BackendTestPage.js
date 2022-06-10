import React from "react";
import { useState, useEffect } from "react";
import Axios from "axios";
import { BACKEND_URL } from "../database/const";

function BackendTestPage() {
  const [listofUsers, setlistofUsers] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [username, setUsername] = useState("");

  useEffect(() => {
    Axios.get(`${BACKEND_URL}/api/getUsers`).then((response) => {
      setlistofUsers(response.data);
    });
  }, []);
  const handlecreate = function () {
    Axios.post(`${BACKEND_URL}/api/signUp`, {
      name: name,
      age: age,
      username: username,
      password: "orbital2022"
    }).then((response) => {
      alert("User Created");
      setlistofUsers([...listofUsers], {
        name: name,
        age: age,
        username: username,
        password: "orbital2022"
      });
    });
  };
  return (
    <>
      <div>
        {listofUsers.map((user) => {
          return (
            <div key={user.name}>
              <h1>Name : {user.name}</h1>
              <h2>Age : {user.age}</h2>
              <h2>Username : {user.username}</h2>
            </div>
          );
        })}
      </div>
      <div>
        <input
          type="text"
          placeholder="Name..."
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <input
          type="number"
          placeholder="Age..."
          onChange={(event) => {
            setAge(event.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Username..."
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <button onClick={handlecreate}> Create </button>
      </div>
    </>
  );
}

export default BackendTestPage;
