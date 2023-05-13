import { ToastContainer } from "react-toastify";

import Hero from "./components/Hero";
import Demo from "./components/Demo";

// styles
import "./App.css";

// app
const App = () => {
  return (
    <main>
      {/* main */}
      <div className="main">
        <div className="gradient" />
      </div>

      {/* app */}
      <div className="app">
        <Hero />
        <Demo />
      </div>

      {/* toast */}
      <aside>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          limit={1}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </aside>
    </main>
  );
};

export default App;
