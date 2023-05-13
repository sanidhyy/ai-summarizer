import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

// app
import App from "./App";
import { store } from "./services/store";

// render app
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* redux store */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
