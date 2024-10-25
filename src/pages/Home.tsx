import { Suspense, useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { Company } from "../types/types";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import ReportIcon from "../components/ReportIcon";

const Home = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    getCompanies();
  }, []);
  const getCompanies = () => {
    api
      .get("/companies")
      .then((result) => {
        const companies = result.data;
        setCompanies(companies);
      })
      .catch((e) => {
        console.log("エラー: ", e);
      });
  };

  const onClickAddCompany = () => {
    navigate("/new/company");
  };

  // console.log("companies[0]: ", companies[0]);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-gray-700 uppercase font-bold">
              <tr className="border-b border-gray-700">
                <th scope="col" className="px-6 py-3">
                  企業名
                </th>
                <th scope="col" className="px-6 py-3">
                  資料
                </th>
              </tr>
            </thead>
            {companies.length > 0 &&
              companies.map((company) => {
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
                      <td className="flex px-6 py-4">
                        {company.bs === 1 && (
                          <ReportIcon label="B/S" color="green" />
                        )}
                        {company.pl === 1 && (
                          <ReportIcon label="P/L" color="blue" />
                        )}
                      </td>
                    </tr>
                  </tbody>
                );
              })}
          </table>
        </div>
        <div className="flex justify-end">
          <Button
            label="企業を追加"
            onClick={onClickAddCompany}
            className="mt-4"
          />
        </div>
      </Suspense>
    </>
  );
};

export default Home;
