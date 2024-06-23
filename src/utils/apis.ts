import api from "../api/axiosConfig";
import { Company, PostTitleBody, Title, UpdateTitleBody } from "../types/types";

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
  console.log("リクエストBody: ", body);
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

export const deleteTitle = async (titleId: string) => {
  try {
    const deleteTitle = await api.delete(`title/${titleId}`);
    if (deleteTitle.data) {
      return deleteTitle.data;
    }
    return undefined;
  } catch (e) {
    return undefined;
  }
};
