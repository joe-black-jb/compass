import { Suspense, useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { Company } from "../types/types";
import { Link } from "react-router-dom";

const Home = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  useEffect(() => {
    getCompanies();
  }, []);
  const getCompanies = () => {
    api
      .get("/companies")
      .then((result) => {
        console.log("result: ", result);
        const companies = result.data;
        setCompanies(companies);
      })
      .catch((e) => {
        console.log("エラー: ", e);
      });
  };

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-700">
            <thead className="text-xs text-gray-700 uppercase font-bold">
              <tr className="border-b border-gray-700">
                <th scope="col" className="px-6 py-3">
                  企業名
                </th>
                <th scope="col" className="px-6 py-3">
                  創業
                </th>
                <th scope="col" className="px-6 py-3">
                  資本金（百万）
                </th>
              </tr>
            </thead>
            {companies.length > 0 &&
              companies.map((company) => {
                return (
                  <tbody key={company.ID}>
                    <tr className="border-b border-gray-700">
                      <td
                        // scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        <div className="flex justify-between items-center">
                          <Link
                            to={`company/${company.ID.toString()}`}
                            className="hover:text-blue-500 hover:underline"
                          >
                            {company.Name}
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {company.Established || "N/A"}
                      </td>
                      <td className="px-6 py-4">{company.Capital || "N/A"}</td>
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
