import SummaryTitle from "./SummaryTitle";

interface Props {
  reportType: string;
  disablePeriod?: boolean;
  noData?: boolean;
}

const NoSummary = (props: Props) => {
  const { reportType, disablePeriod, noData } = props;

  let containerClassName =
    "mb-20 w-full sm:w-[240px] lg:w-[350px] mx-auto sm:mx-0";

  if (reportType === "損益計算書") {
    containerClassName += " sm:ml-10";
  }

  return (
    <div className={containerClassName}>
      <SummaryTitle
        title={reportType}
        disablePeriod={disablePeriod}
        noData={noData}
      />
    </div>
  );
};

export default NoSummary;
