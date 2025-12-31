import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import T from "./Tra";
import R from "./Rest";
function App() {
  // const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<T />} />
        <Route path="/R" element={<R />} />


      </Routes>
    </>
  );
}

export default App;
