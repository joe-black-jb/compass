import SummaryTitle from "./SummaryTitle";

interface Props {
  reportType: string;
}

const NoSummary = (props: Props) => {
  const { reportType } = props;

  let containerClassName =
    "mb-20 w-full sm:w-[240px] lg:w-[350px] mx-auto sm:mx-0";

  if (reportType === "損益計算書") {
    containerClassName += " sm:ml-10";
  }

  return (
    <div className={containerClassName}>
      <SummaryTitle title={reportType} />
      <div className="mt-4">(単位：)</div>
      <div className="h-[500px] w-full mt-2 bg-gray-400 border-2 border-gray-600 rounded-2xl text-center leading-[500px] ">
        表示するデータがありません
      </div>
    </div>
  );
};

export default NoSummary;
