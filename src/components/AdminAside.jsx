import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Activity, Users, UserCog, 
  History, BarChart3, ShieldCheck, Settings, LogOut,
  ChevronLeft, ChevronRight 
} from "lucide-react";

const AdminAside = () => {
  const location = useLocation();
  // State to handle collapse
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/admin" },
    { name: "Activity Monitor", icon: <Activity size={18} />, path: "/admin/activity" },
    { name: "User Management", icon: <Users size={18} />, path: "/admin/users" },
    { name: "Membership Management", icon: <UserCog size={18} />, path: "/admin/membership" },
    { name: "Transaction History", icon: <History size={18} />, path: "/admin/transactions" },
    { name: "Analytics & Reports", icon: <BarChart3 size={18} />, path: "/admin/analytics" },
    { name: "Security Audit Logs", icon: <ShieldCheck size={18} />, path: "/admin/security" },
    { name: "Admin Settings", icon: <Settings size={18} />, path: "/admin/settings" },
  ];

  return (
    <aside className={`${isCollapsed ? "w-20" : "w-64"} bg-[#0B0E14] border-r border-white/10 hidden md:flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out`}>
      
      {/* Header Section with Toggle */}
      <div className={`p-6 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="">
              <img src="/public/img/kyrologo.png" alt="" className="h-14 w-14"/>
            </div>
            <h1 className="text-white font-bold text-xl tracking-tight italic">KYRO</h1>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-white/5 rounded-lg text-gray-500 hover:text-orange-500 transition-colors border border-white/5"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-x-hidden">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            // Title shows the name on hover when collapsed
            title={isCollapsed ? item.name : ""}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs font-semibold uppercase tracking-wider ${
              location.pathname === item.path
                ? "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            } ${isCollapsed ? "justify-center px-0" : ""}`}
          >
            <div className="shrink-0">{item.icon}</div>
            {!isCollapsed && <span className="truncate">{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-white/10">
        <button className={`flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:text-red-500 transition-colors text-xs font-bold uppercase tracking-widest ${isCollapsed ? "justify-center px-0" : ""}`}>
          <LogOut size={18} />
          {!isCollapsed && <span>Terminate Session</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminAside;