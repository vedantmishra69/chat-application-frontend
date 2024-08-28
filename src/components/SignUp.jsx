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
    <div>
      <div>{message}</div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
        </div>
        <div>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleUsernameInput}
          />
        </div>
        <div>{usernameError}</div>
        <div>
          <label htmlFor="password">Password</label>
        </div>
        <div>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handlePasswordInput}
          />
        </div>
        <div>{passwordError}</div>
        <div>
          <label htmlFor="confirm_password">Confirm password</label>
        </div>
        <div>
          <input
            type="password"
            name="confirm_password"
            value={confirmPassword}
            onChange={handleConfirmPasswordInput}
          />
        </div>
        <div>{confirmPasswordError}</div>
        <div>
          <button type="submit">Sign Up</button>
        </div>
      </form>
      <div
        onClick={() => {
          setTopMessage("");
          setProcess("sign in");
        }}
      >
        Already have an account?
      </div>
    </div>
  );
}

export default SignUp;
