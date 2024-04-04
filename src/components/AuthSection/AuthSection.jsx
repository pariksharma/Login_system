import React from "react";
import "./AuthSection.css";
import LoginImg1 from "../../assets/images/login-1.png";
import LoginImg2 from "../../assets/images/login-2.png";
import LoginImg3 from "../../assets/images/login-3.png";
import ReactOwlCarousel from "react-owl-carousel";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

export default function AuthSection(props) {
  const options = {
    loop: true,
    items: 1,
    margin: 0,
    autoplay: true,
    dots: true,
    autoplayTimeout: 3000,
    smartSpeed: 400,
    responsive: {
      0: { items: 1 },
      600: { items: 1 },
      1000: { items: 1 },
    },
  };

  return (
    <>
      <Header />
      <section className="pg-login-section-left pt-4 pb-1">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <ReactOwlCarousel {...options}>
                <div className="item">
                  <div className="p-3 text-center pg-login-carousel m-3">
                    <div className="loginsection-img m-auto">
                      <img src={LoginImg1} alt="" />
                    </div>
                    <div className="loginsection-title">
                      <h1>Welcome to Physics Galaxy</h1>
                      <p>
                        An Interactive eLearning platform to help you prepare
                        for the competitive exams in this competitive age.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="p-3 text-center pg-login-carousel m-3">
                    <div className="loginsection-img m-auto">
                      <img src={LoginImg2} alt="" />
                    </div>
                    <div className="loginsection-title">
                      <h1>QBank & Test Series</h1>
                      <p>
                        Build your career with the best-in-class QBank and test
                        series section to boost your exam scores.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="p-3 text-center pg-login-carousel m-3">
                    <div className="loginsection-img m-auto">
                      <img src={LoginImg3} alt="" />
                    </div>
                    <div className="loginsection-title">
                      <h1> Video Lectures</h1>
                      <p>
                        Watch our video lectures and level up your online
                        learning experience with flexible video lessons.
                      </p>
                    </div>
                  </div>
                </div>
              </ReactOwlCarousel>
            </div>
            <div className="col-lg-6">
              <div className="shadow bg-white pg-login-card">
                {props.children}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
