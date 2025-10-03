import { useMutation } from "@apollo/client";
import { useState } from "react";
import { LOGIN } from "../services/auth";
import Notify from "./Notify";

// eslint-disable-next-line react/prop-types
const LoginForm = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const notify = (message) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 10000);
  };
  const [login] = useMutation(LOGIN, {
    onError: (error) => {
      notify(error.graphQLErrors[0].message);
    },
    update: (_, response) => {
      const token = response.data.login.value;
      setToken(token);
      localStorage.setItem("library-user-token", token);
    },
  });

  const submit = async (event) => {
    event.preventDefault();

    login({ variables: { username, password } });
  };

  return (
    <div>
      <Notify errorMessage={error} />
      <form onSubmit={submit}>
        <div>
          username{" "}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{" "}
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
