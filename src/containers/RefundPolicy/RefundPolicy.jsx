import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import LinkSend from "../../components/LinkSend/LinkSend";
import Footer from "../../components/Footer/Footer";
import { refundPolicyService } from "../../services";
import { resHandler } from "../../../helper";
import { useQuery } from "react-query";

export default function RefundPolicy() {
  const [refundPolicies, setRefundPolicies] = useState();

  useEffect(() => {
    fetchRefundPolicy();
  }, []);

  const fetchRefundPolicy = () => {
    refundPolicyService()
      .then((res) => {
        setRefundPolicies(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Header />
      <section className="pg-privacypolicy pb-4">
        <div className="container">
          <div className="bg-white py-4 shadow">
            <div
              className="p-4 pg-privacypolicy-text"
              dangerouslySetInnerHTML={{
                __html: refundPolicies && refundPolicies,
              }}
            />
          </div>
        </div>
      </section>
      <LinkSend />
      <Footer />
    </>
  );
}
