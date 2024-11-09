import React from "react";
import HomeIcon from "../components/HomeIcon";
import { useNavigate } from "react-router-dom";
import TitleMarker from "../components/TitleMarker";
import HowToUse from "../components/HowToUse";

const About = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <>
      {/* Compassとは？ */}
      <div className="font-extralight">
        <div className="flex justify-between items-center">
          <TitleMarker title="Compassとは？" />
        </div>
        <p>
          　Compassは財務三表（貸借対照表（B/S）、損益計算書（P/L）、キャッシュフロー計算書（C/F））の内容を手軽に確認できるサービスです。
        </p>
      </div>
      {/* 使い方 */}
      <HowToUse />
    </>
  );
};

export default About;
