import React, { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Company,
  PostTitleBody,
  ResultModalStatus,
  Title,
} from "../types/types";
import api from "../api/axiosConfig";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Select from "../components/Select";
import SelectString from "../components/SelectString";
import InputField from "../components/InputField";
import { postTitle } from "../utils/apis";
import ConfirmModal from "../components/ConfirmModal";
import Modal from "../components/Modal";
import { log } from "console";
import Checkbox from "../components/Checkbox";

const NewTitle = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company>();
  const { companyId } = useParams();
  const [titles, setTitles] = useState<Title[]>([]);
  const [parentTitle, setParentTitle] = useState<Title>();
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [titleName, setTitleName] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [valueError, setValueError] = useState<string>("");
  const [titleNameError, setTitleNameError] = useState<string>("");
  const [postError, setPostError] = useState<string>("");
  const [postSuccess, setPostSuccess] = useState<string>("");
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [resultModalShow, setResultModalShow] = useState(false);
  const [resultModalStatus, setResultModalStatus] =
    useState<ResultModalStatus>("OK");
  useEffect(() => {
    getCompany();
    getCategories();
  }, []);
  const [isMinus, setIsMinus] = useState(false);

  const getCompany = () => {
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
    setParentTitle(title);
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const handleChangeTitleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleName(e.target.value);
  };

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    // 項目名の存在チェック
    if (!titleName) {
      const msg = "項目名を入力してください";
      setTitleNameError(msg);
      setModalShow(false);
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
      setModalShow(false);
    } else {
      setValueError("");
    }
    if (titleName && match && companyId) {
      // 登録処理
      const body: PostTitleBody = {
        Name: titleName,
        Category: selectedCategory,
        ParentTitleID: parentTitle?.ID,
        CompanyID: Number(companyId),
      };
      if (value && value !== "0") {
        if (isMinus) {
          body.Value = `-${value.toString()}`;
        } else {
          body.Value = value.toString();
        }
      } else {
        body.HasValue = false;
      }
      if (parentTitle?.ID !== 0) {
        body.Depth = 2;
      }
      const postedTitle = await postTitle(body);

      if (postedTitle) {
        setPostError("");
        setResultModalStatus("OK");
      } else {
        setResultModalStatus("NG");
      }
      setModalShow(false);
      setResultModalShow(true);
    }
  };

  const onClickRegister = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!postError) {
      setModalShow(true);
    }
  };
  const onCancel = () => {
    setModalShow(false);
    setResultModalShow(false);
  };
  const goToCompanyDetail = () => {
    navigate(`/company/${company?.ID}`);
  };
  const onCheckMinus = (checked: boolean) => {
    console.log("チェックされたか: ", checked);
    setIsMinus(!isMinus);
  };

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Button label="Back" onClick={() => navigate(-1)} />
        <div className="text-xl font-bold text-gray-700 mb-10 mt-10">
          {company?.Name}
        </div>
        <form className="w-1/2" onSubmit={onClickRegister}>
          <SelectString
            options={categories}
            selected={selectedCategory}
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
          <Checkbox checked={isMinus} onCheck={onCheckMinus} />
          {valueError && <div className="text-red-500">{valueError}</div>}
          <div className="flex justify-end">
            <Button label="登録" onClick={onClickRegister} className="mt-4" />
          </div>
        </form>
        {postError && <div className="text-red-500">{postError}</div>}
        {modalShow && (
          <ConfirmModal
            desc="項目を登録します。よろしいですか？"
            cancelLabel="キャンセル"
            proceedLabel="OK"
            onProceed={onSubmit}
            onCancel={onCancel}
            open={modalShow}
            setOpen={() => setModalShow}
          />
        )}
        {resultModalShow && resultModalStatus === "OK" && (
          <Modal
            isOpen={true}
            open={resultModalShow}
            status={resultModalStatus}
            dialogTitle={`登録成功`}
            dialogText={`項目の登録が成功しました`}
            proceedText="OK"
            onProceed={goToCompanyDetail}
            setOpen={() => setModalShow}
          />
        )}
        {resultModalShow && resultModalStatus === "NG" && (
          <Modal
            isOpen={true}
            open={resultModalShow}
            status={resultModalStatus}
            dialogTitle={`登録失敗`}
            dialogText={`項目の登録に失敗しました`}
            proceedText="会社詳細画面へ"
            cancelText="閉じる"
            onProceed={goToCompanyDetail}
            onCancel={onCancel}
            setOpen={() => setModalShow}
          />
        )}
      </Suspense>
    </>
  );
};

export default NewTitle;
