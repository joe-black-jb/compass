interface Props {
  title: string;
  periodStart?: string;
  periodEnd?: string;
  open?: boolean;
}

const SummaryTitle = (props: Props) => {
  const { title, periodStart, periodEnd, open } = props;

  return (
    <div className="relative bg-green-300 font-bold rounded-xl py-2 px-2">
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
      {periodStart && periodEnd ? (
        <div className="text-center">
          ({periodStart} ~ {periodEnd})
        </div>
      ) : (
        <div className="text-center">(該当期間なし)</div>
      )}
    </div>
  );
};

export default SummaryTitle;
