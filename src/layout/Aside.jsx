import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Wallet,
  Repeat,
  TrendingUp,
  FileText,
  Calendar,
  Settings,
  Bell,
  LogOut,
  Pickaxe,
  X,
  ChevronLeft,
  ChevronRight,
  File,
  Asterisk, // Changed Stone to Pickaxe (standard Lucide icon)
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Import useLocation
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { subscribeUnreadNotificationsCount } from "../services/notifications";

const NavItem = ({ icon, label, active, collapsed, badgeCount = 0 }) => (
  <div
    className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all group relative ${
      active
        ? "bg-orange-500 text-black font-bold"
        : "text-gray-400 hover:text-white hover:bg-white/5"
    } ${collapsed ? "justify-center" : "justify-start"}`}
  >
    {icon}
    {!collapsed && (
      <span className="text-xs uppercase tracking-widest">{label}</span>
    )}
    {badgeCount > 0 && (
      <span
        className={`ml-auto bg-orange-500 text-black text-[10px] font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center ${
          collapsed ? "absolute -top-1 -right-1" : ""
        }`}
      >
        {badgeCount > 99 ? "99+" : badgeCount}
      </span>
    )}
    {collapsed && (
      <div className="absolute left-16 bg-orange-500 text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-all uppercase tracking-widest z-50 whitespace-nowrap shadow-xl">
        {label}
      </div>
    )}
  </div>
);

const Aside = ({
  isCollapsed,
  setIsCollapsed,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const location = useLocation(); // This gets the current URL path
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let unsubscribeUnread = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      unsubscribeUnread();
      if (!authUser) {
        setUnreadCount(0);
        return;
      }
      unsubscribeUnread = subscribeUnreadNotificationsCount(
        authUser.uid,
        setUnreadCount,
      );
    });

    return () => {
      unsubscribeUnread();
      unsubscribeAuth();
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("user_token");
    navigate("/");
  };

  // Helper function to check if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay logic remains the same... */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`bg-[#0B0E14] border-r overflow-y-auto scrollbar-hide border-white/5 flex flex-col p-4 lg:flex h-screen fixed top-0 left-0 transition-all duration-300 z-50 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:sticky ${isCollapsed ? "w-20" : "w-64"}`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between mb-10 px-2">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <img
                src="/img/kyrologo.png"
                alt="Kyro"
                className="w-8 h-8 object-contain"
              />
              <span className="font-black italic tracking-tighter text-xl text-white">
                KYRO
              </span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:block p-1.5 rounded-lg bg-white/5 hover:bg-orange-500 hover:text-black transition-all text-gray-400"
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        </div>

        <nav className="space-y-1 flex-1">
          {!isCollapsed && (
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-4 px-2">
              Main Menu
            </p>
          )}

          <Link to="/user-dashboard">
            <NavItem
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
              active={isActive("/user-dashboard")}
              collapsed={isCollapsed}
            />
          </Link>

          <Link to="/user-portfolio">
            <NavItem
              icon={<Wallet size={18} />}
              label="Portfolio"
              active={isActive("/user-portfolio")}
              collapsed={isCollapsed}
            />
          </Link>

          <Link to="/user-swap">
            <NavItem
              icon={<Repeat size={18} />}
              label="Swap"
              active={isActive("/user-swap")}
              collapsed={isCollapsed}
            />
          </Link>

          <Link to="/user-market">
            <NavItem
              icon={<TrendingUp size={18} />}
              label="Market"
              active={isActive("/user-market")}
              collapsed={isCollapsed}
            />
          </Link>

          <Link to="/user-mining">
            <NavItem
              icon={<Pickaxe size={18} />}
              label="Mining"
              active={isActive("/user-mining")}
              collapsed={isCollapsed}
            />
          </Link>

          <Link to="/user-referral">
            <NavItem
              icon={<Asterisk size={18} />}
              label="Referral"
              active={isActive("/user-referral")}
              collapsed={isCollapsed}
            />
          </Link>

          {!isCollapsed && (
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-8 mb-4 px-2">
              Settings
            </p>
          )}

          <Link to="/user-settings">
            <NavItem
              icon={<Settings size={18} />}
              label="Settings"
              active={isActive("/user-settings")}
              collapsed={isCollapsed}
            />
          </Link>

          <Link to="/notification">
            <NavItem
              icon={<Bell size={18} />}
              label="Notifications"
              active={isActive("/notification")}
              collapsed={isCollapsed}
              badgeCount={unreadCount}
            />
          </Link>

          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl mt-6 text-red-500 hover:bg-red-500/10 transition-all ${isCollapsed ? "justify-center" : "justify-start"}`}
          >
            <LogOut size={18} />
            {!isCollapsed && (
              <span className="text-xs font-bold uppercase tracking-widest">
                Logout
              </span>
            )}
          </button>
          <div
            className={`mt-auto pt-10 shrink-0 ${isCollapsed ? "px-1" : "block"}`}
          >
            <div className="bg-linear-to-br from-orange-500/10 to-transparent p-4 rounded-2xl border border-orange-500/20">
              {!isCollapsed ? (
                <>
                  <p className="text-xs font-bold mb-1 text-center">
                    Membership
                  </p>
                  <button className="w-full py-2 bg-orange-500 text-black text-[10px] font-black uppercase rounded-lg hover:bg-white transition-all cursor-pointer" onClick={()=> navigate("/user-membership")}>
                    Get Started
                  </button>
                </>
              ) : (
                <button className="w-full aspect-square flex items-center justify-center bg-orange-500 text-black rounded-xl font-bold text-[10px] hover:bg-white transition-all">
                  PRO
                </button>
              )}
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Aside;
