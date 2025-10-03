import { useApolloClient } from "@apollo/client";
import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import LoginForm from "./components/LoginForm";
import NewBook from "./components/NewBook";
import useUser from "./hooks/useUser";

const App = () => {
  const { favoriteGenre } = useUser();
  const [token, setToken] = useState(
    localStorage.getItem("library-user-token")
  );
  const [page, setPage] = useState("authors");
  const client = useApolloClient();

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };
  if (!token) {
    return (
      <div>
        <h2>Login</h2>
        <LoginForm setToken={setToken} />
      </div>
    );
  }

  return (
    <div>
      <button onClick={logout}>logout</button>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("recommendation")}>
          recommendation
        </button>
        <button onClick={() => setPage("add")}>add book</button>
      </div>

      <Authors show={page === "authors"} />

      <Books show={page === "books"} />

      <Books show={page === "recommendation"} favoriteGenre={favoriteGenre} />

      <NewBook show={page === "add"} />
    </div>
  );
};

export default App;
