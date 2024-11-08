import { Company, NewsList } from "../types/types";
import api from "./axiosConfig";

export const getLatestNews = async (): Promise<NewsList | undefined> => {
  const result = await api.get("/public/news");
  return result?.data as NewsList;
};

export const searchCompanies = async (
  companyName: string
): Promise<Company[]> => {
  const result = await api.get("/private/search", {
    params: { companyName },
  });
  return (result?.data as Company[]) || [];
};
