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
import {
  getHeightClass,
  getJwtFromCookie,
  getPeriodYear,
  getRatio,
} from "../utils/funcs";
import { authUser } from "../utils/apis";
import BsSummary from "./BsSummary";
import PlSummary from "./PlSummary";
import { log } from "console";
import SalesProfit from "./SalesProfit";
import Capital from "./Capital";

// TODO: 2つの企業の比較機能
// TODO: 業界ごとの営業利益率などの平均を出す => バックエンドで業界をタグづけしておく必要あり

const CompanyDetail = () => {
  const [company, setCompany] = useState<Company>();
  const { companyId } = useParams();
  const [admin, setAdmin] = useState<boolean>(false);
  const [latestBsHtml, setLatestBsHtml] = useState<string>();
  const [latestPlHtml, setLatestPlHtml] = useState<string>();
  const [latestBsJson, setLatestBsJson] = useState<BsJson>();
  const [latestPlJson, setLatestPlJson] = useState<PlJson>();
  const [fundamentals, setFundamentals] = useState<Fundamental[]>([]);
  const [periodStart, setPeriodStart] = useState<string>();
  const [periodEnd, setPeriodEnd] = useState<string>();
  const [unitStr, setUnitStr] = useState<string>("");

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
      if (bsJson.period_start && !periodStart) {
        setPeriodStart(bsJson.period_start);
      }
      if (bsJson.period_end && !periodEnd) {
        setPeriodEnd(bsJson.period_end);
      }
      if (bsJson.unit_string && !unitStr) {
        setUnitStr(bsJson.unit_string);
      }
    }
  };

  const getPlJsonReports = async (company: Company) => {
    const reports: ReportData[] = await getReports(company, "PL", "json");
    if (reports && reports.length > 0) {
      const data = reports[0].data;
      const plJson: PlJson = JSON.parse(data);
      setLatestPlJson(plJson);
      if (plJson.period_start && !periodStart) {
        setPeriodStart(plJson.period_start);
      }
      if (plJson.period_end && !periodEnd) {
        setPeriodEnd(plJson.period_end);
      }
      if (plJson.unit_string && !unitStr) {
        setUnitStr(plJson.unit_string);
      }
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
        if (fundamentals && fundamentals.length > 0) {
          fundamentals.sort((a, b) => {
            const periodStartA = getPeriodYear(a.period_start);
            const periodStartB = getPeriodYear(b.period_start);

            // ダイオーズが複数ある
            // // 降順
            // return periodStartB - periodStartA;
            // 昇順
            return periodStartA - periodStartB;
          });
          setFundamentals(fundamentals);
        }
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
        {(latestBsJson || latestPlJson) && (
          <div className="mt-4">
            【比例縮尺図 ({periodStart} ~ {periodEnd})】
          </div>
        )}
        <div className="xl:flex w-full">
          <div className="flex justify-center w-full">
            {/* 比例縮尺図コンポーネント */}
            {latestBsJson && <BsSummary data={latestBsJson} />}
            {latestPlJson && <PlSummary data={latestPlJson} />}
          </div>

          <div>
            {fundamentals && fundamentals.length > 0 && (
              <div>
                {/* 売上高営業利益率 */}
                <SalesProfit fundamentals={fundamentals} unitStr={unitStr} />
                {/* 自己資本比率 */}
                <Capital fundamentals={fundamentals} unitStr={unitStr} />
              </div>
            )}
          </div>
        </div>

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
