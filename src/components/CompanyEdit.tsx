import React, { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Company, Title, TitleFamily } from "../types/types";
import api from "../api/axiosConfig";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { getTitlesByDepth, getTitlesFamily } from "../utils/funcs";
import Button from "./Button";
import TitleFormTable from "./TitleFormTable";

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
  const getCompany = () => {
    api.get(`/company/${companyId}/titles`).then((result: AxiosResponse) => {
      console.log("会社情報: ", result.data);
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

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Button label="Back" onClick={() => navigate(-1)} />
        <div className="text-xl font-bold text-gray-700 mb-10 mt-10">
          {company?.Name} (Edit Mode)
        </div>
        <div className="flex justify-between">
          {/* 資産の部 */}
          <div className="relative overflow-x-auto w-1/2">
            <TitleFormTable family={assetsFamily} header="資産の部" />
          </div>
          <div className="w-1/2">
            {/* 負債の部 */}
            <div className="relative overflow-x-auto">
              <TitleFormTable family={liabilitiesFamily} header="負債の部" />
            </div>
            {/* 純資産の部 */}
            <div className="relative overflow-x-auto">
              <TitleFormTable family={netAssetsFamily} header="純資産の部" />
            </div>
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default CompanyEdit;
