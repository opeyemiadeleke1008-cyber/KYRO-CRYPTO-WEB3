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
import AdminSetting from "./pages/AdminSetting";
import AdminSignin from "./pages/AdminSignin";
import AdminSecurity from "./pages/AdminSecurity";
import AdminMembership from "./pages/AdminMembership";
import UserMembership from "./pages/UserMembership";
import { useTheme } from "./context/ThemeContext";
import { AdminThemeScope, UserThemeScope } from "./components/ThemeScopes";

function App() {
  const { setUserTheme } = useTheme();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (!authUser) return;
      const profile = await fetchUserProfile(authUser.uid);
      const darkMode = profile?.preferences?.darkMode;
      if (typeof darkMode === "boolean") {
        setUserTheme(darkMode ? "dark" : "light");
      }
    });

    return () => unsubscribe();
  }, [setUserTheme]);

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
      <Route path="/user-dashboard" element={<UserThemeScope><Userdashboard /></UserThemeScope>} />
      <Route path="/aside" element={<UserThemeScope><Aside /></UserThemeScope>} />
      <Route path="/user-settings" element={<UserThemeScope><UserSettings /></UserThemeScope>} />
      <Route path="/user-portfolio" element={<UserThemeScope><UserPorfolio /></UserThemeScope>} />
      <Route path="/user-market" element={<UserThemeScope><UserMarket /></UserThemeScope>} />
      <Route path="/user-mining" element={<UserThemeScope><UserMining /></UserThemeScope>} />
      <Route path="/user-swap" element={<UserThemeScope><UserSwap /></UserThemeScope>} />
      <Route path="/user-navbar" element={<UserThemeScope><UserNavbar /></UserThemeScope>} />
      <Route path="/line-chart" element={<UserThemeScope><LineChart /></UserThemeScope>} />
      <Route path="/wallet-modal" element={<UserThemeScope><WalletModal /></UserThemeScope>} />
      <Route path="/notification-toast" element={<UserThemeScope><NotificationToast /></UserThemeScope>} />
      <Route path="/signin-loader" element={<SigninLoader />} />
      <Route path="/user-referral" element={<UserThemeScope><UserReferral /></UserThemeScope>} />
      <Route path="/notification" element={<UserThemeScope><Notification /></UserThemeScope>} />
      <Route path="/user-membership" element={<UserThemeScope><UserMembership /></UserThemeScope>} />

      {/* Admin */}
      <Route path="/admin-dashboard" element={<AdminThemeScope><AdminDashboard /></AdminThemeScope>} />
      <Route path="/admin-aside" element={<AdminThemeScope><AdminAside /></AdminThemeScope>} />
      <Route path="/admin-setting" element={<AdminThemeScope><AdminSetting /></AdminThemeScope>} />
      <Route path="/admin-signin" element={<AdminThemeScope><AdminSignin /></AdminThemeScope>} />
      <Route path="/admin-security" element={<AdminThemeScope><AdminSecurity /></AdminThemeScope>} />
      <Route path="/admin-membership" element={<AdminThemeScope><AdminMembership /></AdminThemeScope>} />

      <Route path="*" element={<Error />} />
    </Routes>
  );
}

export default App;
