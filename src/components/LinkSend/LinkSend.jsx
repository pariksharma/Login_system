import React from "react";
import { Link } from "react-router-dom";
import ios_image from "../../assets/images/ios.png";
import appImage from "../../assets/images/physics-galaxy-removebg-preview.png";
import toast from "react-hot-toast";
import CountUp from "react-countup";
import "./LinkSend.css";

export default function LinkSend() {
  return (
    <>
      <section className="asdz-app-link shadow">
        <div className="container">
          <div className="row d-flex align-items-center justify-content-center">
            <div className="col-lg-7 col-md-7">
              <div className="py-2" data-aos="zoom-in">
                <div className="app-link-heading py-3">
                  <h2 className="text-dark fw-bold">
                    Download our apps & Start learning now
                  </h2>
                </div>
                <div className="app-link app-get-link col-xl-8 col-lg-8 col-md-10  py-3">
                </div>

                <div className="row">
                  <div className="col-md-10">
                    <div className="downl_btn marg_con d-flex  ">
                      <Link
                        to="https://play.google.com/store/search?q=physics+galaxy&c=apps&hl=en-IN&pli=1"
                        target="_blank"
                        className="app-img p-1"
                      >
                        <img
                          src="https://www.codesquadz.com/education_staging/../website_assets/img/app-edu-android-app.png"
                          alt="app-edu-android-app"
                          className="img-fluid"
                        />
                      </Link>

                      <Link
                        to="https://apps.apple.com/in/app/physics-galaxy/id1305855812"
                        target="_blank"
                        className="app-img p-1"
                      >
                        <img
                          src={ios_image}
                          alt="app-edu-ios-app"
                          className="img-fluid"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-md-5">
              <div className="" data-aos="zoom-in">
                <img
                  src={appImage}
                  alt="Mobile app Link"
                  className="img-fluid pg-sirrevw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="asdz-app-linkk">
        <div className="container">
          <div className="row text-center py-3">
            <div className="col-lg-3 col-md-3 col-6" data-aos="zoom-in">
              <div className="card-counter  mb-4">
                <CountUp
                  className="text-warning fw-bold"
                  end={8000}
                  duration={3.5}
                />
                <span className="text-warning fw-bold">+</span>
                <p>Video Lectures</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-6" data-aos="zoom-in">
              <div className="card-counter  mb-4">
                <CountUp
                  className="text-warning fw-bold"
                  end={6000}
                  duration={3.5}
                />
                <span className="text-warning fw-bold">+</span>
                <p>Practice MCQs</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-6" data-aos="zoom-in">
              <div className="card-counter  mb-4">
                <span className="text-warning fw-bold">High Quality</span>
                <p>Test Series by Expert Mentors</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-6" data-aos="zoom-in">
              <div className="card-counter  mb-4">
                <span className="text-warning fw-bold">Top Class</span>
                <p>Online FREE & PAID Courses</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
