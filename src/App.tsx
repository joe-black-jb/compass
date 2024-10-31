import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import CompanyTitleEdit from "./components/CompanyTitleEdit";
import CompanyDetail from "./components/CompanyDetail";
import Login from "./pages/Login";
import RegisterUser from "./pages/RegisterUser";
import { getJwtFromCookie, getUsernameFromCookie } from "./utils/funcs";
import { authUser } from "./utils/apis";
import Header2 from "./components/Header2";

function App() {
  useEffect(() => {
    // checkAccount();
  }, []);
  const [username, setUsername] = useState<string>("");
  let isAdmin = false;
  const checkAccount = async () => {
    // jwt があればログイン済み
    const jwtFromCookie = getJwtFromCookie();
    const usernameFromCookie = getUsernameFromCookie();

    if (usernameFromCookie) {
      setUsername(usernameFromCookie);
    }
    let result;
    if (jwtFromCookie) {
      // ログイン済みユーザの権限チェック
      result = await authUser(jwtFromCookie);
      isAdmin = result;
    }
  };
  return (
    <>
      <Header2 />
      <div className="mx-10 mt-24 md:mx-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/company/:companyId/title/:titleId/edit"
            element={<CompanyTitleEdit />}
          />
          <Route path="/company/:companyId" element={<CompanyDetail />} />
          <Route
            path="/company/:companyId/loggedIn"
            element={<CompanyDetail />}
          />
        </Routes>
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default App;
