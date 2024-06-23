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
  CreatedAt: string;
  ID: number;
  Name: string;
  Titles?: Title[] | null;
  UpdatedAt: string;
  Established: string | null;
  Capital: string | null;
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
