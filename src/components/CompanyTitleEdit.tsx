import React, { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Company,
  Method,
  PostTitleBody,
  ResultModalStatus,
  Title,
} from "../types/types";
import api from "../api/axiosConfig";
import { AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Select from "../components/Select";
import SelectString from "../components/SelectString";
import InputField from "../components/InputField";
import { deleteTitle, updateTitle } from "../utils/apis";
import ConfirmModal from "./ConfirmModal";
import Modal from "./Modal";
import { DialogTitle } from "@headlessui/react";
import { response } from "express";
import Checkbox from "./Checkbox";

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
  const [targetTitle, setTargetTitle] = useState<Title>();
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [resultModalShow, setResultModalShow] = useState(false);
  const [resultModalStatus, setResultModalStatus] =
    useState<ResultModalStatus>("OK");
  const [method, setMethod] = useState<Method>("NONE");
  const [dialogText, setDialogText] = useState<string>("");
  const [isMinus, setIsMinus] = useState<boolean>(false);

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

  const onClickUpdate = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setMethod("PUT");
    setModalShow(true);
  };

  const onClickDelete = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setMethod("DELETE");
    setModalShow(true);
  };

  const onSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
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

      // 更新処理
      if (!titleId) {
        setPostError("更新対照項目IDが取得できませんでした");
      } else {
        const updatedTitle = await updateTitle(titleId, body);
        console.log("更新した項目: ", updatedTitle);
        if (updatedTitle) {
          setResultModalStatus("OK");
        } else {
          setResultModalStatus("NG");
        }
        setModalShow(false);
        setResultModalShow(true);
      }
    }
  };

  // 削除関連
  const handleDelete = async () => {
    if (targetTitle) {
      try {
        await deleteTitle(targetTitle.ID.toString());
        setResultModalStatus("OK");
      } catch (e) {
        setResultModalStatus("NG");
        if (e instanceof AxiosError) {
          const responseData = e.response?.data;
          if (responseData) {
            setDialogText(responseData.Message);
          }
        }
      } finally {
        setModalShow(false);
        setResultModalShow(true);
      }
    }
  };
  const onCancel = () => {
    setModalShow(false);
    setResultModalShow(false);
  };
  const goToCompanyDetail = () => {
    navigate(`/company/${company?.id}`);
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
        <form className="w-1/2" onSubmit={onClickUpdate}>
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
          <Checkbox checked={isMinus} onCheck={onCheckMinus} />
          <div className="flex justify-end">
            <Button label="更新" onClick={() => onSubmit} className="mt-4" />
          </div>
        </form>
        <div className="w-1/2 text-right">
          <Button label="削除" onClick={onClickDelete} className="mt-4" />
        </div>
        {modalShow && method === "PUT" && (
          <ConfirmModal
            isOpen={true}
            desc="項目を更新します。よろしいですか？"
            cancelLabel="キャンセル"
            proceedLabel="OK"
            onProceed={onSubmit}
            onCancel={onCancel}
            open={modalShow}
            setOpen={() => setModalShow}
          />
        )}
        {modalShow && method === "DELETE" && (
          <ConfirmModal
            isOpen={true}
            desc="項目を削除します。よろしいですか？"
            cancelLabel="キャンセル"
            proceedLabel="OK"
            onProceed={handleDelete}
            onCancel={onCancel}
            open={modalShow}
            setOpen={() => setModalShow}
          />
        )}
        {resultModalShow && resultModalStatus === "OK" && (
          <Modal
            isOpen={true}
            status={resultModalStatus}
            dialogTitle={`${method === "PUT" ? "更新" : "削除"}成功`}
            dialogText={`項目の${
              method === "PUT" ? "更新" : "削除"
            }が成功しました`}
            proceedText="OK"
            onProceed={goToCompanyDetail}
            open={resultModalShow}
            setOpen={() => setModalShow}
          />
        )}
        {resultModalShow && resultModalStatus === "NG" && (
          <Modal
            isOpen={true}
            status={resultModalStatus}
            dialogTitle={`${method === "PUT" ? "更新" : "削除"}失敗`}
            dialogText={
              dialogText ||
              `項目の${method === "PUT" ? "更新" : "削除"}が失敗しました`
            }
            proceedText="会社詳細画面へ"
            cancelText="閉じる"
            onProceed={goToCompanyDetail}
            onCancel={onCancel}
            open={resultModalShow}
            setOpen={() => setModalShow}
          />
        )}
      </Suspense>
    </>
  );
};

export default CompanyTitleEdit;
