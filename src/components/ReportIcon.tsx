import React from "react";

interface Props {
  label: string;
  color: string;
}

const ReportIcon = (props: Props) => {
  const { label, color } = props;
  return (
    <div className={`bg-${color}-100 rounded-xl py-1 px-2 mr-2`}>{label}</div>
  );
};

export default ReportIcon;
