export interface Title {
  Category: string;
  CompanyID: number;
  CreatedAt: string;
  DeletedAt?: string;
  Depth: number;
  FiscalYear: number;
  HasValue: boolean;
  ID: number;
  Name: string;
  StatementType: number;
  UpdatedAt: string;
  Value?: string;
  order: number;
  parent_title_id: number;
}

export interface Company {
  id: string;
  name: string;
  edinetCode: string;
  bs: number;
  pl: number;
  createdAt: string;
  updatedAt: string;
}

// export interface Value {
//   Name: string;
//   Value: string;
//   Depth: number;
//   parent_title_id: number;
// }

export interface TitleByDepth {
  [key: number]: Title[];
}

export interface TitleFamily {
  parent: string;
  child: Title[];
}

export interface ValueObj {
  titleId: string;
  value: string;
}

export interface ModalStatus {
  status: string;
  isOpen: boolean;
  goTo?: string;
  company?: Company;
}

export interface PostTitleBody {
  Name: string;
  Category: string;
  ParentTitleID?: number;
  CompanyID: number;
  Value?: string;
  HasValue?: boolean;
  Depth?: number;
}

export interface UpdateTitleBody {
  Name?: string;
  Category?: string;
  ParentTitleID?: number;
  CompanyID?: number;
  Value?: string;
  HasValue?: boolean;
  Depth?: number;
}

export type ResultModalStatus = "OK" | "NG";

export type Method = "GET" | "POST" | "PUT" | "DELETE" | "NONE";

export interface Login {
  Username: string;
  Token: string;
}

export interface ReportData {
  file_name: string;
  data: string;
}

export interface ReportDataWithPeriod extends ReportData {
  periodStart: string;
  periodEnd: string;
}

export interface Period {
  previous: number;
  current: number;
}

export interface BsJson {
  company_name: string;
  period_start: string;
  period_end: string;
  unit_string: string;
  current_assets: Period;
  tangible_assets: Period;
  intangible_assets: Period;
  investments_and_other_assets: Period;
  current_liabilities: Period;
  fixed_liabilities: Period;
  net_assets: Period;
}

// 項目名、値、% が欲しい
export interface TitleData {
  titleName: string;
  value: number;
  ratio: number;
  color: string;
}

export interface PlJson {
  company_name: string;
  period_start: string;
  period_end: string;
  unit_string: string;
  cost_of_goods_sold: Period;
  sg_and_a: Period;
  sales: Period;
  operating_profit: Period;
  operating_revenue: Period;
  has_operating_revenue: boolean;
  operating_cost: Period;
  has_operating_cost: boolean;
}

export interface CfJson {
  company_name: string;
  period_start: string;
  period_end: string;
  unit_string: string;
  operating_cf: Period;
  investing_cf: Period;
  financing_cf: Period;
  free_cf: Period;
  start_cash: Period;
  end_cash: Period;
}

export interface BsSummaryHeightClass {
  currentAssetsHeightClass: string;
  tangibleAssetsHeightClass: string;
  intangibleAssetsHeightClass: string;
  investmentsAndOtherAssetsHeightClass: string;
  currentLiabilitiesHeightClass: string;
  fixedLiabilitiesHeightClass: string;
  netAssetsHeightClass: string;
}

export interface PlSummaryHeightClass {
  costOfGoodsSoldHeightClass: string;
  sgAndAHeightClass: string;
  salesHeightClass: string;
  operatingProfitHeightClass: string;
  operatingRevenueHeightClass: string;
  operatingCostHeightClass: string;
}

export interface Fundamental {
  company_name: string;
  liabilities: number;
  net_assets: number;
  operating_profit: number;
  operating_revenue: number;
  has_operating_revenue: boolean;
  operating_cost: number;
  has_operating_cost: boolean;
  sales: number;
  period_start: string;
  period_end: string;
}

export interface TitleValue {
  title: string;
  value: string;
  color?: string;
}

export type ChartTitle = "SalesProfit" | "Capital" | "CashFlow";

export type ReportType = "BS" | "PL" | "CF";

export type Sort = "asc" | "desc";
