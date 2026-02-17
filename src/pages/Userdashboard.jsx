import React, { useEffect, useState } from "react";
import { Search, Bell, MoreHorizontal, UserIcon } from "lucide-react";
import Aside from "../layout/Aside";
import UserNavbar from "../components/UserNavbar";

const Userdashboard = () => {
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
  // const [activeTab, setActiveTab] = useState("Dashboard");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("kyro_user"));
    if (storedUser && storedUser.name) {
      setUser({
        name: storedUser.name,
        profilePic: storedUser.profilePic || "",
      });
      setProfileData({
        name: storedUser.name || "",
        email: storedUser.email || "",
        profilePic: storedUser.profilePic || "",
      });
    }
  }, []);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const updated = {
      ...user,
      name: profileData.name,
      email: profileData.email,
      profilePic: profileData.profilePic,
    };
    localStorage.setItem("kyro_user", JSON.stringify(updated));
    setUser(updated);
    alert("IDENTITY SYNC: Success.");
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

  const [notificationCount, setNotificationCount] = useState(0);
  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
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
              <button className="p-2 bg-[#0B0E14] border border-white/10 rounded-xl text-gray-400 hover:text-white cursor-pointer">
                <Bell size={20} onClick={() => setNotificationCount(notificationCount + 1)}/>
              </button>
              {notificationCount > 0 && (
                <span className="absolute -top-2.5 -right-2 p-1 h-5.5 w-5.5 items-center justify-center bg-orange-500 text-stone-50 rounded-full text-xs font-semibold flex">{notificationCount}</span>
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
                  <h3 className="text-3xl font-black italic">+$28,345.00</h3>
                </div>
              </div>
              <div className="h-48 w-full bg-gradient-to-t from-orange-500/5 to-transparent rounded-xl border-b border-orange-500/20 flex items-end justify-center">
                <p className="text-orange-600 text-[10px] font-mono mb-4 animate-pulse">
                  [ Live Portfolio Analytics Stream ]
                </p>
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
                  24k
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="bg-[#0B0E14] border border-white/5 rounded-3xl p-6 mb-10">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6">
              Recent Activity
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-gray-500 border-b border-white/5">
                    <th className="pb-4 font-medium uppercase tracking-tighter">
                      User Name
                    </th>
                    <th className="pb-4 font-medium uppercase tracking-tighter">
                      Top Asset
                    </th>
                    <th className="pb-4 font-medium uppercase tracking-tighter">
                      Gain/Loss
                    </th>
                    <th className="pb-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <TableRow
                    name="Theresa Webb"
                    asset="ETH"
                    change="+8.3%"
                    status="pos"
                  />
                  <TableRow
                    name="Bessie Cooper"
                    asset="SOL"
                    change="-3.2%"
                    status="neg"
                  />
                  <TableRow
                    name="Sarah Steper"
                    asset="BTC"
                    change="+12.5%"
                    status="pos"
                  />
                </tbody>
              </table>
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
  <tr className="group hover:bg-white/[0.02] transition-colors">
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
