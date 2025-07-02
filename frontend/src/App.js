import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Simulator from "./pages/Simulator";
import Learn from "./pages/Learn";
import About from "./pages/About";
import { StarBackground } from "./components/StarBackground";

function App() {
  return (
    <div className="App dark min-h-screen bg-slate-900 text-white relative overflow-x-hidden">
      <StarBackground />
      <BrowserRouter>
        <Navbar />
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;