import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api/axiosConfig";
import { Company } from "../types/types";
import SearchInput from "../components/SearchInput";
import LoadingIcon from "../components/LoadingIcon";
import News from "../components/News";
import TitleMarker from "../components/TitleMarker";
import { searchCompanies } from "../api/api";

const Home = () => {
  // UIに表示する企業データ
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  // 検索結果
  const [searchedCompanies, setSearchedCompanies] = useState<Company[]>([]);
  const [isSearched, setIsSearched] = useState<boolean>(false);
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
      const companies = await searchCompanies(companyName);
      console.log(`「${companyName}」で検索した結果: ${companies}`);

      setSearchedCompanies(companies);
      setIsSearched(true);
    } else {
      clearCompanies();
    }
  };

  const clearCompanies = () => {
    setSearchedCompanies([]);
    setIsSearched(false);
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
              調べたい企業名を入力してください
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
          onChange={handleChangeCompanyName}
          onClick={onClickSearch}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div>
        {/* 企業一覧テーブル */}
        <div>
          <div className="flex justify-start border-b-[1px] border-gray-400">
            <div className="lg:mb-6">
              <TitleMarker title="調べたい企業" />
            </div>
          </div>
          <div>
            {/* 企業一覧を取得する場合 */}
            {/* {isLoaded ? (
              <div className="relative overflow-x-auto  max-h-[420px] lg:max-h-[1200px]">
                <div className="w-full text-sm text-left text-gray-700">
                  {SearchedCompanies()}
                </div>
              </div>
            ) : (
              <div className="flex justify-center mt-20">
                <LoadingIcon />
              </div>
            )} */}

            <div className="relative overflow-x-auto  max-h-[420px] lg:max-h-[1200px]">
              <div className="w-full text-sm text-left text-gray-700">
                {SearchedCompanies()}
              </div>
            </div>
          </div>
        </div>
        {/* ニュース */}
        <div>
          <div className="flex justify-start mt-10">
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
