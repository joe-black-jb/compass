import { Suspense, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  BsJson,
  CfJson,
  Company,
  Fundamental,
  ReportData,
  ReportDataWithPeriod,
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

const CompanyDetail = () => {
  const navigate = useNavigate();

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
  const [cfHtmls, setCfHtmls] = useState<ReportData[]>([]);
  const [latestCfHtml, setLatestCfHtml] = useState<ReportData>();
  const [cfJsons, setCfJsons] = useState<ReportData[]>([]);
  const [latestCfJson, setLatestCfJson] = useState<ReportData>();
  const [cfPeriodStrs, setCfPeriodStrs] = useState<string[]>([]);
  const [cfUnitStr, setCfUnitStr] = useState<string>("");
  // Fundamental
  const [fundamentals, setFundamentals] = useState<Fundamental[]>([]);
  const [hasOperatingRevenueAndCost, setHasOperatingRevenueAndCost] =
    useState<boolean>(false);

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
      getHtmlReports(company, "BS");
      getJsonReports(company, "BS");
      // PL
      getHtmlReports(company, "PL");
      getJsonReports(company, "PL");
      // CF
      getHtmlReports(company, "CF");
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

  const getHtmlReports = async (company: Company, reportType: string) => {
    const result = await getReports(company, reportType, "html");
    if (result && result.length > 0) {
      const reports = result;
      const sortedReports = sortFile(reports);
      const latest = sortedReports.pop();
      if (latest) {
        if (reportType === "BS") {
          setLatestBsHtml(latest);
        } else if (reportType === "PL") {
          setLatestPlHtml(latest);
        } else if (reportType === "CF") {
          setLatestCfHtml(latest);
        }
      }

      if (sortedReports && sortedReports.length) {
        const reportsWithPeriod = getReportsWithPeriod(sortedReports);
        if (reportType === "BS") {
          setBsHtmls(reportsWithPeriod);
        } else if (reportType === "PL") {
          setPlHtmls(reportsWithPeriod);
        } else if (reportType === "CF") {
          setCfHtmls(sortedReports);
        }
      }
    }
  };

  const getJsonReports = async (company: Company, reportType: string) => {
    const reports = await getReports(company, reportType, "json");

    if (reports && reports.length > 0) {
      const uniqueReports = removeDuplicates(reports);
      const sortedReports = sortFile(uniqueReports, "desc");
      const latest = sortedReports.pop();
      if (latest) {
        if (reportType === "BS") {
          setLatestBsJson(latest);
        } else if (reportType === "PL") {
          setLatestPlJson(latest);
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

      if (sortedReports && sortedReports.length) {
        const reportsWithPeriod = getReportsWithPeriod(sortedReports);

        if (reportType === "BS") {
          setBsJsons(reportsWithPeriod);
        } else if (reportType === "PL") {
          setPlJsons(reportsWithPeriod);
        }
      }
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
    navigate("/");
  };

  const ArrangedBsSummary = () => {
    if (bsJsons && bsJsons.length >= 2) {
      return (
        <div className="block">
          {bsJsons?.map((bs) => (
            <BsSummary
              reportData={bs}
              periodStart={bs.periodStart}
              periodEnd={bs.periodEnd}
            />
          ))}
        </div>
      );
    } else if (latestBsJson && latestBsHtml) {
      return (
        <BsSummary
          reportData={latestBsJson}
          periodStart={latestBsPeriodStart}
          periodEnd={latestBsPeriodEnd}
        />
      );
    } else {
      return <NoSummary reportType="貸借対照表" />;
    }
  };

  const ArrangedPlSummary = () => {
    if (plJsons && plJsons.length >= 2) {
      return (
        <div className="block">
          {plJsons?.map((pl) => (
            <PlSummary
              reportData={pl}
              periodStart={pl.periodStart}
              periodEnd={pl.periodEnd}
            />
          ))}
        </div>
      );
    } else if (latestPlJson && latestPlHtml) {
      return (
        <PlSummary
          reportData={latestPlJson}
          periodStart={latestPlPeriodStart}
          periodEnd={latestPlPeriodEnd}
        />
      );
    } else {
      return <NoSummary reportType="損益計算書" />;
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

  // ここに個々のHTMLを設置
  const MainEl = (report: ReportData): JSX.Element => {
    return (
      <div className="flex justify-center">
        <div dangerouslySetInnerHTML={{ __html: report.data }} />
      </div>
    );
  };

  const ArrangedBsHtml = () => {
    // 2件以上
    if (bsHtmls && bsHtmls.length >= 2) {
      return (
        <>
          {bsHtmls?.map((report) => {
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
    } else if (latestBsHtml && latestBsHtml.data) {
      return (
        <div className="mb-8">
          <DisclosureSummary
            SummaryTitle={TitleEl(latestBsHtml)}
            Main={MainEl(latestBsHtml)}
          ></DisclosureSummary>
        </div>
      );
    } else {
      return <div>該当データなし</div>;
    }
  };

  const ArrangedPlHtml = () => {
    if (plHtmls && plHtmls.length >= 2) {
      return (
        <>
          {plHtmls?.map((report) => {
            return (
              <div className="mb-8">
                <DisclosureSummary
                  SummaryTitle={TitleEl(report)}
                  Main={MainEl(report)}
                />
              </div>
            );
          })}
        </>
      );
    } else if (latestPlHtml && latestPlHtml.data) {
      return (
        <div className="mb-8">
          <DisclosureSummary
            SummaryTitle={TitleEl(latestPlHtml)}
            Main={MainEl(latestPlHtml)}
          ></DisclosureSummary>
        </div>
      );
    } else {
      return <div>該当データなし</div>;
    }
  };

  // TODO: ArrangedBsHtml と ArrangedPlHtml を関数化

  return (
    <div className="mb-20">
      <div className="flex justify-between">
        <Button label="戻る" className="border-[1px]" onClick={goBack} />
        {/* <Button
          label="異なる年度のデータ"
          className="border-[1px]"
          onClick={goOther}
        /> */}
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="mt-4 text-center">{company?.name}</div>
        <TitleMarker title="比例縮尺図" />
        <div className="xl:flex xl:justify-between sm:w-full xl:w-[50%]">
          <div className="sm:flex sm:justify-center sm:w-full mx-auto xl:ml-[20%] xl:w-[600px]">
            {/* 比例縮尺図コンポーネント */}
            <ArrangedBsSummary />
            <ArrangedPlSummary />
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
          <TitleMarker title="貸借対照表" />
          <ArrangedBsHtml />
          <TitleMarker title="損益計算書" />
          <ArrangedPlHtml />
          {latestCfHtml && latestCfHtml.data && (
            <div className="xl:mr-8">
              <TitleMarker title="キャッシュ・フロー計算書" />
              <div className="flex justify-center">
                <div dangerouslySetInnerHTML={{ __html: latestCfHtml.data }} />
              </div>
            </div>
          )}
        </div>
      </Suspense>
    </div>
  );
};

export default CompanyDetail;
