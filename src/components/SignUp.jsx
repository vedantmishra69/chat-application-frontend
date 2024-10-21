/* eslint-disable react/prop-types */
import { useState } from "react";
import { escape, isLength, matches } from "validator";
import axios from "axios";
import { SERVER_URL } from "../util/constants";

const USERNAME_ERRORS = [
  "",
  "Username should be alpha-numeric with only '_' allowed as a special character.",
  "Username should be minimum 1 and maximum 16 letters long.",
];

const PASSWORD_ERRORS = [
  "",
  "Password should be minimum 8 and maximum 20 letters long.",
  "Passwords do not match.",
];

function SignUp({ topMessage, setTopMessage, setProcess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState(USERNAME_ERRORS[0]);
  const [passwordError, setPasswordError] = useState(PASSWORD_ERRORS[0]);
  const [confirmPasswordError, setConfirmPasswordError] = useState(
    PASSWORD_ERRORS[0],
  );
  const [message, setMessage] = useState(topMessage);

  function handleSubmit(event) {
    event.preventDefault();
    if (
      usernameError === passwordError &&
      passwordError == confirmPasswordError &&
      usernameError === ""
    ) {
      axios
        .post(SERVER_URL + "/auth/signup", {
          username: username,
          password: password,
        })
        .then((res) => {
          console.log(res.data.message);
          setTopMessage("User registered, now please sign in.");
          setProcess("sign in");
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 409)
            setMessage("Username already taken, please try a different one.");
          else setMessage("Couldn't register, please try again.");
        });
    }
  }

  function handleUsernameInput(event) {
    const currentText = event.target.value;
    setUsername(currentText);
    const escaped = escape(currentText);
    if (!matches(escaped, /^[a-zA-Z0-9_]+$/)) {
      setUsernameError(USERNAME_ERRORS[1]);
    } else if (!isLength(escaped, { min: 1, max: 16 })) {
      setUsernameError(USERNAME_ERRORS[2]);
    } else setUsernameError(USERNAME_ERRORS[0]);
  }

  function handlePasswordInput(event) {
    const currentText = event.target.value;
    setPassword(currentText);
    const escaped = escape(currentText);
    if (!isLength(escaped, { min: 8, max: 20 })) {
      setPasswordError(PASSWORD_ERRORS[1]);
    } else setPasswordError(PASSWORD_ERRORS[0]);
  }

  function handleConfirmPasswordInput(event) {
    const currentText = event.target.value;
    setConfirmPassword(currentText);
    const escaped = escape(currentText);
    if (!isLength(escaped, { min: 8, max: 20 })) {
      setConfirmPasswordError(PASSWORD_ERRORS[1]);
    } else if (escaped !== password) {
      setConfirmPasswordError(PASSWORD_ERRORS[2]);
    } else setConfirmPasswordError(PASSWORD_ERRORS[0]);
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

          <div className="space-y-2">
            <label
              htmlFor="confirm_password"
              className="block text-sm poppins-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirm_password"
              value={confirmPassword}
              onChange={handleConfirmPasswordInput}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {confirmPasswordError && (
              <div className="text-sm text-red-600">{confirmPasswordError}</div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign Up
          </button>
        </form>

        <div
          onClick={() => {
            setTopMessage("");
            setProcess("sign in");
          }}
          className="text-center poppins-medium text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
        >
          Already have an account?
        </div>
      </div>
    </div>
  );
}

export default SignUp;
