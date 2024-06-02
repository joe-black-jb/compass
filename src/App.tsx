import React from "react";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./pages/About";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
