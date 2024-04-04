import React, { useEffect, useState } from "react";

import "./PrivacyPolicy.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import LinkSend from "../../components/LinkSend/LinkSend";
import { policiesService } from "../../services";

export default function PrivacyPolicy() {
  const [policyData, setPolicyData] = useState();

  useEffect(() => {
    getPolicyFetch();
  }, []);

  const getPolicyFetch = async () => {
    await policiesService().then((res) => {
      setPolicyData(res.data);
    });
  };

  return (
    <>
      <Header />
      <section className=" pg-privacypolicy pb-4">
        <div className="container">
          <div className=" bg-white py-4 shadow">
            <div
              className="p-4 pg-privacypolicy-text"
              dangerouslySetInnerHTML={{ __html: policyData && policyData }}
            />
          </div>
        </div>
      </section>
      <LinkSend />
      <Footer />
    </>
  );
}
