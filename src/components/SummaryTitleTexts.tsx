interface Props {
  titleName: string;
  valueStr: string;
  ratio: number;
  singleLine: boolean;
}

const SummaryTitleTexts = (props: Props) => {
  const { titleName, valueStr, ratio, singleLine } = props;

  if (singleLine) {
    return (
      <div>
        {titleName} {valueStr} ({ratio}%)
      </div>
    );
  } else {
    return (
      <div>
        <div>{titleName}</div>
        <div>{valueStr}</div>
        <div>({ratio}%)</div>
      </div>
    );
  }
};

export default SummaryTitleTexts;
