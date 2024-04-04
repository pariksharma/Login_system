import React, { useEffect, useState } from "react";

import "./TermCondition.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import LinkSend from "../../components/LinkSend/LinkSend";
import { termService } from "../../services";

export default function TermCondition() {
  const [terms, setTerms] = useState();

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    await termService()
      .then((res) => {
        setTerms(res.data);
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
              dangerouslySetInnerHTML={{ __html: terms && terms }}
            />
          </div>
        </div>
      </section>
      <LinkSend />
      <Footer />
    </>
  );
}
