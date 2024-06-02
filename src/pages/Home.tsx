import React, { useState } from "react";
import axios from "axios";
import Button from "../components/Button";
import api from "../api/axiosConfig";

const Home = () => {
  const [companies, setCompanies] = useState();
  const getCompanies = () => {
    // console.log("=== getCompanies ===");
    // console.log("api: ", api);

    api
      .get("/companies")
      .then((result) => {
        console.log("result: ", result);
      })
      .catch((e) => {
        console.log("エラー: ", e);
      });
    // fetch("http://localhost:8080/companies")
    //   .then((res) => {
    //     console.log("fetchした時のレスポンス: ", res);
    //   })
    //   .catch((e) => {
    //     console.log("fetch エラー: ", e);
    //   });
  };

  return (
    <>
      <div>Home</div>
      <Button label="会社一覧取得" onClick={getCompanies} />
    </>
  );
};

export default Home;
