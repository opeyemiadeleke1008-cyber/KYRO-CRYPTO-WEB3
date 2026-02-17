import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdminAside from "../components/AdminAside";
import { Search, Bell, Settings as Gear, Users, History, Menu } from "lucide-react";

const AdminDashboard = () => {
  // --- Sidebar States ---
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const stats = [
    { label: "Active Users", value: "24,847", change: "+12.5%", color: "text-orange-500" },
    { label: "Transactions Today", value: "1,892", change: "+8.2%", color: "text-orange-500" },
    { label: "Revenue Today", value: "$89,247", change: "+15.3%", color: "text-green-500 decoration-green-500/50" },
    { label: "Security Alerts", value: "12", change: "High Priority", color: "text-red-500" },
  ];

  return (
    <div className="flex bg-black min-h-screen font-sans text-gray-300">
      {/* Pass states to AdminAside to handle collapse (desktop) 
        and drawer (mobile) logic.
      */}
      <AdminAside 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <main className="flex-1 min-w-0 overflow-y-auto transition-all duration-300">
        {/* Header */}
        <header className="h-20 border-b border-white/10 bg-[#0B0E14]/50 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
          
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Menu Button - Only visible on small screens */}
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg"
            >
              <Menu size={20} />
            </button>

            <div className="relative max-w-md w-full hidden sm:block group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search users, transactions..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 outline-none focus:border-orange-500/50 transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <button className="hidden lg:block bg-orange-500 hover:bg-orange-600 text-black font-bold text-[10px] uppercase tracking-widest cursor-pointer px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-orange-500/10">
              Quick Actions
            </button>
            
            <div className="flex gap-2 md:gap-4 text-gray-500">
              <div className="relative p-2 hover:bg-white/5 hover:text-white rounded-lg cursor-pointer">
                <Bell size={20} />
              </div>
              <Link to="/admin-settings">
                <Gear size={20} className="p-2 hover:bg-white/5 rounded-lg cursor-pointer w-9 h-9 hover:text-white" />
              </Link>
            </div>
            <img src="/public/img/kyrologo.png" className="w-8 h-8 md:w-10 md:h-10 rounded-xl border border-white/20 object-cover" alt="Admin" />
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 md:p-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-orange-500 text-2xl font-bold tracking-tight italic">Dashboard Overview</h2>
              <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] mt-1 font-semibold">Real-time platform metrics and monitoring</p>
            </div>
          </div>

          {/* Stats Grid - Responsive columns (1, 2, or 4) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-[#0B0E14] border border-white/5 p-6 rounded-2xl hover:border-orange-500/20 transition-all">
                <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-3">{stat.label}</p>
                <h3 className={`text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</h3>
                <p className="text-[10px] text-gray-600 font-semibold">{stat.change} from yesterday</p>
              </div>
            ))}
          </div>

          {/* Lower Grid: Real Time & System Health */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Real-Time Activity */}
            <div className="xl:col-span-1 bg-[#0B0E14] border border-white/5 p-6 rounded-2xl">
              <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-6">Real-Time Activity</h4>
              <div className="space-y-3">
                {[
                  { title: "User Login", desc: "alex.chen@email.com from NYC", time: "2m ago", color: "bg-green-500" },
                  { title: "Deposit", desc: "$2,500 BTC deposit confirmed", time: "5m ago", color: "bg-blue-500" },
                  { title: "Suspicious Activity", desc: "Multiple failed login attempts", time: "12m ago", color: "bg-red-500" },
                ].map((act, i) => (
                  <div key={i} className="flex gap-4 items-start bg-black/40 p-3 rounded-xl border border-white/5">
                    <div className={`w-1 min-h-[40px] rounded-full ${act.color} opacity-100 shrink-0`}></div>
                    <div className="min-w-0">
                      <p className="text-white text-xs font-bold truncate">{act.title}</p>
                      <p className="text-gray-500 text-[10px] line-clamp-1">{act.desc}</p>
                      <p className="text-gray-600 text-[9px] uppercase mt-1 tracking-tighter">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Actions */}
            <div className="xl:col-span-2 space-y-4">
               {/* Withdrawal Card */}
               <div className="bg-[#1A1608] border border-orange-500/20 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="bg-orange-500/20 p-3 rounded-xl text-orange-500 shrink-0 h-fit">
                      <History size={24} />
                    </div>
                    <div>
                      <h4 className="text-orange-500 text-xs font-bold uppercase tracking-widest">High-Value Withdrawal</h4>
                      <p className="text-gray-400 text-xs mt-1">$125,000 BTC withdrawal by sarah.m@email.com</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 sm:flex-none bg-orange-500 text-black px-4 py-2 rounded-lg text-[10px] font-bold uppercase cursor-pointer hover:bg-orange-600 transition-colors">Approve</button>
                    <button className="flex-1 sm:flex-none bg-white/5 text-gray-400 px-4 py-2 rounded-lg text-[10px] font-bold uppercase border border-white/10 hover:bg-red-500/10 hover:text-red-500 cursor-pointer transition-all">Reject</button>
                  </div>
               </div>

               {/* KYC Card */}
               <div className="bg-[#0A111A] border border-blue-500/20 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="bg-blue-500/20 p-3 rounded-xl text-blue-500 shrink-0 h-fit">
                      <Users size={24} />
                    </div>
                    <div>
                      <h4 className="text-blue-400 text-xs font-bold uppercase tracking-widest">KYC Verification</h4>
                      <p className="text-gray-400 text-xs mt-1">Document review for sarah.mitchell@email.com</p>
                    </div>
                  </div>
                  <button className="w-full sm:w-auto bg-orange-500 text-black px-4 py-2 rounded-lg text-[10px] font-bold uppercase cursor-pointer hover:bg-orange-600 transition-colors">Review</button>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
