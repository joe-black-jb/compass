import { PeriodOption } from "../types/types";

interface Props {
  periodOption: PeriodOption;
  selected: boolean;
  onClick: (periodOption: PeriodOption) => void;
}
const PeriodOptionItem = (props: Props) => {
  const { periodOption, selected, onClick } = props;
  return (
    <div
      className={`ml-2 cursor-pointer hover:underline hover:decoration-green-300 hover:decoration-4 ${
        selected && "underline decoration-green-300 decoration-4"
      }`}
      onClick={() => onClick(periodOption)}
    >
      {periodOption.title}
    </div>
  );
};

export default PeriodOptionItem;
