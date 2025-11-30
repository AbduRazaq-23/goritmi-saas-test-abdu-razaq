import React from "react";
import LandingPage from "./Pages/LandingPage";
import { Route, Routes } from "react-router-dom";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
