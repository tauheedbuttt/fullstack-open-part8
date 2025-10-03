import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import client from "./config/apollo.js";
import { ApolloProvider } from "@apollo/client";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>
);
