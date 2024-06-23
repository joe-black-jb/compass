import React, { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Company, PostTitleBody, Title } from "../types/types";
import api from "../api/axiosConfig";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Select from "../components/Select";
import SelectString from "../components/SelectString";
import InputField from "../components/InputField";
import { deleteTitle, updateTitle } from "../utils/apis";
import ConfirmModal from "./ConfirmModal";

const CompanyTitleEdit = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company>();
  const { companyId, titleId } = useParams();
  const [titles, setTitles] = useState<Title[]>([]);
  const [parentTitle, setParentTitle] = useState<Title>();
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("");
  const [titleName, setTitleName] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [valueError, setValueError] = useState<string>("");
  const [titleNameError, setTitleNameError] = useState<string>("");
  const [postError, setPostError] = useState<string>("");
  const [postSuccess, setPostSuccess] = useState<string>("");
  const [targetTitle, setTargetTitle] = useState<Title>();
  const [modalShow, setModalShow] = useState(false);
  const [modalStatus, setModalStatus] = useState("OK");

  useEffect(() => {
    getCompanyTitles();
    getCategories();
  }, []);

  const getCompanyTitles = () => {
    api.get(`/company/${companyId}/titles`).then((result: AxiosResponse) => {
      if (result.data) {
        setCompany(result?.data);
        const emptyTitles: Title[] = [
          {
            Category: "none",
            CompanyID: 0,
            CreatedAt: "0",
            Depth: 0,
            FiscalYear: 0,
            HasValue: false,
            ID: 0,
            Name: "なし",
            StatementType: 0,
            UpdatedAt: "0",
            order: 0,
            parent_title_id: 0,
          },
        ];
        const titles = emptyTitles.concat(result?.data?.Titles);
        setTitles(titles);
        setParentTitle(titles[0]);

        const targetTitle = result?.data?.Titles.find((title: Title) => {
          return title?.ID.toString() === titleId;
        });
        if (targetTitle) {
          setTargetTitle(targetTitle);
          setTitleName(targetTitle.Name);
          setValue(targetTitle.Value);
          setCategory(targetTitle.Category);
          const parent = result?.data?.Titles.find((title: Title) => {
            return title?.ID === targetTitle.parent_title_id;
          });
          if (parent) {
            setParentTitle(parent);
          }
        }
      }
    });
  };

  const getCategories = () => {
    api.get(`/categories`).then((result: AxiosResponse) => {
      if (result.data) {
        setCategories(result?.data);
        setCategory(result?.data[0]);
      }
    });
  };

  const handleSelectTitle = (title: Title) => {
    setParentTitle(title);
  };

  const handleSelectCategory = (category: string) => {
    setCategory(category);
  };

  const handleChangeTitleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleName(e.target.value);
  };

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 項目名の存在チェック
    if (!titleName) {
      const msg = "項目名を入力してください";
      setTitleNameError(msg);
    } else {
      setTitleNameError("");
    }
    // 値の半角数字チェック
    const regex = /^[0-9]*$/;
    const match = value.match(regex);
    if (!match) {
      const msg = "値は半角数字で入力してください";
      console.log(msg);
      setValueError(msg);
    } else {
      setValueError("");
    }
    if (titleName && match && companyId) {
      const body: PostTitleBody = {
        Name: titleName,
        Category: category,
        ParentTitleID: parentTitle?.ID,
        CompanyID: Number(companyId),
      };
      if (value && value !== "0") {
        body.Value = value.toString();
      } else {
        body.HasValue = false;
      }
      if (parentTitle?.ID !== 0) {
        body.Depth = 2;
      }

      // 更新処理
      if (!titleId) {
        setPostError("更新対照項目IDが取得できませんでした");
      } else {
        const updatedTitle = await updateTitle(titleId, body);
        console.log("更新した項目: ", updatedTitle);
        if (updatedTitle) {
          setPostError("");
          const msg = "項目の更新処理が成功しました";
          setPostSuccess(msg);
        } else {
          const msg = "項目の更新処理に失敗しました";
          setPostError(msg);
          setPostSuccess("");
        }
        console.log("リクエストBODY: ", body);
      }
    }
  };

  // 削除関連
  const handleDelete = async () => {
    console.log("handleDelete");
    console.log("削除対象: ", targetTitle);
    if (targetTitle) {
      const result = await deleteTitle(targetTitle.ID.toString());
      if (result) {
        console.log("削除した結果: ", result);
      }
    }
  };
  const handleCancel = () => {
    setModalShow(false);
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
            selected={category}
            onChange={handleSelectCategory}
            label="区分"
          />
          <Select
            options={titles}
            selected={parentTitle}
            onChange={handleSelectTitle}
            label="親項目"
          />
          <InputField
            label="項目名"
            onChange={handleChangeTitleName}
            value={titleName}
          />
          {titleNameError && (
            <div className="text-red-500">{titleNameError}</div>
          )}
          <InputField
            label="値 (単位：百万円)"
            onChange={handleChangeValue}
            value={value}
          />
          {valueError && <div className="text-red-500">{valueError}</div>}
          <div className="flex justify-end">
            <Button label="更新" onClick={() => onSubmit} className="mt-4" />
          </div>
        </form>
        {postError && <div className="text-red-500">{postError}</div>}
        {postSuccess && <div className="text-green-500">{postSuccess}</div>}
        <div className="w-1/2 text-right">
          <Button
            label="削除"
            onClick={() => setModalShow(true)}
            className="mt-4"
          />
        </div>
        {modalShow && (
          <div className="fixed top-0 left-0 right-0">
            <ConfirmModal
              isOpen={true}
              status={modalStatus}
              desc="項目を削除します。よろしいですか？"
              cancelLabel="キャンセル"
              proceedLabel="OK"
              onProceed={handleDelete}
              onCancel={handleCancel}
              open={modalShow}
              setOpen={() => setModalShow}
            />
          </div>
        )}
      </Suspense>
    </>
  );
};

export default CompanyTitleEdit;
