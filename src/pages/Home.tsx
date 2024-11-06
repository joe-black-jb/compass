import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api/axiosConfig";
import { Company } from "../types/types";
import SearchInput from "../components/SearchInput";
import LoadingIcon from "../components/LoadingIcon";

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

  useEffect(() => {
    getCompanies();
    getAllCompanies();
  }, []);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Enterキーによるデフォルト動作を防ぐ（フォームがある場合）
      handleSearch();
    }
  };

  const displayCompanies =
    searchedCompanies && searchedCompanies.length > 0
      ? searchedCompanies
      : companies;

  const ArrangedCompanyTable = () => {
    if (isSearched && searchedCompanies.length === 0) {
      return (
        <tbody>
          <tr className="border-b border-gray-700">
            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
              <div className="flex justify-between items-center text-red-500">
                該当する企業がありませんでした
              </div>
            </td>
          </tr>
        </tbody>
      );
    }
    return displayCompanies?.map((company) => {
      return (
        <tbody key={company.id}>
          <tr className="border-b border-gray-700">
            <td
              // scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
            >
              <div className="flex justify-between items-center">
                <Link
                  to={`company/${company.id}`}
                  className="hover:text-blue-500 hover:underline"
                >
                  {company.name}
                </Link>
              </div>
            </td>
            {/* 資料 */}
            {/* <td className="flex px-6 py-4">
              {company.bs === 1 && (
                <ReportIcon label="B/S" color="green" />
              )}
              {company.pl === 1 && (
                <ReportIcon label="P/L" color="blue" />
              )}
            </td> */}
          </tr>
        </tbody>
      );
    });
  };

  return (
    <>
      {/* <Header2 /> */}
      <div className="flex justify-center mb-8">
        <div>
          <SearchInput
            value={companyName}
            onChange={handleChangeCompanyName}
            onClick={handleSearch}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      <div className="bg-gray-200 text-gray-700 font-bold border-b border-gray-700 pl-2 py-2">
        企業名 (先頭50社)
      </div>
      {isLoaded ? (
        <div className="relative overflow-x-auto  max-h-[600px]">
          <table className="w-full text-sm text-left text-gray-700">
            {ArrangedCompanyTable()}
          </table>
        </div>
      ) : (
        <div className="flex justify-center mt-20">
          <LoadingIcon />
        </div>
      )}
    </>
  );
};

export default Home;
