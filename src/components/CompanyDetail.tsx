import { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";

import {
  BsJson,
  BsSummaryHeightClass,
  Company,
  Fundamental,
  PlJson,
  ReportData,
  Title,
} from "../types/types";
import api from "../api/axiosConfig";
import { AxiosResponse } from "axios";
import { getHeightClass, getJwtFromCookie, getRatio } from "../utils/funcs";
import { authUser } from "../utils/apis";
import BsSummary from "./BsSummary";
import PlSummary from "./PlSummary";
import { log } from "console";
import SalesProfit from "./SalesProfit";

const CompanyDetail = () => {
  const [company, setCompany] = useState<Company>();
  const { companyId } = useParams();
  const [admin, setAdmin] = useState<boolean>(false);
  const [latestBsHtml, setLatestBsHtml] = useState<string>();
  const [latestPlHtml, setLatestPlHtml] = useState<string>();
  const [latestBsJson, setLatestBsJson] = useState<BsJson>();
  const [latestPlJson, setLatestPlJson] = useState<PlJson>();
  const [fundamentals, setFundamentals] = useState<Fundamental[]>([]);

  useEffect(() => {
    getCompany();
    // authenticateUser();
  }, []);

  useEffect(() => {
    if (company) {
      getBsHtmlReports(company);
      getPlHtmlReports(company);
      getBsJsonReports(company);
      getPlJsonReports(company);
      getFundamentals(company);
    }
  }, [company]);

  const getCompany = () => {
    api.get(`/company/${companyId}`).then((result: AxiosResponse) => {
      if (result.data) {
        setCompany(result.data);
      }
    });
  };

  const getBsHtmlReports = async (company: Company) => {
    const reports: ReportData[] = await getReports(company, "BS", "html");
    if (reports && reports.length > 0) {
      let data = reports[0].data;
      setLatestBsHtml(data);
    }
  };

  const getPlHtmlReports = async (company: Company) => {
    const reports: ReportData[] = await getReports(company, "PL", "html");
    if (reports && reports.length > 0) {
      const data = reports[0].data;
      setLatestPlHtml(data);
    }
  };

  const getBsJsonReports = async (company: Company) => {
    const reports: ReportData[] = await getReports(company, "BS", "json");
    if (reports && reports.length > 0) {
      const data = reports[0].data;
      const bsJson: BsJson = JSON.parse(data);
      setLatestBsJson(bsJson);
    }
  };

  const getPlJsonReports = async (company: Company) => {
    const reports: ReportData[] = await getReports(company, "PL", "json");
    if (reports && reports.length > 0) {
      const data = reports[0].data;
      const plJson: PlJson = JSON.parse(data);
      setLatestPlJson(plJson);
    }
  };

  const getReports = async (
    company: Company,
    reportType: string,
    extension: string
  ): Promise<ReportData[]> => {
    const reports = await api.get(`/reports`, {
      params: {
        EDINETCode: company?.edinetCode,
        reportType,
        extension,
      },
    });
    return reports.data as ReportData[];
  };

  const getFundamentals = async (company: Company) => {
    api
      .get("/fundamentals", {
        params: {
          EDINETCode: company.edinetCode,
          periodStart: 2017,
        },
      })
      .then((res) => {
        const fundamentals = res.data as Fundamental[];
        setFundamentals(fundamentals);
      });
  };

  console.log("fundamentals: ", fundamentals);

  // console.log("BsJson: ", latestBsJson);
  // console.log("BsJson.tangible_assets: ", latestBsJson?.tangible_assets);
  // console.log("PlJson: ", latestPlJson);

  const authenticateUser = async () => {
    const jwt = getJwtFromCookie();

    if (jwt) {
      // 認証
      const isAdmin = await authUser(jwt);
      if (isAdmin) {
        setAdmin(true);
      }
    }
  };

  if (latestBsHtml) {
    const parsedHtml = parse(latestBsHtml);
    // console.log("parseしたHTML ⭐️: ", parsedHtml);
  }

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <div>{company?.name}</div>
        <div className="mt-4">【比例縮尺図】</div>
        <div className="lg:flex">
          {/* 比例縮尺図コンポーネント (BS) */}
          {latestBsJson && <BsSummary data={latestBsJson} />}
          {/* 比例縮尺図コンポーネント (PL) */}
          {latestPlJson && <PlSummary data={latestPlJson} />}
        </div>

        {/* 主要な指標 (売上高、営業利益率、売上高営業利益率など) => 5年分くらい欲しい*/}
        <SalesProfit fundamentals={fundamentals} />

        {/* dangerouslySetInnerHTML を使って HTML をレンダリング */}
        {latestBsHtml && (
          <div
            className="w-1/2"
            dangerouslySetInnerHTML={{ __html: latestBsHtml }}
          />
        )}
        {latestPlHtml && (
          <div dangerouslySetInnerHTML={{ __html: latestPlHtml }} />
        )}
      </Suspense>
    </>
  );
};

export default CompanyDetail;
