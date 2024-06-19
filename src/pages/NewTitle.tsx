import React, { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Company, Title } from "../types/types";
import api from "../api/axiosConfig";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Select from "../components/Select";
import SelectString from "../components/SelectString";
import InputField from "../components/InputField";

const NewTitle = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company>();
  const { companyId } = useParams();
  const [titles, setTitles] = useState<Title[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<Title>();
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [titleName, setTitleName] = useState<string>("");
  useEffect(() => {
    getCompany();
    getCategories();
  }, []);

  const getCompany = () => {
    api.get(`/company/${companyId}/titles`).then((result: AxiosResponse) => {
      if (result.data) {
        setCompany(result?.data);
        // console.log("result.data: ", result.data);
        setTitles(result?.data?.Titles);
        setSelectedTitle(result?.data?.Titles[0]);
      }
    });
  };
  // console.log("titles: ", titles);

  const getCategories = () => {
    api.get(`/categories`).then((result: AxiosResponse) => {
      if (result.data) {
        setCategories(result?.data);
        setSelectedCategory(result?.data[0]);
      }
    });
  };

  const handleSelectTitle = (title: Title) => {
    setSelectedTitle(title);
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const handleChangeTitleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleName(e.target.value);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("selectedCategory: ", selectedCategory);
    console.log("selectedTitle: ", selectedTitle);
    console.log("titleName: ", titleName);
    // 親ID, 項目名、HasValue,
    const body = {};
  };

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Button label="Back" onClick={() => navigate(-1)} />
        <div className="text-xl font-bold text-gray-700 mb-10 mt-10">
          {company?.Name}
        </div>
        <form className="w-1/2" onSubmit={onSubmit}>
          <SelectString
            options={categories}
            selected={selectedCategory}
            onChange={handleSelectCategory}
            label="区分"
          />
          <Select
            options={titles}
            selected={selectedTitle}
            onChange={handleSelectTitle}
            label="親項目"
          />
          <InputField
            label="項目名"
            onChange={handleChangeTitleName}
            value={titleName}
          />
          <div className="flex justify-end">
            <Button label="登録" onClick={() => onSubmit} className="mt-4" />
          </div>
        </form>
      </Suspense>
    </>
  );
};

export default NewTitle;
