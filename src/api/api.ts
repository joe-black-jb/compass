import { NewsList } from "../types/types";
import api from "./axiosConfig";

export const getLatestNews = async (): Promise<NewsList | undefined> => {
  const result = await api.get("/public/news");
  return result?.data as NewsList;
};
