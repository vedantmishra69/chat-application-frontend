/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import { escape, isLength, matches } from "validator";
import { SERVER_URL } from "../util/constants";

const USERNAME_ERRORS = [
  "",
  "Username should be alpha-numeric with only '_' allowed as a special character.",
  "Username should be minimum 1 and maximum 16 letters long.",
];

const PASSWORD_ERRORS = [
  "",
  "Password should be minimum 8 and maximum 20 letters long.",
];

function SignIn({ topMessage, setProcess, setTopMessage, setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(USERNAME_ERRORS[0]);
  const [passwordError, setPasswordError] = useState(PASSWORD_ERRORS[0]);
  const [message, setMessage] = useState(topMessage);

  function handleSubmit(event) {
    event.preventDefault();
    if (usernameError === passwordError && usernameError === "") {
      axios
        .post(SERVER_URL + "/auth/signin", {
          username: username,
          password: password,
        })
        .then((res) => {
          console.log(res.data);
          localStorage.setItem("token", res.data.token);
          console.log(localStorage.getItem("token"));
          setUser(username);
          setProcess("user verified");
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 403) {
            setMessage("Wrong Password.");
            setPassword("");
          }
          if (err.response.status === 404) {
            setTopMessage("User not found, please register.");
            setProcess("sign up");
          }
        });
    }
  }

  function handleUsernameInput(event) {
    setUsername(event.target.value);
    const escaped = escape(event.target.value);
    if (!matches(escaped, /^[a-zA-Z0-9_]+$/)) {
      setUsernameError(USERNAME_ERRORS[1]);
    } else if (!isLength(escaped, { min: 1, max: 16 })) {
      setUsernameError(USERNAME_ERRORS[2]);
    } else setUsernameError(USERNAME_ERRORS[0]);
  }

  function handlePasswordInput(event) {
    setPassword(event.target.value);
    const escaped = escape(event.target.value);
    if (!isLength(escaped, { min: 8, max: 20 })) {
      setPasswordError(PASSWORD_ERRORS[1]);
    } else setPasswordError(PASSWORD_ERRORS[0]);
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {message && (
          <div className="text-center text-red-600 font-medium">{message}</div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-sm poppins-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={handleUsernameInput}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {usernameError && (
              <div className="text-sm text-red-600">{usernameError}</div>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm poppins-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handlePasswordInput}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {passwordError && (
              <div className="text-sm text-red-600">{passwordError}</div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign In
          </button>
        </form>

        <div
          onClick={() => {
            setTopMessage("");
            setProcess("sign up");
          }}
          className="text-center text-sm text-blue-600 hover:text-blue-700 cursor-pointer poppins-medium"
        >
          Register
        </div>
      </div>
    </div>
  );
}

export default SignIn;
