interface Props {
  checked: boolean;
  onCheck: (checked: boolean) => void;
}

const Checkbox = (props: Props) => {
  const { checked, onCheck } = props;

  return (
    <>
      <div className="flex items-center mt-4">
        <input
          onChange={() => onCheck(checked)}
          checked={checked}
          id="checked-checkbox"
          type="checkbox"
          className="w-4 h-4 text-gray-900 border-2 bg-white/5 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2"
        />
        <label
          htmlFor="checked-checkbox"
          className="ms-2 text-sm/6 font-medium text-gray-900"
        >
          マイナス
        </label>
      </div>
    </>
  );
};

export default Checkbox;
