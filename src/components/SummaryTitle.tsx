import { useState } from "react";

interface Props {
  title: string;
  periodStart?: string;
  periodEnd?: string;
  disablePeriod?: boolean;
  noData?: boolean;
  isLoading?: boolean;
}

const SummaryTitle = (props: Props) => {
  const {
    title,
    periodStart,
    periodEnd,
    disablePeriod,
    noData,
    isLoading = false,
  } = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleSummary = () => {
    setIsOpen(!isOpen);
  };

  const open = isOpen;

  if (isLoading) {
    return (
      <div
        className="relative bg-green-300 h-[56px] animate-pulse rounded-xl"
        onClick={toggleSummary}
      ></div>
    );
  }

  return (
    <div
      className="relative bg-green-300 font-bold text-sm rounded-xl py-2 px-2"
      onClick={toggleSummary}
    >
      <svg
        className={`absolute top-2 w-5 h-5 transform ${
          open ? "rotate-0" : "-rotate-90"
        }`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
      <div className="text-center">{title}</div>
      {periodStart && periodEnd && (
        <div className="text-center">
          ({periodStart} ~ {periodEnd})
        </div>
      )}
      {!periodStart && !periodEnd && !disablePeriod && (
        <div className="text-center">(該当期間なし)</div>
      )}
      {noData && !isLoading && (
        <div className="text-center">(該当データなし)</div>
      )}
    </div>
  );
};

export default SummaryTitle;
