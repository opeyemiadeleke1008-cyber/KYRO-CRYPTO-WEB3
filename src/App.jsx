import React from "react";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Routes, Route } from "react-router-dom";
import Landingpage from "./home/Landingpage";
import Error from "./components/Error";
import Loading from "./components/Loading";
import Header from "./layout/Header";
import Hero from "./layout/Hero";
import About from "./layout/About";
import Footer from "./layout/Footer";
import Signuppage from "./layout/Signuppage";
import Security from "./layout/Security";
import Faq from "./layout/Faq";
import Aboutpage from "./layout/Aboutpage";
import Features from "./layout/Features";
import Testimonials from "./layout/Testimonials";
import Membership from "./layout/Membership";
import PrivacyPolicy from "./layout/Privacypolicy";
import Termsofservice from "./layout/Termsofservice";
import Livemarket from "./layout/Livemarket";
import MobileNavbar from "./layout/MobileNavbar";
import Userdashboard from "./pages/Userdashboard";
import Aside from "./layout/Aside";
import UserSettings from "./pages/UserSettings";
import UserPorfolio from "./pages/UserPorfolio";
import UserMarket from "./pages/UserMarket";
import UserMining from "./pages/UserMining";
import UserSwap from "./pages/UserSwap";
import UserNavbar from "./components/UserNavbar";
import LineChart from "./components/LineChart";
import WalletModal from "./components/WalletModal";
import NotificationToast from "./components/NotificationToast";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Landingpage />} />
      <Route path="/loading" element={<Loading />} />
      <Route path="/header" element={<Header />} />
      <Route path="/hero" element={<Hero />} />
      <Route path="/about" element={<About />} />
      <Route path="/footer" element={<Footer />} />
      <Route path="/signup" element={<Signuppage />} />
      <Route path="/security" element={<Security />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/aboutpage" element={<Aboutpage />} />
      <Route path="/features" element={<Features />} />
      <Route path="/testimonials" element={<Testimonials />} />
      <Route path="/membership" element={<Membership />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<Termsofservice />} />
      <Route path="/livemarket" element={<Livemarket />} />
      <Route path="/mobile-navbar" element={<MobileNavbar />} />
      <Route path="/user-dashboard" element={<Userdashboard />} />
      <Route path="/aside" element={<Aside />} />
      <Route path="/user-settings" element={<UserSettings />} />
      <Route path="/user-portfolio" element={<UserPorfolio />} />
      <Route path="/user-market" element={<UserMarket />} />
      <Route path="/user-mining" element={<UserMining />} />
      <Route path="/user-swap" element={<UserSwap />} />
      <Route path="/user-navbar" element={<UserNavbar />} />
      <Route path="/line-chart" element={<LineChart />} />
      <Route path="/wallet-modal" element={<WalletModal />} />
      <Route path="/notification-toast" element={<NotificationToast />} />

      {/* Admin side */}
      <Route path="/admin-dashboard" element={<AdminDashboard />} />

      <Route path="*" element={<Error />} />
    </Routes>
  );
}

export default App;
