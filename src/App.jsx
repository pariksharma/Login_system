import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./containers/Home/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./containers/Login/Login";
import SignUp from "./containers/SignUp/SignUp";
import ForgetPassword from "./containers/ForgetPassword/ForgetPassword";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "react-scroll-to-top";
import { useEffect } from "react";
import PrivacyPolicy from "./containers/PrivacyPolicy/PrivacyPolicy";
import TermCondition from "./containers/TermCondition/TermCondition";
import AboutUs from "./containers/AboutUs/AboutUs";
import RefundPolicy from "./containers/RefundPolicy/RefundPolicy";
import ChangePassword from "./containers/ChangePassword/ChangePassword";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      if (window.scrollY > 0) {
        window.scrollTo(0, 0);
      }
    };
    scrollToTop();
  }, [pathname]);

  function PrivateRoute({ children, redirectTo }) {
    const isLogin = localStorage?.getItem("jwt");
    if (isLogin) {
      return children;
    } else {
      const fullUrl = window.location.href;
      localStorage.setItem("redirect", fullUrl);
      return <Navigate to={redirectTo} />;
    }
  }

  function PublicRoute({ children, redirectTo }) {
    const isLogin = localStorage?.getItem("jwt");
    return !isLogin ? children : <Navigate to={redirectTo} />;
  }

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ScrollToTop />
        <Toaster
          containerStyle={{
            top: 90,
            left: 10,
            bottom: 20,
            right: 20,
          }}
          position="top-right"
        />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route
            path="/login"
            element={
              <PublicRoute redirectTo="/home">
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/forget_password"
            element={
              <PublicRoute redirectTo="/">
                <ForgetPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/change_password"
            element={
              <PrivateRoute redirectTo="/login">
                <ChangePassword />
              </PrivateRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute redirectTo="/">
                <SignUp />
              </PublicRoute>
            }
          />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/termcondition" element={<TermCondition />} />
          <Route path="/refund-policies" element={<RefundPolicy />} />
        </Routes>
      </QueryClientProvider>
    </>
  );
}

export default App;
