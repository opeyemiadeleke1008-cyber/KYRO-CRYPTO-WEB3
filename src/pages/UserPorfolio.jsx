import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Aside from "../layout/Aside";
import UserNavbar from "../components/UserNavbar";
import LineChart from "../components/LineChart";
import WalletModal from "../components/WalletModal";
import NotificationToast from "../components/NotificationToast"; // Import Toast
import { auth } from "../firebase";
import { createNotification } from "../services/notifications";

const UserPorfolio = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [timePeriod, setTimePeriod] = useState("24H");
  
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [currentUid, setCurrentUid] = useState("");

  // --- TOAST STATE ---
  const [notification, setNotification] = useState({ isOpen: false, message: "" });

  const showNotification = (msg) => {
    // Reset first to allow re-triggering of the same message
    setNotification({ isOpen: false, message: "" });
    setTimeout(() => {
      setNotification({ isOpen: true, message: msg });
    }, 10);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (!authUser) {
        navigate("/signup");
        return;
      }
      setCurrentUid(authUser.uid);
    });
    return () => unsubscribe();
  }, [navigate]);

  const pushNotification = async (title, message, type = "info") => {
    if (!currentUid) return;
    await createNotification(currentUid, { title, message, type });
  };

  const handleConnect = (walletName) => {
    setIsConnected(true);
    setWalletAddress("0x71C...4E81");
    setIsWalletModalOpen(false);
    showNotification(`Connected to ${walletName} successfully`);
    pushNotification(
      "Wallet Connected",
      `Connected to ${walletName} successfully.`,
      "success",
    );
  };

  // --- UPDATED ACTION HANDLER (No Alerts) ---
  const handleAssetAction = (asset, action) => {
    if (!isConnected) {
      showNotification("Authentication Required: Connect Wallet");
      pushNotification(
        "Wallet Required",
        "You need to connect a wallet before this action.",
        "warning",
      );
      
      // Auto-open modal after toast appears
      setTimeout(() => {
        setIsWalletModalOpen(true);
      }, 800); 
      return;
    }
    
    // Custom messages for each action
    const actionMessages = {
      buy: `Opening Purchase Terminal for ${asset}...`,
      sell: `Executing Sell Protocol for ${asset}...`,
      swap: `Routing Swap Liquidity for ${asset}...`,
      trade: `Launching Trade Interface for ${asset}...`
    };

    const message =
      actionMessages[action.toLowerCase()] || `${action} initiated for ${asset}`;
    showNotification(message);
    pushNotification(
      "Portfolio Action",
      message,
      "info",
    );
  };

  const assetHoldings = [
    { asset: "BTC", balance: "2.45673", value: "$43,256.78", change: "+3.3%", action: "Buy" },
    { asset: "SOL", balance: "2.45673", value: "$43,256.78", change: "+3.3%", action: "Swap" },
    { asset: "ETH", balance: "2.45673", value: "$43,256.78", change: "+3.3%", action: "Trade" },
    { asset: "BNB", balance: "2.45673", value: "$43,256.78", change: "+3.3%", action: "Sell" },
  ];

  const totalValue = assetHoldings.reduce(
    (total, holding) => total + parseFloat(holding.value.replace("$", "").replace(",", "")),
    0
  );

  return (
    <div className="bg-black text-white flex font-sans overflow-hidden h-screen">
      {/* 1. NOTIFICATION TOAST COMPONENT */}
      <NotificationToast 
        isOpen={notification.isOpen} 
        message={notification.message}
        onClose={() => setNotification({ ...notification, isOpen: false })}
      />

      <WalletModal 
        isOpen={isWalletModalOpen} 
        onClose={() => setIsWalletModalOpen(false)} 
        onSelect={handleConnect} 
      />

      <UserNavbar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <Aside isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <main className="flex-1 overflow-y-auto bg-black p-4 md:p-8 w-full relative top-15 md:top-0 scrollbar-hidden">
        <header className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight uppercase italic text-orange-500">
            Portfolio
          </h2>
          
          {!isConnected ? (
            <button 
              onClick={() => setIsWalletModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 transition-all cursor-pointer font-bold text-xs px-4 py-2 rounded-lg shadow-lg shadow-orange-500/20 active:scale-95"
            >
              + Connect Wallet
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-[#0B0E14] border border-white/10 px-3 py-1.5 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-[10px] font-mono text-gray-300 tracking-tighter">{walletAddress}</span>
              <button 
                onClick={() => {
                  setIsConnected(false);
                  showNotification("Wallet Disconnected");
                  pushNotification(
                    "Wallet Disconnected",
                    "Wallet connection was closed.",
                    "info",
                  );
                }}
                className="text-[10px] text-gray-500 hover:text-red-500 uppercase font-bold ml-2 transition-colors"
              >
                Exit
              </button>
            </div>
          )}
        </header>

        {/* Portfolio Overview Section */}
        <div className="bg-[#0B0E14] rounded-3xl p-6 border border-white/10 shadow-2xl">
          <div className="flex justify-between items-start">
            <div className="flex gap-3 md:flex-row flex-col">
              <h3 className="text-lg font-bold tracking-tight uppercase italic text-orange-500">
                Portfolio Overview
              </h3>
              <p className="text-[10px] font-bold text-gray-200 bg-white/5 border border-white/10 rounded-full px-3 py-1 self-start uppercase tracking-widest">
                <span className="text-orange-500">{isConnected ? "1" : "0"}</span> Wallet active
              </p>
            </div>
            
            <div className="text-[10px] font-black bg-black border border-white/10 rounded-xl flex p-1 items-center">
              {["24H", "7D", "30D", "ALL"].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimePeriod(period)}
                  className={`px-3 py-1 rounded-lg transition-all uppercase tracking-tighter ${
                    timePeriod === period ? "bg-orange-500 text-black shadow-md" : "text-gray-500 hover:text-white"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="flex md:flex-col flex-row md:justify-start justify-between mt-4">
            <div>
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Total Equity</p>
              <p className="font-mono text-3xl font-black">
                $<span className="text-white">{isConnected ? totalValue.toLocaleString() : "0.00"}</span>
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="h-64 rounded-2xl overflow-hidden">
              <LineChart timePeriod={timePeriod} />
            </div>
          </div>
        </div>

        {/* Asset Holdings Section */}
        <div className="mt-8 mb-10 bg-[#0B0E14] rounded-3xl p-6 border border-white/10">
          <h3 className="text-lg font-bold tracking-tight uppercase italic text-orange-500 mb-6">
            Asset Holdings
          </h3>

          <div className="overflow-x-auto">
            <div className="flex justify-between items-center py-2 px-2 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/10">
                <p className="w-1/5">Asset</p>
                <p className="w-1/5">Balance</p>
                <p className="w-1/5">Value</p>
                <p className="w-1/5 text-center">24H Change</p>
                <p className="w-1/5 text-right pr-4">Action</p>
            </div>

            {assetHoldings.map((holding, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center py-4 px-2 text-[11px] font-bold border-b border-white/5 transition-colors hover:bg-white/2"
              >
                <p className="w-1/5 text-white">{holding.asset}</p>
                <p className="w-1/5 font-mono text-gray-400">{holding.balance}</p>
                <p className="w-1/5 font-mono text-gray-300">{holding.value}</p>
                <p className={`w-1/5 font-mono text-center ${holding.change.startsWith('+') ? 'text-teal-500' : 'text-red-500'}`}>
                  {holding.change}
                </p>
                <div className="w-1/5 text-right">
                  <button 
                    onClick={() => handleAssetAction(holding.asset, holding.action)}
                    className="text-orange-500 bg-orange-500/5 border border-orange-500/20 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase italic hover:bg-orange-500 hover:text-black transition-all cursor-pointer active:scale-90"
                  >
                    {holding.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserPorfolio;
