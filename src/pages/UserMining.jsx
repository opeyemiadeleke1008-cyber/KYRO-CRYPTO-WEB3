import React, { useState, useEffect } from "react";
import {
  Gem,
  Zap,
  Calendar,
  Trophy,
  AlertTriangle,
  Pickaxe,
} from "lucide-react";
import Aside from "../layout/Aside";
import UserNavbar from "../components/UserNavbar";
import NotificationToast from "../components/NotificationToast";

const UserMining = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- PERSISTENT STATE ---
  const [diamonds, setDiamonds] = useState(
    () => Number(localStorage.getItem("mining_diamonds")) || 0,
  );
  const [streak, setStreak] = useState(
    () => Number(localStorage.getItem("mining_streak")) || 0,
  );
  const [lastMined, setLastMined] = useState(
    () => localStorage.getItem("mining_last_date") || "",
  );
  const [isMining, setIsMining] = useState(false);

  // --- TOAST STATE ---
  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
  });

  const showNotification = (msg) => {
    // Force reset if a toast is already open to ensure the new message triggers the animation
    setNotification({ isOpen: false, message: "" });
    setTimeout(() => {
      setNotification({ isOpen: true, message: msg });
    }, 10);
  };

  const today = new Date().toISOString().split("T")[0];
  const canMineToday = lastMined !== today;

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem("mining_diamonds", diamonds);
    localStorage.setItem("mining_streak", streak);
    localStorage.setItem("mining_last_date", lastMined);
  }, [diamonds, streak, lastMined]);

  // Streak Reset Check
  useEffect(() => {
    if (lastMined) {
      const lastDate = new Date(lastMined);
      const currentDate = new Date(today);
      const diffTime = currentDate - lastDate;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays > 1) {
        setStreak(0);
        showNotification("Streak Reset: Protocol inactivity detected.");
      }
    }
  }, [lastMined, today]);

  const handleMine = () => {
    // Replace silent return with a notification if they try to click while on cooldown
    if (!canMineToday) {
      showNotification("Cooldown Active: Return in the next cycle.");
      return;
    }

    setIsMining(true);

    setTimeout(() => {
      let newStreak = streak + 1;
      let reward = 10;
      let msg = "Success: 10 Diamonds Extracted.";

      if (newStreak === 7) {
        reward += 20;
        newStreak = 0;
        msg = "Critical Success: 7-Day Bonus +30 Diamonds!";
      }

      setStreak(newStreak);
      setDiamonds((prev) => prev + reward);
      setLastMined(today);
      setIsMining(false);

      // Use Toast instead of alert
      showNotification(msg);
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      {/* High-priority Toast layer */}
      <NotificationToast
        isOpen={notification.isOpen}
        message={notification.message}
        onClose={() => setNotification({ ...notification, isOpen: false })}
      />

      <UserNavbar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <Aside
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="flex-1 overflow-y-auto bg-black p-4 md:p-8 flex flex-col items-center scrollbar-hidden">
        {/* Header */}
        <header className="w-full max-w-4xl mb-8 flex justify-between items-end border-b border-white/5 pb-6">
          <div>
            <h2 className="text-3xl font-black uppercase italic text-orange-500 tracking-tighter">
              Diamond Extraction
            </h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold">
              Node: Active // Secure Connection
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-2xl">
              <Gem size={18} className="text-orange-500" />
              <span className="text-xl font-mono font-black">{diamonds}</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-4xl">
          <div className="lg:col-span-2 bg-[#0B0E14] border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/10 blur-[100px] pointer-events-none" />

            <div
              className={`relative z-10 p-12 rounded-full border-4 border-dashed transition-colors duration-500 ${canMineToday ? "border-orange-500 animate-spin-slow" : "border-gray-800"}`}
            >
              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-700 shadow-[0_0_50px_rgba(249,115,22,0.3)] ${isMining ? "animate-bounce" : ""}`}
              >
                <Pickaxe size={48} className="text-black" />
              </div>
            </div>

            <div className="mt-8 text-center z-10">
              <h3 className="text-xl font-bold uppercase italic tracking-widest mb-2">
                {canMineToday ? "System Ready" : "Protocol Cooldown"}
              </h3>
              <p className="text-xs text-gray-500 max-w-[280px] font-bold uppercase tracking-tight">
                {canMineToday
                  ? "Authorize the extraction sequence to claim your assets."
                  : "Daily limit reached. Claim tomorrow..."}
              </p>
            </div>

            <button
              disabled={isMining} // Removed canMineToday check so users can see the "cooldown" toast if they click
              onClick={handleMine}
              className={`mt-8 w-full py-5 rounded-2xl font-black uppercase italic transition-all transform active:scale-95 flex items-center justify-center gap-3 cursor-pointer ${
                canMineToday
                  ? "bg-orange-500 hover:bg-white text-black shadow-lg shadow-orange-500/20"
                  : "bg-white/5 text-gray-600 border border-white/5"
              }`}
            >
              {isMining
                ? "Authorizing..."
                : canMineToday
                  ? "Initiate Extraction"
                  : "Extraction Locked"}
              <Zap size={18} fill="currentColor" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Streak Card */}
            <div className="bg-[#0B0E14] border border-white/10 rounded-[2rem] p-6 relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
                  Mining Streak
                </p>
                <Calendar size={14} className="text-orange-500" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black italic text-white">
                  {streak}
                </span>
                <span className="text-sm font-bold text-orange-500 uppercase mb-2">
                  Days
                </span>
              </div>

              <div className="flex gap-2 mt-6">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <div
                    key={day}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${
                      day <= streak ? "bg-orange-500" : "bg-white/10"
                    } ${day === 7 ? "bg-teal-500/30" : ""}`}
                  />
                ))}
              </div>
            </div>

            {/* Program Info */}
            <div className="bg-orange-500/5 border border-orange-500/10 rounded-[2rem] p-6">
              <div className="flex items-center gap-3 mb-4 text-orange-500">
                <Trophy size={20} />
                <h4 className="text-xs font-black uppercase italic tracking-widest">
                  Protocol Rewards
                </h4>
              </div>
              <ul className="space-y-3">
                <li className="flex justify-between text-[10px] font-bold uppercase">
                  <span className="text-gray-500">Standard Yield</span>
                  <span>10 💎</span>
                </li>
                <li className="flex justify-between text-[10px] font-bold uppercase">
                  <span className="text-gray-500">7-Day Multiplier</span>
                  <span className="text-teal-500">+20 💎</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default UserMining;
