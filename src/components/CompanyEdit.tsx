import React, { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Company, Title, TitleFamily, ValueObj } from "../types/types";
import api from "../api/axiosConfig";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { getTitlesByDepth, getTitlesFamily, wait } from "../utils/funcs";
import Button from "./Button";
import TitleFormTable from "./TitleFormTable";
import Modal from "./Modal";
import { Link } from "react-router-dom";

const CompanyEdit = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company>();
  const assets: Title[] = [];
  const liabilities: Title[] = [];
  const netAssets: Title[] = [];
  const { companyId } = useParams();
  useEffect(() => {
    getCompany();
  }, []);
  useEffect(() => {
    setValueObjs();
  }, [company]);
  const getCompany = () => {
    api.get(`/company/${companyId}/titles`).then((result: AxiosResponse) => {
      if (result.data) {
        setCompany(result.data);
      }
    });
  };
  if (company) {
    company?.Titles?.forEach((title) => {
      const category = title.Category;
      if (category === "資産") {
        assets.push(title);
      } else if (category === "負債") {
        liabilities.push(title);
      } else if (category === "純資産") {
        netAssets.push(title);
      }
    });
  }

  const assetsByDepth = getTitlesByDepth(assets);

  const liabilitiesByDepth = getTitlesByDepth(liabilities);

  const netAssetsByDepth = getTitlesByDepth(netAssets);

  let assetsFamily: TitleFamily[] = [];
  const parentAssets = assetsByDepth[1];
  const childAssets = assetsByDepth[2];

  if (parentAssets?.length > 0 && childAssets?.length > 0) {
    assetsFamily = getTitlesFamily(parentAssets, childAssets);
  }

  let liabilitiesFamily: TitleFamily[] = [];
  const parentLiabilities = liabilitiesByDepth[1];
  const childLiabilities = liabilitiesByDepth[2];

  if (parentLiabilities?.length > 0 && childLiabilities?.length > 0) {
    liabilitiesFamily = getTitlesFamily(parentLiabilities, childLiabilities);
  }

  let netAssetsFamily: TitleFamily[] = [];
  const parentNetAssets = netAssetsByDepth[1];
  const childNetAssets = netAssetsByDepth[2];

  if (parentNetAssets?.length > 0 && childNetAssets?.length > 0) {
    netAssetsFamily = getTitlesFamily(parentNetAssets, childNetAssets);
  }

  const [values, setValues] = useState<ValueObj[]>([]);
  const setValueObjs = () => {
    const valueArray: ValueObj[] = [];
    assetsFamily.forEach((parent) => {
      parent.child.forEach((child) => {
        const valueObj = {
          titleId: child.ID.toString(),
          value: child.Value || "N/A",
        };
        valueArray.push(valueObj);
      });
    });
    liabilitiesFamily.forEach((parent) => {
      parent.child.forEach((child) => {
        const valueObj = {
          titleId: child.ID.toString(),
          value: child.Value || "N/A",
        };
        valueArray.push(valueObj);
      });
    });
    netAssetsFamily.forEach((parent) => {
      parent.child.forEach((child) => {
        const valueObj = {
          titleId: child.ID.toString(),
          value: child.Value || "N/A",
        };
        valueArray.push(valueObj);
      });
    });
    setValues(valueArray);
  };

  const handleChangeValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const id = e.target.id;
    const newData: ValueObj = {
      titleId: id,
      value: inputValue,
    };
    const newValues = values.filter((value) => value.titleId !== id);
    newValues.push(newData);
    setValues(newValues);
  };

  const [modalShow, setModalShow] = useState(false);
  const [modalStatus, setModalStatus] = useState("OK");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await Promise.all(
      values.map(async (value) => {
        await wait(1000);
        const id = value.titleId;
        const result = await api
          .put(`/title/${id}`, {
            value: value.value,
          })
          .catch((e) => {
            console.log("エラーが発生しました");
            if (e instanceof Error) {
              console.log("メッセージ: ", e.message);
            }
            return e;
          });
        return result;
      })
    ).catch((e) => {
      console.log("エラー: ", e);
      setModalShow(true);
      setModalStatus("NG");
    });
    setModalShow(true);
    setModalStatus("OK");
  };

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Button label="Back" onClick={() => navigate(-1)} />
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-gray-700 mb-10 mt-10">
            {company?.Name} (Edit Mode)
          </div>
          <Link to={`/company/${companyId}/new/title`}>
            <Button label="勘定項目を追加" className="h-10" />
          </Link>
        </div>
        <div className="flex justify-between">
          {/* 資産の部 */}
          <div className="relative overflow-x-auto w-1/2">
            <TitleFormTable
              values={values}
              family={assetsFamily}
              header="資産の部"
              onChange={handleChangeValues}
              onSubmit={handleSubmit}
              bgColor="bg-green-100"
            />
          </div>
          <div className="w-1/2">
            {/* 負債の部 */}
            <div className="relative overflow-x-auto">
              <TitleFormTable
                values={values}
                family={liabilitiesFamily}
                header="負債の部"
                onChange={handleChangeValues}
                onSubmit={handleSubmit}
                bgColor="bg-gray-100"
              />
            </div>
            {/* 純資産の部 */}
            <div className="relative overflow-x-auto">
              <TitleFormTable
                values={values}
                family={netAssetsFamily}
                header="純資産の部"
                onChange={handleChangeValues}
                onSubmit={handleSubmit}
                bgColor="bg-blue-100"
              />
            </div>
          </div>
        </div>
        {modalShow && (
          <Modal isOpen={true} status={modalStatus} company={company} />
        )}
      </Suspense>
    </>
  );
};

export default CompanyEdit;
