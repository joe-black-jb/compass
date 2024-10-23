import { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Company, Title } from "../types/types";
import api from "../api/axiosConfig";
import { AxiosResponse } from "axios";
import { getJwtFromCookie } from "../utils/funcs";
import { authUser } from "../utils/apis";

const CompanyDetail = () => {
  const [company, setCompany] = useState<Company>();
  const { companyId } = useParams();
  const [admin, setAdmin] = useState<boolean>(false);
  const [latestBsHtml, setLatestBsHtml] = useState<string>();

  useEffect(() => {
    getCompany();
    // authenticateUser();
  }, []);

  useEffect(() => {
    getBsHtmls();
  }, [company]);

  const getCompany = () => {
    api.get(`/company/${companyId}`).then((result: AxiosResponse) => {
      if (result.data) {
        setCompany(result.data);
      }
    });
  };

  const getBsHtmls = () => {
    api
      .get(`/bs/html`, {
        params: {
          EDINETCode: company?.EDINETCode,
        },
      })
      .then((res) => {
        // TODO: 暫定的に 0番目を最新の HTML としているので要対応
        if (res.data && res.data.length > 0) {
          setLatestBsHtml(res?.data[0]?.data);
        }
      });
  };

  const authenticateUser = async () => {
    const jwt = getJwtFromCookie();

    if (jwt) {
      // 認証
      const isAdmin = await authUser(jwt);
      if (isAdmin) {
        setAdmin(true);
      }
    }
  };

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <div>{company?.Name}</div>
        {/* dangerouslySetInnerHTML を使って HTML をレンダリング */}
        {latestBsHtml && (
          <div dangerouslySetInnerHTML={{ __html: latestBsHtml }} />
        )}
      </Suspense>
    </>
  );
};

export default CompanyDetail;
