import React from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Company } from "../types/types";
import LoadingIcon from "./LoadingIcon";

interface Props {
  value: string;
  searchedCompanies: Company[];
  isSearched: boolean;
  isSearching: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  onClear: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SearchInput = (props: Props) => {
  const {
    value,
    searchedCompanies,
    isSearched,
    isSearching,
    onChange,
    onClick,
    onClear,
    onKeyDown,
  } = props;

  const ArrangedSearchedCompanies = () => {
    if (isSearching) {
      return (
        <div className="bg-white p-2 flex justify-center items-center">
          <LoadingIcon />
        </div>
      );
    }
    if (isSearched && searchedCompanies && searchedCompanies.length > 0) {
      return (
        <>
          {searchedCompanies.map((company) => (
            <a href={`/company/${company.id}`} key={company.id}>
              <div className="bg-white hover:bg-green-100 p-2 cursor-pointer">
                {company.name}
              </div>
            </a>
          ))}
        </>
      );
    } else if (isSearched && searchedCompanies.length === 0) {
      return <div className="bg-white p-2">該当企業なし</div>;
    }
  };

  return (
    <div className="h-[42px] flex items-center">
      <div className="relative">
        <input
          type="text"
          placeholder="企業名で検索"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          className="rounded border-[1px] border-gray-500 p-2 w-[250px] sm:w-[300px] lg:w-[400px]"
        />
        <div className="absolute h-full top-0 right-1 flex items-center">
          <button
            type="button"
            className="rounded-full text-gray-700 hover:bg-gray-100 p-1.5 inline-flex"
            onClick={onClear}
          >
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="absolute top-[42px] max-h-[200px] overflow-y-scroll shadow-lg w-full z-1 rounded-b-lg">
          {ArrangedSearchedCompanies()}
        </div>
      </div>
      {/* <Button label="検索" className="border-[1px]" onClick={onClick} /> */}
      <div className="bg-green-200 h-full ml-1 hover:bg-green-100 rounded-lg">
        <button onClick={onClick} className="h-full px-2">
          <MagnifyingGlassIcon className="size-6" />
        </button>
      </div>
    </div>
  );
};

export default SearchInput;
