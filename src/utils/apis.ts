import { AxiosError, AxiosResponse } from "axios";
import api from "../api/axiosConfig";
import {
  Company,
  GetStockParams,
  Login,
  PostTitleBody,
  StockItem,
  Title,
  UpdateTitleBody,
} from "../types/types";

export const getCompany = async (
  companyId?: string
): Promise<Company | undefined> => {
  if (!companyId) {
    throw new Error("会社IDを指定してください");
  }
  const result = await api.get(`/company/${companyId}/titles`);
  if (result?.data) {
    return result.data;
  }
  return undefined;
};

export const postTitle = async (
  body: PostTitleBody
): Promise<Title | undefined> => {
  console.log("リクエストBody: ", body);
  try {
    const postedTitle = await api.post(`title`, body);
    if (postedTitle.data) {
      return postedTitle.data;
    }
    return undefined;
  } catch (e) {
    return undefined;
  }
};

export const updateTitle = async (
  titleId: string,
  body: UpdateTitleBody
): Promise<Title | undefined> => {
  try {
    const postedTitle = await api.put(`title/${titleId}`, body);
    if (postedTitle.data) {
      return postedTitle.data;
    }
    return undefined;
  } catch (e) {
    return undefined;
  }
};

export const deleteTitle = async (
  titleId: string
): Promise<Title | undefined> => {
  const deletedTitle = await api.delete(`title/${titleId}`);
  if (deletedTitle.data) {
    return deletedTitle.data;
  }
  return undefined;
};

export const authUser = async (jwt: string) => {
  try {
    const response = await api.get(`user/auth`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    if (response.data) {
      return response.data;
    }
    return false;
  } catch (e) {
    return undefined;
  }
};

export const login = async (
  email: string,
  pass: string
): Promise<Login | undefined> => {
  try {
    const res = await api.post(`login`, {
      Email: email,
      Password: pass,
    });

    if (res.data) {
      return res.data;
    }
    return undefined;
  } catch (e) {
    console.log("ログインエラー: ", e);
    return undefined;
  }
};

export const registerUser = async (
  username: string,
  email: string,
  pass: string
) => {
  const res = await api.post(`register`, {
    Name: username,
    Email: email,
    Password: pass,
  });

  if (res.data) {
    return res.data;
  }
  return undefined;
};

export const getStocks = async (
  params: GetStockParams
): Promise<StockItem[]> => {
  const result = await api.get("/stock", {
    params: {
      ticker: params.ticker,
      period: params.period,
      interval: params.interval,
    },
  });
  return result?.data || [];
};
