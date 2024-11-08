import React from "react";
import GoBackIcon from "./GoBackIcon";

const Compare = () => {
  const goBack = () => {
    console.log("goBack");
  };
  return (
    <>
      <div>
        <GoBackIcon onClick={goBack} />
      </div>
      <div>Compare</div>
    </>
  );
};

export default Compare;
