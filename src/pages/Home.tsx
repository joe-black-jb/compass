import { Suspense, useEffect, useState } from "react";
import { debounce } from "lodash";
import { Link } from "react-router-dom";

import api from "../api/axiosConfig";
import { Company } from "../types/types";
import Button from "../components/Button";
import ReportIcon from "../components/ReportIcon";
import SearchInput from "../components/SearchInput";

// TODO: 企業一覧表示にページング機能を追加する
const Home = () => {
  // UIに表示する企業データ
  const [companies, setCompanies] = useState<Company[]>([]);
  // 検索結果
  const [searchedCompanies, setSearchedCompanies] = useState<Company[]>([]);
  // 検索処理などで使用する企業データ
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [companyName, setCompanyName] = useState<string>("");

  useEffect(() => {
    getCompanies();
    getAllCompanies();
  }, []);

  const getCompanies = () => {
    api
      .get("/companies", {
        params: {
          limit: 50,
        },
      })
      .then((result) => {
        const companies = result.data;
        setCompanies(companies);
      })
      .catch((e) => {
        console.log("エラー: ", e);
      });
  };

  const getAllCompanies = () => {
    api
      .get("/companies")
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

  const filterCompanies = debounce((input: string) => {
    const filtered = allCompanies.filter(
      (company) => company.name.indexOf(input) !== -1 // 部分一致でフィルタリング
    );
    // setCompanies(filtered);
  }, 1000);

  const handleSearch = () => {
    if (companyName) {
      api
        .get("/search/companies", {
          params: {
            companyName,
          },
        })
        .then((res) => {
          const companies = res.data;
          if (companies && companies.length > 0) {
            setSearchedCompanies(companies);
          }
          // console.log(`「${companyName}」で検索した結果: ${res.data}`);
        });
    } else {
      setCompanyName("");
      setSearchedCompanies([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Enterキーによるデフォルト動作を防ぐ（フォームがある場合）
      handleSearch();
    }
  };

  // console.log("companies[0]: ", companies[0]);

  const displayCompanies =
    searchedCompanies && searchedCompanies.length > 0
      ? searchedCompanies
      : companies;

  return (
    <>
      <div className="flex justify-center mb-8">
        <SearchInput
          value={companyName}
          onChange={handleChangeCompanyName}
          onClick={handleSearch}
          onKeyDown={handleKeyDown}
        />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="bg-gray-200 text-gray-700 font-bold border-b border-gray-700 pl-2 py-2">
          企業名
        </div>
        <div className="relative overflow-x-auto  max-h-[600px]">
          <table className="w-full text-sm text-left text-gray-700">
            {displayCompanies.length > 0 &&
              displayCompanies.map((company) => {
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
              })}
          </table>
        </div>
      </Suspense>
    </>
  );
};

export default Home;
