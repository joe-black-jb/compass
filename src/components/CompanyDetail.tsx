import { Suspense, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  BsJson,
  CfJson,
  Company,
  Fundamental,
  ReportData,
} from "../types/types";
import api from "../api/axiosConfig";
import { AxiosResponse } from "axios";
import {
  getJwtFromCookie,
  getPeriodsFromFileName,
  removeDuplicates,
  sortFile,
  sortFundamentals,
} from "../utils/funcs";
import { authUser } from "../utils/apis";
import BsSummary from "./BsSummary";
import PlSummary from "./PlSummary";
import SalesProfit from "./SalesProfit";
import Capital from "./Capital";
import CashFlow from "./CashFlow";
import TitleMarker from "./TitleMarker";
import Button from "./Button";

// NOTE: ラクスル が 2024 October で処理できて資料が揃ってる
// TODO: 2つの企業の比較機能
// TODO: 業界ごとの営業利益率などの平均を出す => バックエンドで業界をタグづけしておく必要あり
// TODO: グレイステクノロジー株式会社 が複数ある => 年次ごとの表示のテストに使える
// TODO: サマリーの単位表示

const CompanyDetail = () => {
  const navigate = useNavigate();

  const [company, setCompany] = useState<Company>();
  const { companyId } = useParams();
  const [admin, setAdmin] = useState<boolean>(false);
  // BS
  const [bsHtmls, setBsHtmls] = useState<ReportData[]>([]);
  const [latestBsHtml, setLatestBsHtml] = useState<ReportData>();
  const [bsJsons, setBsJsons] = useState<ReportData[]>([]);
  const [latestBsJson, setLatestBsJson] = useState<ReportData>();
  const [latestBsPeriodStart, setLatestBsPeriodStart] = useState<string>();
  const [latestBsPeriodEnd, setLatestBsPeriodEnd] = useState<string>();

  // PL
  const [plHtmls, setPlHtmls] = useState<ReportData[]>([]);
  const [latestPlHtml, setLatestPlHtml] = useState<ReportData>();
  const [plJsons, setPlJsons] = useState<ReportData[]>([]);
  const [latestPlJson, setLatestPlJson] = useState<ReportData>();
  const [latestPlPeriodStart, setLatestPlPeriodStart] = useState<string>();
  const [latestPlPeriodEnd, setLatestPlPeriodEnd] = useState<string>();
  // CF
  const [cfHtmls, setCfHtmls] = useState<ReportData[]>([]);
  const [latestCfHtml, setLatestCfHtml] = useState<ReportData>();
  const [cfJsons, setCfJsons] = useState<ReportData[]>([]);
  const [latestCfJson, setLatestCfJson] = useState<ReportData>();
  const [cfPeriodStrs, setCfPeriodStrs] = useState<string[]>([]);
  const [cfUnitStr, setCfUnitStr] = useState<string>("");
  // Fundamental
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
      // BS
      getBsHtmlReports(company);
      getBsJsonReports(company);
      // PL
      getPlHtmlReports(company);
      getPlJsonReports(company);
      // CF
      getCfHtmlReports(company);
      getCfJsonReports(company);
      // Fundamental
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
    const result = await getReports(company, "BS", "html");
    if (result && result.length > 0) {
      const reports = result;
      const sortedReports = sortFile(reports);
      const latest = sortedReports.pop();
      if (latest) {
        setLatestBsHtml(latest);
      }
      setBsHtmls(sortedReports);
    }
  };

  const getBsJsonReports = async (company: Company) => {
    const reports = await getReports(company, "BS", "json");
    if (reports && reports.length > 0) {
      const uniqueReports = removeDuplicates(reports);
      const sortedReports = sortFile(uniqueReports);
      const latest = sortedReports.pop();
      if (latest) {
        setLatestBsJson(latest);
        const periods = getPeriodsFromFileName(latest.file_name);
        if (periods && periods.length >= 2) {
          const periodStr = `${periods[0]} ~ ${periods[1]}`;
          setLatestBsPeriodStart(periods[0]);
          setLatestBsPeriodEnd(periods[1]);
        }
        if (latest.data) {
          const bsJson: BsJson = JSON.parse(latest.data);
          setUnitStr(bsJson.unit_string);
        }
      }
      setBsJsons(sortedReports);
    }
  };

  const getPlHtmlReports = async (company: Company) => {
    const reports = await getReports(company, "PL", "html");
    if (reports && reports.length > 0) {
      const sortedReports = sortFile(reports);
      const latest = sortedReports.pop();
      if (latest) {
        setLatestPlHtml(latest);
      }
      setPlHtmls(sortedReports);
    }
  };

  const getPlJsonReports = async (company: Company) => {
    const reports = await getReports(company, "PL", "json");
    if (reports && reports.length > 0) {
      const sortedReports = sortFile(reports);
      const latest = sortedReports.pop();
      if (latest) {
        setLatestPlJson(latest);
        const periods = getPeriodsFromFileName(latest.file_name);
        if (periods && periods.length >= 2) {
          setLatestPlPeriodStart(periods[0]);
          setLatestPlPeriodEnd(periods[1]);
        }
      }
      setPlJsons(sortedReports);
    }
  };

  const getCfHtmlReports = async (company: Company) => {
    const reports: ReportData[] = await getReports(company, "CF", "html");
    if (reports && reports.length > 0) {
      const sortedReports = sortFile(reports);
      const latest = sortedReports.pop();
      if (latest) {
        setLatestCfHtml(latest);
      }
      setCfHtmls(sortedReports);
    }
  };

  const getCfJsonReports = async (company: Company) => {
    const reports = await getReports(company, "CF", "json");
    if (reports && reports.length > 0) {
      const unique = removeDuplicates(reports);
      const sortedReports = sortFile(unique);
      setCfJsons(sortedReports);
      const latest = sortedReports[0];
      if (latest && latest.data) {
        const cfJson: CfJson = JSON.parse(latest.data);
        if (cfJson.unit_string && !cfUnitStr) {
          setCfUnitStr(cfJson.unit_string);
        }
      }
    }
  };

  const getReports = async (
    company: Company,
    reportType: string,
    extension: string
  ): Promise<ReportData[]> => {
    const result = await api.get(`/reports`, {
      params: {
        EDINETCode: company?.edinetCode,
        reportType,
        extension,
      },
    });

    const reports = result.data as ReportData[];
    return reports;
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
          const sortedFundamentals = sortFundamentals(fundamentals);
          setFundamentals(sortedFundamentals);
        }
      });
  };

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

  const goBack = () => {
    console.log("go back");
    navigate("/");
  };

  // NOTE: AHC が CF ある

  return (
    <div className="mb-20">
      <Button label="戻る" className="border-[1px]" onClick={goBack} />
      <Suspense fallback={<div>Loading...</div>}>
        <div className="text-center">{company?.name}</div>
        <TitleMarker title="比例縮尺図" />
        <div className="xl:flex xl:justify-between sm:w-full xl:w-[50%]">
          <div className="sm:flex sm:justify-center sm:w-full mx-auto xl:ml-[20%] xl:w-[600px]">
            {/* 比例縮尺図コンポーネント */}
            {latestBsJson && latestBsHtml && (
              <BsSummary
                reportData={latestBsJson}
                periodStart={latestBsPeriodStart}
                periodEnd={latestBsPeriodEnd}
              />
            )}
            {latestPlJson && (
              <PlSummary
                reportData={latestPlJson}
                periodStart={latestPlPeriodStart}
                periodEnd={latestPlPeriodEnd}
              />
            )}
          </div>

          <div>
            {fundamentals && fundamentals.length > 0 && (
              <div className="xl:mx-[30%]">
                {/* 売上高営業利益率 */}
                <TitleMarker title="売上高営業利益率" />
                <SalesProfit fundamentals={fundamentals} unitStr={unitStr} />
                {/* 自己資本比率 */}
                <TitleMarker title="自己資本比率" />
                <Capital fundamentals={fundamentals} unitStr={unitStr} />
              </div>
            )}
            {cfJsons && cfJsons.length > 0 && (
              <div className="xl:mx-[30%]">
                {/* CF計算書 */}
                <TitleMarker title="CF計算書" />
                <CashFlow reportDataList={cfJsons} unitStr={cfUnitStr} />
              </div>
            )}
          </div>
        </div>

        {/* dangerouslySetInnerHTML を使って HTML をレンダリング */}
        <div className="xl:flex">
          {latestBsHtml && latestBsHtml.data && (
            <div
              className="xl:mr-8"
              dangerouslySetInnerHTML={{ __html: latestBsHtml.data }}
            />
          )}
          {latestPlHtml && latestPlHtml.data && (
            <div
              className="xl:mr-8"
              dangerouslySetInnerHTML={{ __html: latestPlHtml.data }}
            />
          )}
          {latestCfHtml && latestCfHtml.data && (
            <div dangerouslySetInnerHTML={{ __html: latestCfHtml.data }} />
          )}
        </div>
      </Suspense>
    </div>
  );
};

export default CompanyDetail;
