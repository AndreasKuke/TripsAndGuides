import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import facade from "../apiFacade";

function LogIn() {
  const init = { username: "", password: "" };
  const [loginCredentials, setLoginCredentials] = useState(init);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setLoggedIn } = useOutletContext();

  const performLogin = (evt) => {
    evt.preventDefault();
    setError("");
    facade
      .login(loginCredentials.username, loginCredentials.password)
      .then(() => {
        setLoggedIn(true);
        navigate("/");
      })
      .catch((err) => {
        setError("Invalid username or password");
        console.error(err);
      });
  };

  const performRegister = (evt) => {
    evt.preventDefault();
    setError("");
    facade
      .register(loginCredentials.username, loginCredentials.password)
      .then(() => {
        setLoggedIn(true);
        navigate("/");
      })
      .catch((err) => {
        setError("Registration failed. User might already exist.");
        console.error(err);
      });
  };

  const onChange = (evt) => {
    setLoginCredentials({
      ...loginCredentials,
      [evt.target.id]: evt.target.value,
    });
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={performLogin}>
        <input
          placeholder="User Name"
          id="username"
          onChange={onChange}
          value={loginCredentials.username}
        />
        <input
          placeholder="Password"
          id="password"
          type="password"
          onChange={onChange}
          value={loginCredentials.password}
        />
        <button type="submit">Login</button>
        <button type="button" onClick={performRegister}>
          Register
        </button>
      </form>
    </div>
  );
}
export default LogIn;
