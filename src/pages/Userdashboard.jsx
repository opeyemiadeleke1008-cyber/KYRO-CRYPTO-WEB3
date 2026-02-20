import React, { useEffect, useState } from "react";
import { Search, Bell, MoreHorizontal, UserIcon } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  fetchUserProfile,
  migrateLocalStorageToFirebase,
  saveUserProfile,
} from "../services/userData";
import { subscribeUnreadNotificationsCount } from "../services/notifications";
import Aside from "../layout/Aside";
import UserNavbar from "../components/UserNavbar";
import NotificationToast from "../components/NotificationToast";
import LineChart from "../components/LineChart";

const Userdashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "Operator",
    email: "",
    profilePic: "",
  });
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    profilePic: "",
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUid, setCurrentUid] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
    type: "info",
  });
  // const [activeTab, setActiveTab] = useState("Dashboard");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (!authUser) {
        navigate("/signup");
        return;
      }

      setCurrentUid(authUser.uid);
      await migrateLocalStorageToFirebase(authUser.uid, authUser.email || "");
      const profile = await fetchUserProfile(authUser.uid);

      if (profile) {
        setUser({
          name: profile.name || "Operator",
          email: profile.email || authUser.email || "",
          profilePic: profile.profilePic || "",
        });
        setProfileData({
          name: profile.name || "",
          email: profile.email || authUser.email || "",
          profilePic: profile.profilePic || "",
        });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!currentUid) return () => {};
    const unsubscribe = subscribeUnreadNotificationsCount(
      currentUid,
      setUnreadCount,
    );
    return () => unsubscribe();
  }, [currentUid]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!currentUid) return;

    const updated = {
      ...user,
      name: profileData.name,
      email: profileData.email,
      profilePic: profileData.profilePic,
    };
    await saveUserProfile(currentUid, updated);
    setUser(updated);
    setNotification({ isOpen: false, message: "", type: "info" });
    setTimeout(() => {
      setNotification({
        isOpen: true,
        message: "IDENTITY SYNC: Success.",
        type: "success",
      });
    }, 10);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      <NotificationToast
        isOpen={notification.isOpen}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification((prev) => ({ ...prev, isOpen: false }))}
      />
      {/* Mobile Navbar */}
      <UserNavbar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* 1. SIDEBAR COMPONENT */}
      <Aside
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto bg-black p-4 md:p-8 relative md:top-0 top-15 scrollbar-hidden">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[50%] border border-white/10 overflow-hidden bg-[#0B0E14] flex items-center justify-center">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="text-gray-600" size={24} />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight uppercase italic text-orange-500">
                Dashboard
              </h2>
              <p className="text-gray-500 text-xs uppercase tracking-widest">
                Welcome back{" "}
                <span className="text-white font-bold">{user.name}</span>{" "}
                <span className="text-green-500">// System Active</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={16}
              />
              <input
                type="text"
                placeholder="Search Assets..."
                className="w-full bg-[#0B0E14] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs outline-none focus:border-orange-500/50 transition-all text-white"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => navigate("/notification")}
                className="p-2 bg-[#0B0E14] border border-white/10 rounded-xl text-gray-400 hover:text-white cursor-pointer"
              >
                <Bell size={20} />
              </button>
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 px-1 min-w-5 h-5 rounded-full bg-orange-500 text-black text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* DASHBOARD VIEW */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
          {/* Top Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Arbitrum"
              speed="High Speed"
              raised="74,000"
              color="teal"
            />
            <StatCard
              title="Solana"
              speed="Low Latency"
              raised="58,000"
              color="orange"
            />
            <StatCard
              title="Ethereum"
              speed="Smart Contracts"
              raised="94,000"
              color="teal"
            />
          </div>

          {/* Charts & Allocation Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-[#0B0E14] border border-white/5 rounded-3xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">
                    Portfolio Value
                  </p>
                  <h3 className="text-2xl font-black italic">+$<span className="text-orange-500 text-3xl"> 0</span></h3>
              
                </div>
              </div>
              <div className="h-48 w-full bg-linear-to-t from-orange-500/5 to-transparent rounded-xl border-b border-orange-500/20 flex items-end justify-center">
              <LineChart />
                {/* <p className="text-orange-600 text-[10px] font-mono mb-4 animate-pulse">
                  [ Live Portfolio Analytics Stream ]
                </p> */}
              </div>
            </div>

            <div className="bg-[#0B0E14] border border-white/5 rounded-3xl p-6">
              <h3 className="text-sm font-bold mb-6 tracking-widest uppercase">
                Allocation
              </h3>
              <div className="space-y-3">
                <AllocationRow
                  label="Trading"
                  percent="50%"
                  color="bg-orange-500"
                />
                <AllocationRow
                  label="Staking"
                  percent="25%"
                  color="bg-teal-500"
                />
                <AllocationRow
                  label="Exchange"
                  percent="25%"
                  color="bg-gray-600"
                />
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">
                    Total
                  </span>
                  <span className="text-white text-[10px] font-bold tracking-widest">
                    100%
                  </span>
                </div>
              </div>
              <div className="mt-4 justify-self-center">
                <p className="uppercase p-8 rounded-[50%] h-15 w-15 flex items-center justify-center bg-gray-700 border-8 border-r-orange-500 border-t-orange-500 border-l-green-500 border-b-gray-500">
                  {user?.diamonds || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* --- SUBCOMPONENTS --- */

const StatCard = ({ title, speed, raised, color }) => (
  <div className="bg-[#0B0E14] border border-white/5 p-5 rounded-3xl hover:border-orange-500/30 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h4 className="font-bold text-sm italic">{title}</h4>
        <p className="text-[10px] text-gray-500 uppercase">{speed}</p>
      </div>
      <div
        className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${color === "orange" ? "bg-orange-500/10 text-orange-500" : "bg-teal-500/10 text-teal-500"}`}
      >
        Active
      </div>
    </div>
    <div className="mb-2 flex justify-between text-[10px] font-mono">
      <span className="text-gray-400">Raised</span>
      <span>{raised} ETH</span>
    </div>
    <div className="w-full h-1 bg-white/5 rounded-full mb-4 overflow-hidden">
      <div
        className={`h-full rounded-full ${color === "orange" ? "bg-orange-500" : "bg-teal-500"} w-[74%]`}
      ></div>
    </div>
    <button className="w-full py-2 bg-white/5 text-[10px] font-bold uppercase rounded-xl group-hover:bg-orange-500 group-hover:text-black transition-all cursor-pointer">
      Protocol
    </button>
  </div>
);

const AllocationRow = ({ label, percent, color }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full ${color}`}></div>
      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
        {label}
      </span>
    </div>
    <span className="text-[10px] font-mono">{percent}</span>
  </div>
);

const TableRow = ({ name, asset, change, status }) => (
  <tr className="group hover:bg-white/2 transition-colors">
    <td className="py-4 font-bold">{name}</td>
    <td className="py-4 text-gray-400">{asset}</td>
    <td
      className={`py-4 font-mono ${status === "pos" ? "text-teal-500" : "text-orange-500"}`}
    >
      {change}
    </td>
    <td className="py-4 text-right">
      <button className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
        <MoreHorizontal size={14} />
      </button>
    </td>
  </tr>
);

export default Userdashboard;
