import React from "react";
import Button from "./Button";

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SearchInput = (props: Props) => {
  const { value, onChange, onClick, onKeyDown } = props;

  return (
    <div>
      <input
        type="text"
        placeholder="企業名で検索"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className="rounded border-[1px] border-gray-500 py-2 px-2 mr-4 w-[200px] md:w-[300px] lg:w-[400px]"
      />
      <Button label="検索" className="border-[1px]" onClick={onClick} />
    </div>
  );
};

export default SearchInput;
