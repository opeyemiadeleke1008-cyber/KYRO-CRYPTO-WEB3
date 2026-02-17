import React, { useEffect, useMemo, useState } from "react";
import Aside from "../layout/Aside";
import UserNavbar from "../components/UserNavbar";

const UserReferral = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("kyro_user"));
    setUserId(storedUser?.id || "");
  }, []);

  const referralCode = useMemo(() => {
    if (!userId) return "";
    const normalizedId = String(userId).toUpperCase().replace(/[^A-Z0-9-]/g, "");
    return `KYRO-${normalizedId}`;
  }, [userId]);

  const referralLink = useMemo(() => {
    if (!referralCode) return "";
    return `${window.location.origin}/signup?ref=${encodeURIComponent(referralCode)}`;
  }, [referralCode]);

  const handleCopy = async () => {
    if (!referralCode) return;
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-black text-white flex h-screen overflow-hidden">
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

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest mb-6">
          Referral Center
        </h2>

        <div className="bg-[#0B0E14] border border-white/10 rounded-2xl p-6 max-w-2xl">
          {referralCode ? (
            <>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                Your Referral Code
              </p>
              <p className="text-lg md:text-xl font-bold text-orange-500 break-all mb-4">
                {referralCode}
              </p>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                Referral Link
              </p>
              <p className="text-sm break-all text-gray-300 mb-6">{referralLink}</p>
              <button
                onClick={handleCopy}
                className="bg-orange-500 hover:bg-orange-600 text-black px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer"
              >
                {copied ? "Copied" : "Copy Code"}
              </button>
            </>
          ) : (
            <p className="text-sm text-gray-400">
              No user ID found. Sign up first to generate your referral code.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserReferral;
