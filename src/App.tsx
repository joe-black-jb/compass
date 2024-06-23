import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./pages/About";
import NewTitle from "./pages/NewTitle";
import CompanyTitleEdit from "./components/CompanyTitleEdit";
import CompanyDetail from "./components/CompanyDetail";

function App() {
  return (
    <>
      <Header />
      <div className="m-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/company/:companyId/new/title" element={<NewTitle />} />
          <Route
            path="/company/:companyId/title/:titleId/edit"
            element={<CompanyTitleEdit />}
          />
          <Route path="/company/:companyId" element={<CompanyDetail />} />
        </Routes>
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default App;
