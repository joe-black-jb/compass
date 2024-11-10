import { useState } from "react";
import { Link } from "react-router-dom";

import api from "../api/axiosConfig";
import { Company } from "../types/types";
import SearchInput from "../components/SearchInput";
import News from "../components/News";
import TitleMarker from "../components/TitleMarker";
import { searchCompanies } from "../api/api";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

const Home = () => {
  // UIに表示する企業データ
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  // 検索結果
  const [searchedCompanies, setSearchedCompanies] = useState<Company[]>([]);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  // 検索処理などで使用する企業データ
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [companyName, setCompanyName] = useState<string>("");

  // useEffect(() => {
  //   getCompanies();
  //   getAllCompanies();
  // }, []);

  const getCompanies = () => {
    api
      .get("/private/companies", {
        params: {
          limit: 50,
        },
      })
      .then((result) => {
        const companies = result.data;
        setCompanies(companies);
        setIsLoaded(true);
      })
      .catch((e) => {
        console.log("エラー: ", e);
      });
  };

  const getAllCompanies = () => {
    api
      .get("/private/companies")
      .then((result) => {
        const allCompanies = result.data;
        setAllCompanies(allCompanies);
      })
      .catch((e) => {
        console.log("エラー: ", e);
      });
  };

  const handleChangeCompanyName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e?.target?.value;
    setCompanyName(input);
  };

  const filterCompanies = (input: string) => {
    const filtered = allCompanies.filter(
      (company) => company.name.indexOf(input) !== -1 // 部分一致でフィルタリング
    );
    setSearchedCompanies(filtered);
  };

  // 企業一覧を表示する場合
  const handleSearch = () => {
    if (companyName) {
      filterCompanies(companyName);
      setIsSearched(true);
    } else {
      setCompanyName("");
      setIsSearched(false);
      setSearchedCompanies([]);
    }
  };

  // 検索にヒットした企業一覧を表示する場合
  const onClickSearch = async () => {
    if (companyName) {
      setIsSearching(true);
      const companies = await searchCompanies(companyName);

      setSearchedCompanies(companies);
      setIsSearched(true);
      setIsSearching(false);
    } else {
      clearCompanies();
    }
  };

  const clearCompanies = () => {
    setSearchedCompanies([]);
    setIsSearched(false);
    setIsLoaded(true);
  };

  const onClickCancel = () => {
    clearCompanies();
    setCompanyName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Enterキーによるデフォルト動作を防ぐ（フォームがある場合）
      // handleSearch();
      onClickSearch();
    }
  };

  const displayCompanies =
    searchedCompanies && searchedCompanies.length > 0
      ? searchedCompanies
      : companies;

  // 企業一覧を表示する関数
  const ArrangedCompanyTable = () => {
    if (isSearched && searchedCompanies.length === 0) {
      return (
        <div className="border-b-[1px] border-gray-400">
          <div className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
            <div className="flex justify-between items-center text-red-500">
              該当する企業がありませんでした
            </div>
          </div>
        </div>
      );
    }
    return displayCompanies?.map((company) => {
      return (
        <div key={company.id}>
          <Link
            to={`company/${company.id}`}
            className="hover:bg-green-100 border-b-[1px] border-gray-400 block"
          >
            <div
              // scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
            >
              <div className="flex justify-between items-center">
                {company.name}
              </div>
            </div>
          </Link>
        </div>
      );
    });
  };

  // 検索でヒットした企業一覧を表示する関数
  const SearchedCompanies = () => {
    if (isSearched && searchedCompanies.length === 0) {
      return (
        <div className="border-b-[1px] border-gray-400">
          <div className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
            <div className="flex justify-between items-center">
              該当企業なし
            </div>
          </div>
        </div>
      );
    }
    if (!isSearched) {
      return (
        <div className="border-b-[1px] border-gray-400">
          <div className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
            <div className="flex justify-between items-center">
              検索結果が表示されます
            </div>
          </div>
        </div>
      );
    }
    return searchedCompanies?.map((company) => {
      return (
        <div key={company.id}>
          <Link
            to={`company/${company.id}`}
            className="hover:bg-green-100 border-b-[1px] border-gray-400 block"
          >
            <div className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
              <div className="flex justify-between items-center">
                {company.name}
              </div>
            </div>
          </Link>
        </div>
      );
    });
  };

  return (
    <>
      {/* <Header2 /> */}
      <div className="flex justify-center mb-4">
        <SearchInput
          value={companyName}
          searchedCompanies={searchedCompanies}
          isSearched={isSearched}
          isSearching={isSearching}
          onChange={handleChangeCompanyName}
          onClick={onClickSearch}
          onClear={onClickCancel}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div>
        <div className="flex justify-end items-center">
          <a href="/about" target="secret" className="w-fit flex">
            <div className="w-fit text-blue-500 text-right hover:underline">
              使い方を見る
            </div>
            <ArrowTopRightOnSquareIcon className="size-5 ml-1 text-blue-500" />
          </a>
        </div>
      </div>
      <div>
        {/* ニュース */}
        <div>
          <div className="flex justify-start">
            <TitleMarker title="ニュース (日本経済新聞)" />
          </div>
          <div className="mb-20">
            <News />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
