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
  fileName: string;
  data: string;
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
}

export interface Fundamental {
  company_name: string;
  liabilities: number;
  net_assets: number;
  operating_profit: number;
  sales: number;
  period_start: string;
  period_end: string;
}
