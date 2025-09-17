import React from "react";
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import About from "./pages/About";



const App: React.FC = () => {
  return (
    <HashRouter>
      <Navbar></Navbar>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About/ >}/>
      </Routes>
    </HashRouter>
  );
};

export default App;