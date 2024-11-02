import { Suspense, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  BsJson,
  CfJson,
  Company,
  Fundamental,
  ReportData,
  ReportDataWithPeriod,
  ReportType,
  Sort,
} from "../types/types";
import api from "../api/axiosConfig";
import { AxiosResponse } from "axios";
import {
  getJwtFromCookie,
  getPeriodsFromFileName,
  getReportsWithPeriod,
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
import NoSummary from "./NoSummary";
import SummaryTitle from "./SummaryTitle";
import DisclosureSummary from "./DisclosureSummary";
import DataTypeIcon from "./DataTypeIcon";

const CompanyDetail = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const paths = location.pathname.split("/");
  const lastPath = paths.pop();
  const showAllData = lastPath === "all";

  const [company, setCompany] = useState<Company>();
  const { companyId } = useParams();
  const [admin, setAdmin] = useState<boolean>(false);
  // BS
  const [bsHtmls, setBsHtmls] = useState<ReportDataWithPeriod[]>([]);
  const [latestBsHtml, setLatestBsHtml] = useState<ReportData>();
  const [bsJsons, setBsJsons] = useState<ReportDataWithPeriod[]>([]);
  const [latestBsJson, setLatestBsJson] = useState<ReportData>();
  const [latestBsPeriodStart, setLatestBsPeriodStart] = useState<string>();
  const [latestBsPeriodEnd, setLatestBsPeriodEnd] = useState<string>();

  // PL
  const [plHtmls, setPlHtmls] = useState<ReportDataWithPeriod[]>([]);
  const [latestPlHtml, setLatestPlHtml] = useState<ReportData>();
  const [plJsons, setPlJsons] = useState<ReportDataWithPeriod[]>([]);
  const [latestPlJson, setLatestPlJson] = useState<ReportData>();
  const [latestPlPeriodStart, setLatestPlPeriodStart] = useState<string>();
  const [latestPlPeriodEnd, setLatestPlPeriodEnd] = useState<string>();
  // CF
  const [cfHtmls, setCfHtmls] = useState<ReportDataWithPeriod[]>([]);
  const [latestCfHtml, setLatestCfHtml] = useState<ReportData>();
  const [cfJsons, setCfJsons] = useState<ReportDataWithPeriod[]>([]);
  const [latestCfJson, setLatestCfJson] = useState<ReportData>();
  const [cfUnitStr, setCfUnitStr] = useState<string>("");
  // Fundamental
  const [fundamentals, setFundamentals] = useState<Fundamental[]>([]);
  const [hasOperatingRevenueAndCost, setHasOperatingRevenueAndCost] =
    useState<boolean>(false);

  const [unitStr, setUnitStr] = useState<string>("");

  useEffect(() => {
    getCompany();
    // authenticateUser();
  }, []);

  useEffect(() => {
    if (company) {
      // BS
      getHtmlReports(company, "BS", setBsHtmls, setLatestBsHtml);
      getJsonReports(company, "BS", setBsJsons, setLatestBsJson);
      // PL
      getHtmlReports(company, "PL", setPlHtmls, setLatestPlHtml);
      getJsonReports(company, "PL", setPlJsons, setLatestPlJson);
      // CF
      getHtmlReports(company, "CF", setCfHtmls, setLatestCfHtml);
      getJsonReports(company, "CF", setCfJsons, setLatestCfJson);
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

  const getHtmlReports = async (
    company: Company,
    reportType: string,
    setAllCallback: (reports: ReportDataWithPeriod[]) => void,
    setEachCallback: (report: ReportData) => void
  ) => {
    const result = await getReports(company, reportType, "html");
    // console.log(`${reportType} HTMLs: ${result} (${result.length} 件)`);

    if (result && result.length > 0) {
      const reports = result;
      const sortedReports = sortFile(reports);

      if (sortedReports && sortedReports.length) {
        const reportsWithPeriod = getReportsWithPeriod(sortedReports);
        setAllCallback(reportsWithPeriod);
      }

      const latest = sortedReports.pop();
      if (latest) {
        setEachCallback(latest);
      }
    }
  };

  const getJsonReports = async (
    company: Company,
    reportType: string,
    setAllCallback: (reports: ReportDataWithPeriod[]) => void,
    setEachCallback: (report: ReportData) => void,
    sort?: Sort
  ) => {
    const reports = await getReports(company, reportType, "json");

    if (reports && reports.length > 0) {
      const uniqueReports = removeDuplicates(reports);
      const sortedReports = sortFile(uniqueReports, sort);

      if (sortedReports && sortedReports.length) {
        const reportsWithPeriod = getReportsWithPeriod(sortedReports);
        setAllCallback(reportsWithPeriod);
      }

      const latest = sortedReports.pop();
      if (latest) {
        setEachCallback(latest);

        if (reportType === "CF" && latest.data) {
          const cfJson: CfJson = JSON.parse(latest.data);
          setCfUnitStr(cfJson.unit_string);
        }

        const periods = getPeriodsFromFileName(latest.file_name);
        if (periods && periods.length >= 2) {
          if (reportType === "BS") {
            setLatestBsPeriodStart(periods[0]);
            setLatestBsPeriodEnd(periods[1]);

            if (latest.data) {
              const bsJson: BsJson = JSON.parse(latest.data);
              setUnitStr(bsJson.unit_string);
            }
          } else if (reportType === "PL") {
            setLatestPlPeriodStart(periods[0]);
            setLatestPlPeriodEnd(periods[1]);
          }
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

          const hasOperatingRevenueAndCost = fundamentals.some(
            (data) => data.has_operating_revenue && data.has_operating_cost
          );
          setHasOperatingRevenueAndCost(hasOperatingRevenueAndCost);
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
    navigate(-1);
  };

  const ArrangedSummary = (
    reports: ReportDataWithPeriod[],
    reportType: ReportType
  ) => {
    if (reports && reports.length >= 2 && showAllData) {
      return (
        <div className="block">
          {reports?.map((report) => (
            <>
              {reportType === "BS" ? (
                <BsSummary
                  reportData={report}
                  periodStart={report.periodStart}
                  periodEnd={report.periodEnd}
                />
              ) : (
                <PlSummary
                  reportData={report}
                  periodStart={report.periodStart}
                  periodEnd={report.periodEnd}
                />
              )}
            </>
          ))}
        </div>
      );
    } else if (latestBsJson && latestBsHtml && reportType === "BS") {
      return (
        <BsSummary
          reportData={latestBsJson}
          periodStart={latestBsPeriodStart}
          periodEnd={latestBsPeriodEnd}
        />
      );
    } else if (latestPlJson && latestPlHtml && reportType === "PL") {
      return (
        <PlSummary
          reportData={latestPlJson}
          periodStart={latestPlPeriodStart}
          periodEnd={latestPlPeriodEnd}
        />
      );
    } else if (reportType === "BS") {
      return (
        <NoSummary reportType="貸借対照表" disablePeriod={true} noData={true} />
      );
    } else {
      return (
        <NoSummary reportType="損益計算書" disablePeriod={true} noData={true} />
      );
    }
  };

  const TitleEl = (report: ReportData): JSX.Element => {
    let periodStr = "";
    const periods = getPeriodsFromFileName(report.file_name);
    if (periods && periods.length >= 2) {
      const start = periods[0];
      const end = periods[1];
      periodStr = `${start} ~ ${end}`;
    }

    return <SummaryTitle title={periodStr} disablePeriod={true} />;
  };

  const MainEl = (report: ReportData): JSX.Element => {
    return (
      <div className="flex justify-center">
        <div dangerouslySetInnerHTML={{ __html: report.data }} />
      </div>
    );
  };

  const ArrangedHtml = (
    reports: ReportDataWithPeriod[],
    latestReport?: ReportData
  ) => {
    if (reports && reports.length >= 2 && showAllData) {
      return (
        <>
          {reports?.map((report) => {
            return (
              <div className="mb-8">
                <DisclosureSummary
                  SummaryTitle={TitleEl(report)}
                  Main={MainEl(report)}
                ></DisclosureSummary>
              </div>
            );
          })}
        </>
      );
    } else if (latestReport && latestReport.data) {
      return (
        <div className="mb-8">
          <DisclosureSummary
            SummaryTitle={TitleEl(latestReport)}
            Main={MainEl(latestReport)}
          ></DisclosureSummary>
        </div>
      );
    } else {
      return <div className="text-center">該当データなし</div>;
    }
  };

  const goToAll = () => {
    navigate(`/company/${companyId}/all`);
  };

  return (
    <div className="mb-20">
      <div className="flex justify-between">
        <Button label="戻る" className="border-[1px]" onClick={goBack} />
        {!showAllData && (
          <Button
            label="全データを見る"
            className="border-[1px]"
            onClick={goToAll}
          />
        )}
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        {!showAllData && (
          <div className="w-fit mx-auto mt-4">
            <DataTypeIcon text="最新データ" />
          </div>
        )}
        <div className="mt-4 text-center">{company?.name}</div>
        <TitleMarker title="比例縮尺図" />
        <div className="xl:flex xl:justify-between sm:w-full xl:w-[50%]">
          <div className="sm:flex sm:justify-center sm:w-full mx-auto xl:ml-[20%] xl:w-[600px]">
            {/* 比例縮尺図コンポーネント */}
            {ArrangedSummary(bsJsons, "BS")}
            {ArrangedSummary(plJsons, "PL")}
          </div>

          <div>
            {fundamentals && fundamentals.length > 0 && (
              <div className="xl:mx-[30%]">
                {!hasOperatingRevenueAndCost && (
                  // 売上高営業利益率
                  <>
                    <TitleMarker title="売上高営業利益率" />
                    <SalesProfit
                      fundamentals={fundamentals}
                      unitStr={unitStr}
                    />
                  </>
                )}
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
          {/* 貸借対照表 */}
          <TitleMarker title="貸借対照表" />
          {ArrangedHtml(bsHtmls, latestBsHtml)}
          {/* 損益計算書 */}
          <TitleMarker title="損益計算書" />
          {ArrangedHtml(plHtmls, latestPlHtml)}
          {/* CF計算書 */}
          <TitleMarker title="キャッシュ・フロー計算書" />
          {ArrangedHtml(cfHtmls, latestCfHtml)}
        </div>
      </Suspense>
    </div>
  );
};

export default CompanyDetail;
