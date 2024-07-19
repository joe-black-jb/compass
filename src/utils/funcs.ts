import { Title, TitleByDepth, TitleFamily } from "../types/types";

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
