import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './styles/login.css';
import { API_URL } from '../config';
import auth from "../auth";

export default function Login() {
  let history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    axios.post(`${API_URL}/login`, { username: username, password: password })
      .then(response => {
        console.log(response.data);
        if (response.status === 200) {
          // then parse data...
          if (response.data.token) {
            auth.login(response.data.token);
            history.push("/products");
          } else {
            // something went wrong...
            console.log("something went wrong...");
          }
        } else {
          // something went wrong...
          console.log("something went wrong...");
        }
      })
      .catch(err => {
        // something went wrong...
        console.log(err);
      });
  }

  return (
    <div className="container">
      <div className="form-container shadow">
        <p className="text-caption">Please Login</p>
        <input onChange={(e) => { setUsername(e.target.value) }} value={username || ""} className="inputstyle low-shadow" type="text" placeholder="Username" />
        <input onChange={(e) => { setPassword(e.target.value) }} value={password || ""} className="inputstyle low-shadow" type="password" placeholder="Password" />
        <button onClick={() => { handleLogin() }} className="buttonstyle low-shadow">Login</button>
      </div>
    </div>
  );
}