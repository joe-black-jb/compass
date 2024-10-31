import { ValueType } from "recharts/types/component/DefaultTooltipContent";
import {
  Fundamental,
  ReportData,
  Title,
  TitleByDepth,
  TitleFamily,
} from "../types/types";

/**
 * 同じ階層にある勘定項目ごとに整理した
 * @param titles - 資産、負債、純資産いずれかの勘定項目データが格納された配列
 * @returns - 階層ごとに区別された勘定項目データが格納されたオブジェクト
 */
export const getTitlesByDepth = (titles: Title[]): TitleByDepth => {
  const depths: string[] = [];
  const titlesByDepth: TitleByDepth = {};
  titles.forEach((title) => {
    const sameDepth = depths.find((depth) => depth === title.Depth.toString());
    if (!sameDepth) {
      depths.push(title.Depth.toString());
      titlesByDepth[title.Depth] = [title];
    } else {
      titlesByDepth[title.Depth].push(title);
    }
  });
  return titlesByDepth;
};

export const getTitlesFamily = (
  parents: Title[],
  children: Title[]
): TitleFamily[] => {
  const titleFamily: TitleFamily[] = [];
  parents.forEach((parent) => {
    let family: TitleFamily = {
      parent: "",
      child: [],
    };
    family.parent = parent.Name;
    const relatedChildTitles = children.filter(
      (child) => child.parent_title_id === parent.ID
    );
    relatedChildTitles.forEach((relatedChildTitle) => {
      family.child.push(relatedChildTitle);
    });
    titleFamily.push(family);
  });
  return titleFamily;
};

export const wait = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const classNames = (...classes: any) => {
  return classes.filter(Boolean).join(" ");
};

export const getJwtFromCookie = () => {
  const jwtFromCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("jwt="))
    ?.split("=")[1];
  return jwtFromCookie;
};

export const clearJwtFromCookie = () => {
  document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
};

export const getUsernameFromCookie = () => {
  const usernameFromCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("username="))
    ?.split("=")[1];
  return usernameFromCookie;
};

export const clearUsernameFromCookie = () => {
  document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
};

export const checkLoggedIn = (): boolean => {
  const jwt = getJwtFromCookie();
  if (jwt) {
    return true;
  }
  return false;
};

export const getRatio = (top: number, bottom: number): number => {
  return Math.floor((top / bottom) * 100);
};

export const getHeightClass = (num: number): string => {
  // return `h-[${num}%]`;
  return `${num}%`;
};

export const getPeriodYear = (periodStr: string): number => {
  const splitPeriodStr = periodStr.split("-");
  const periodNum = Number(splitPeriodStr[0]);
  return periodNum;
};

export const formatUnitStr = (unitStr: string): string => {
  return unitStr;
};

export const getPeriodsFromFileName = (fileName: string): string[] => {
  const periodRegex = /\d{4}-\d{2}-\d{2}/g;
  const match = fileName.match(periodRegex);

  if (match && match.length > 0) {
    return match;
  }

  return [];
};

export const getPeriodFromFileName = (fileName: string): string => {
  const periodRegex = /from-\d{4}-\d{2}-\d{2}-to-\d{4}-\d{2}-\d{2}/;
  const match = fileName.match(periodRegex);
  if (match && match.length > 0) {
    return match[0];
  }
  return "";
};

export const getFromPeriodFromFileName = (fileName: string): string => {
  const periodRegex = /from-\d{4}-\d{2}-\d{2}/;
  const match = fileName.match(periodRegex);
  if (match && match.length > 0) {
    return match[0];
  }
  return "";
};

export const getToPeriodFromFileName = (fileName: string): string => {
  const periodRegex = /to-\d{4}-\d{2}-\d{2}/;
  const match = fileName.match(periodRegex);
  if (match && match.length > 0) {
    return match[0];
  }
  return "";
};

// fundamentals 以外のソート (デフォルト: 昇順)
export const sortFile = (
  reportData: ReportData[],
  sort?: string
): ReportData[] => {
  // fileName でソート
  const sortedData = reportData.sort((a, b) => {
    const fromA = getFromPeriodFromFileName(a.file_name).replace("from-", "");
    const fromB = getFromPeriodFromFileName(b.file_name).replace("from-", "");

    const timeA = new Date(fromA).getTime();
    const timeB = new Date(fromB).getTime();

    // デフォルトは昇順
    if (sort === "desc") {
      return timeB - timeA;
    }

    return timeA - timeB;
  });
  return sortedData;
};

export const sortFundamentals = (
  fundamentals: Fundamental[],
  sort?: string
): Fundamental[] => {
  const sortedFundamentals = fundamentals.sort((a, b) => {
    const periodStartA = getPeriodYear(a.period_start);
    const periodStartB = getPeriodYear(b.period_start);

    // ダイオーズが複数ある
    // デフォルトは昇順
    if (sort === "desc") {
      return periodStartB - periodStartA;
    }
    return periodStartA - periodStartB;
  });
  return sortedFundamentals;
};

// ファイル名の重複をなくす
export const removeDuplicates = (reportData: ReportData[]): ReportData[] => {
  const periodStrs: string[] = [];
  const result: ReportData[] = [];

  reportData.forEach((data) => {
    const periodStr = getPeriodFromFileName(data.file_name);
    const addedStr = periodStrs.find((str) => str === periodStr);

    if (!addedStr) {
      periodStrs.push(periodStr);
      result.push(data);
    }
  });
  return result;
};

export const shortenUnitStr = (unitStr: string, value: number): string => {
  const tickItemStr = value.toLocaleString();

  // グローバル変数にアクセスし、より短い単位表示にする
  if (unitStr.includes("百万")) {
    // 1,000,000 以上 or -1,000,000 以下の場合
    if (value >= 1000000 || value <= -1000000) {
      return `${value / 1000000}兆`;
    }
    // 10,000 以上 or -10,000 以下の場合
    if (value >= 10000 || value <= -10000) {
      return `${value / 100}億`;
    }
    // 1,000 以上 or -1,000 以下の場合
    if (value >= 1000 || value <= -1000) {
      return `${value / 100}億`;
    }
    return tickItemStr;
  } else if (unitStr.includes("千")) {
    if (value >= 1000000 || value <= -1000000) {
      return `${value / 100000}億`;
    }
    return tickItemStr;
  }
  return tickItemStr;
};

export const getChartWindowStrs = (
  title: string,
  value: ValueType,
  unitStr: string
): string[] => {
  return [value.toLocaleString() + unitStr, title];
};
