import { useEffect, useState } from "react";
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
import HomeIcon from "./HomeIcon";
import GoBackIcon from "./GoBackIcon";
import GoToTopButton from "./GoToTopButton";
import SummaryTitleSkelton from "./SummaryTitleSkelton";
import ChartSkelton from "./ChartSkelton";
import OneLineSummaryTitleSkelton from "./OneLineSummaryTitleSkelton";
import Stock from "./Stock";

const CompanyDetail = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const paths = location.pathname.split("/");
  const lastPath = paths.pop();
  const showAllData = lastPath === "all";

  const [company, setCompany] = useState<Company>();
  const { companyId } = useParams();
  const [admin, setAdmin] = useState<boolean>(false);

  // BS (HTML)
  const [bsHtmls, setBsHtmls] = useState<ReportDataWithPeriod[]>([]);
  const [latestBsHtml, setLatestBsHtml] = useState<ReportData>();
  const [bsHtmlsLoading, setBsHtmlsLoading] = useState<boolean>(true);
  const [latestBsHtmlLoading, setLatestBsHtmlLoading] = useState<boolean>(true);

  // BS (JSON)
  const [bsJsons, setBsJsons] = useState<ReportDataWithPeriod[]>([]);
  const [latestBsJson, setLatestBsJson] = useState<ReportData>();
  const [bsJsonsLoading, setBsJsonsLoading] = useState<boolean>(true);
  const [latestBsJsonLoading, setLatestBsJsonLoading] = useState<boolean>(true);
  const [latestBsPeriodStart, setLatestBsPeriodStart] = useState<string>();
  const [latestBsPeriodEnd, setLatestBsPeriodEnd] = useState<string>();

  // PL (HTML)
  const [plHtmls, setPlHtmls] = useState<ReportDataWithPeriod[]>([]);
  const [latestPlHtml, setLatestPlHtml] = useState<ReportData>();
  const [plHtmlsLoading, setPlHtmlsLoading] = useState<boolean>(true);
  const [latestPlHtmlLoading, setLatestPlHtmlLoading] = useState<boolean>(true);

  // PL (JSON)
  const [plJsons, setPlJsons] = useState<ReportDataWithPeriod[]>([]);
  const [latestPlJson, setLatestPlJson] = useState<ReportData>();
  const [plJsonsLoading, setPlJsonsLoading] = useState<boolean>(true);
  const [latestPlJsonLoading, setLatestPlJsonLoading] = useState<boolean>(true);
  const [latestPlPeriodStart, setLatestPlPeriodStart] = useState<string>();
  const [latestPlPeriodEnd, setLatestPlPeriodEnd] = useState<string>();

  // CF (HTML)
  const [cfHtmls, setCfHtmls] = useState<ReportDataWithPeriod[]>([]);
  const [latestCfHtml, setLatestCfHtml] = useState<ReportData>();
  const [cfHtmlsLoading, setCfHtmlsLoading] = useState<boolean>(true);
  const [latestCfHtmlLoading, setLatestCfHtmlLoading] = useState<boolean>(true);

  // CF (JSON)
  const [cfJsons, setCfJsons] = useState<ReportDataWithPeriod[]>([]);
  const [latestCfJson, setLatestCfJson] = useState<ReportData>();
  const [cfJsonsLoading, setCfJsonsLoading] = useState<boolean>(true);
  const [latestCfJsonLoading, setLatestCfJsonLoading] = useState<boolean>(true);
  const [cfUnitStr, setCfUnitStr] = useState<string>("");

  // Fundamental (only JSON)
  const [fundamentals, setFundamentals] = useState<Fundamental[]>([]);
  const [fundamentalsLoading, setFundamentalsLoading] = useState<boolean>(true);
  const [hasOperatingRevenueAndCost, setHasOperatingRevenueAndCost] =
    useState<boolean>(false);

  const [unitStr, setUnitStr] = useState<string>("");

  // Topに戻るボタン
  const [goToTopVisile, setGoToTopVisible] = useState<boolean>(false);

  // トップに戻るボタンの表示を制御する
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setGoToTopVisible(true);
    } else {
      setGoToTopVisible(false);
    }
  };

  useEffect(() => {
    setBsHtmlsLoading(true);
    getCompany();
    // authenticateUser();

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  useEffect(() => {
    if (company) {
      // BS
      getHtmlReports(
        company,
        "BS",
        setBsHtmls,
        setLatestBsHtml,
        setBsHtmlsLoading,
        setLatestBsHtmlLoading
      );
      getJsonReports(
        company,
        "BS",
        setBsJsons,
        setLatestBsJson,
        setBsJsonsLoading,
        setLatestBsJsonLoading
      );
      // PL
      getHtmlReports(
        company,
        "PL",
        setPlHtmls,
        setLatestPlHtml,
        setPlHtmlsLoading,
        setLatestPlHtmlLoading
      );
      getJsonReports(
        company,
        "PL",
        setPlJsons,
        setLatestPlJson,
        setPlJsonsLoading,
        setLatestPlJsonLoading
      );
      // CF
      getHtmlReports(
        company,
        "CF",
        setCfHtmls,
        setLatestCfHtml,
        setCfHtmlsLoading,
        setLatestCfHtmlLoading
      );
      getJsonReports(
        company,
        "CF",
        setCfJsons,
        setLatestCfJson,
        setCfJsonsLoading,
        setLatestCfJsonLoading
      );
      // Fundamental
      getFundamentals(company);
    }
  }, [company]);

  const loading =
    bsHtmlsLoading ||
    latestBsHtmlLoading ||
    bsJsonsLoading ||
    latestBsJsonLoading ||
    plHtmlsLoading ||
    latestPlHtmlLoading ||
    plJsonsLoading ||
    latestPlJsonLoading ||
    cfHtmlsLoading ||
    latestCfHtmlLoading ||
    cfJsonsLoading ||
    latestCfJsonLoading ||
    fundamentalsLoading;

  const getCompany = () => {
    api.get(`/private/company/${companyId}`).then((result: AxiosResponse) => {
      if (result.data) {
        setCompany(result.data);
      }
    });
  };

  const getHtmlReports = async (
    company: Company,
    reportType: string,
    setAllCallback: (reports: ReportDataWithPeriod[]) => void,
    setEachCallback: (report: ReportData) => void,
    setAllLoading: (isAllLoading: boolean) => void,
    setEachLoading: (isEachLoading: boolean) => void
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
    setAllLoading(false);
    setEachLoading(false);
  };

  const getJsonReports = async (
    company: Company,
    reportType: string,
    setAllCallback: (reports: ReportDataWithPeriod[]) => void,
    setEachCallback: (report: ReportData) => void,
    setAllLoading: (isAllLoading: boolean) => void,
    setEachLoading: (isEachLoading: boolean) => void,
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
    setAllLoading(false);
    setEachLoading(false);
  };

  const getReports = async (
    company: Company,
    reportType: string,
    extension: string
  ): Promise<ReportData[]> => {
    const result = await api.get(`/public/reports`, {
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
      .get("/public/fundamentals", {
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
    setFundamentalsLoading(false);
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
    if (loading) {
      return <SummaryTitleSkelton hasMargin={false} />;
    }
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

  const ArrangedSalesProfit = () => {
    if (loading) {
      return <ChartSkelton />;
    }

    if (
      fundamentals &&
      fundamentals.length > 0 &&
      !hasOperatingRevenueAndCost
    ) {
      return <SalesProfit fundamentals={fundamentals} unitStr={unitStr} />;
    }

    return <ChartSkelton noData={true} />;
  };

  const ArrangedCapital = () => {
    if (loading) {
      return <ChartSkelton />;
    }

    if (
      fundamentals &&
      fundamentals.length > 0 &&
      !hasOperatingRevenueAndCost
    ) {
      return <Capital fundamentals={fundamentals} unitStr={unitStr} />;
    }

    return <ChartSkelton noData={true} />;
  };

  const ArrangedCashFlow = () => {
    if (loading) {
      return <ChartSkelton />;
    }

    if (cfJsons && cfJsons.length) {
      return <CashFlow reportDataList={cfJsons} unitStr={cfUnitStr} />;
    }

    return <ChartSkelton noData={true} />;
  };

  const goToAll = () => {
    navigate(`/company/${companyId}/all`);
  };

  const goHome = () => {
    navigate("/");
  };

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // スムーズにスクロール
    });
  };

  return (
    <>
      {/* <div className="fixed left-0 top-10 pt-8 pb-4 px-[10%] w-full flex justify-between"></div> */}
      <div className="mb-[200px]">
        <div className="w-full mt-4 flex justify-between items-center">
          <div className="w-[50px]">
            {showAllData ? (
              <GoBackIcon onClick={goBack} />
            ) : (
              <HomeIcon onClick={goHome} />
            )}
          </div>
          <DataTypeIcon text={showAllData ? "全データ" : "最新データ"} />

          <div className="p-2 w-[50px]">
            {!showAllData && <Button label="All" onClick={goToAll} />}
          </div>
        </div>
        {/* 企業名 */}
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="mt-4 text-center bg-gray-100 rounded-lg animate-pulse w-[200px] h-[24px]"></div>
          </div>
        ) : (
          <div className="mt-4 text-center">{company?.name}</div>
        )}

        {/* 株価 */}
        <TitleMarker title="株価" />
        <Stock securityCode={company?.securityCode} />

        {/* 比例縮尺図 */}
        <TitleMarker title="比例縮尺図" />
        <div className="sm:w-full">
          <div className="sm:flex sm:justify-center sm:w-full mx-auto">
            {loading ? (
              <>
                <SummaryTitleSkelton hasMargin={false} />
                <SummaryTitleSkelton hasMargin={true} />
              </>
            ) : (
              <>
                {ArrangedSummary(bsJsons, "BS")}
                {ArrangedSummary(plJsons, "PL")}
              </>
            )}
          </div>

          {/* その他指標 */}
          <div>
            <>
              <TitleMarker title="売上高営業利益率" />
              {ArrangedSalesProfit()}
            </>
            <>
              <TitleMarker title="自己資本比率" />
              {ArrangedCapital()}
            </>
            <>
              <TitleMarker title="キャッシュフロー" />
              {ArrangedCashFlow()}
            </>
          </div>
        </div>

        {/* 財務三表 */}
        <div className="xl:flex xl:justify-between">
          <div className="md:w-[70%] md:mx-auto xl:mx-0 xl:w-1/3 xl:px-10">
            {/* 貸借対照表 */}
            <TitleMarker title="貸借対照表" />
            {loading ? (
              <div className="mb-8">
                <OneLineSummaryTitleSkelton />
              </div>
            ) : (
              ArrangedHtml(bsHtmls, latestBsHtml)
            )}
          </div>
          <div className="md:w-[70%] md:mx-auto xl:mx-0 xl:w-1/3 xl:px-10">
            {/* 損益計算書 */}
            <TitleMarker title="損益計算書" />
            {loading ? (
              <div className="mb-8">
                <OneLineSummaryTitleSkelton />
              </div>
            ) : (
              ArrangedHtml(plHtmls, latestPlHtml)
            )}
          </div>
          <div className="md:w-[70%] md:mx-auto xl:mx-0 xl:w-1/3 xl:px-10">
            {/* CF計算書 */}
            <TitleMarker title="キャッシュ・フロー計算書" />
            {loading ? (
              <div className="mb-8">
                <OneLineSummaryTitleSkelton />
              </div>
            ) : (
              ArrangedHtml(cfHtmls, latestCfHtml)
            )}
          </div>
        </div>

        {goToTopVisile && (
          <div className="fixed bottom-10 right-10">
            <GoToTopButton onClick={goToTop} />
          </div>
        )}
      </div>
    </>
  );
};

export default CompanyDetail;
