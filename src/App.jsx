import React from "react";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
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
import SigninLoader from "./components/SigninLoader";
import UserReferral from "./pages/UserReferral";
import Notification from "./components/Notification";
import AdminAside from "./components/AdminAside";
import { fetchUserProfile } from "./services/userData";
import { initializeTheme, setStoredTheme } from "./services/theme";

function App() {
  useEffect(() => {
    initializeTheme();
    AOS.init({ duration: 1000, once: true });

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (!authUser) return;
      const profile = await fetchUserProfile(authUser.uid);
      const darkMode = profile?.preferences?.darkMode;
      if (typeof darkMode === "boolean") {
        const nextTheme = darkMode ? "dark" : "light";
        setStoredTheme(nextTheme);
      }
    });

    return () => unsubscribe();
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
      <Route path="/signin-loader" element={<SigninLoader />} />
      <Route path="/user-referral" element={<UserReferral />} />
      <Route path="/notification" element={<Notification />} />

      {/* Admin */}
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin-aside" element={<AdminAside />} />

      <Route path="*" element={<Error />} />
    </Routes>
  );
}

export default App;
