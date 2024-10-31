import React from "react";
import { TitleValue } from "../types/types";

interface Props {
  titleValues: TitleValue[];
}

const CustomToolTip = (props: Props) => {
  const { titleValues } = props;

  return (
    <div>
      {titleValues.map((titleValue) => (
        <div className={titleValue.color ? `text-${titleValue.color}-100` : ""}>
          {titleValue.title} : {titleValue.value}
        </div>
      ))}
    </div>
  );
};

export default CustomToolTip;
