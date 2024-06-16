import React from "react";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./pages/About";
import CompanyDetail from "./components/CompanyDetail";
import CompanyEdit from "./components/CompanyEdit";

function App() {
  return (
    <>
      <Header />
      <div className="m-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/company/:companyId/edit" element={<CompanyEdit />} />
          <Route path="/company/:companyId" element={<CompanyDetail />} />
        </Routes>
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default App;
