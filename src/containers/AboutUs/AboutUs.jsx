import React, { useState, useEffect } from "react";
import { aboutUsService } from "../../services";
import { resHandler } from "../../../helper";
import Header from "../../components/Header/Header";
import LinkSend from "../../components/LinkSend/LinkSend";
import Footer from "../../components/Footer/Footer";

export default function AboutUs() {
  const [aboutData, setAboutData] = useState();

  useEffect(() => {
    fetchAboutService();
  }, []);

  const fetchAboutService = async () => {
    await aboutUsService().then((res) => {
      setAboutData(res.data);
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
              dangerouslySetInnerHTML={{ __html: aboutData }}
            />
          </div>
        </div>
      </section>
      <LinkSend />
      <Footer />
    </>
  );
}
