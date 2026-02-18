import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Bell,
  Users,
  Activity,
  ShieldAlert,
  Crown,
  CheckCircle2,
  AlertTriangle,
  Clock3,
} from "lucide-react";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import AdminAside from "../components/AdminAside";
import { auth, db } from "../firebase";
import { createNotification } from "../services/notifications";
import {
  canAccessAdmin,
  fetchAdminRecordByEmail,
  normalizeEmail,
} from "../services/adminAccess";

const toDate = (value) => {
  if (!value) return null;
  if (value?.toDate) return value.toDate();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatTime = (value) => {
  const date = toDate(value);
  if (!date) return "just now";
  return date.toLocaleString();
};

const getMembershipTier = (user) => {
  const explicitTier =
    user.membershipTier || user.membership?.tier || user.plan || user.tier;
  if (explicitTier) {
    const normalized = String(explicitTier).toLowerCase();
    if (normalized.includes("elite") || normalized.includes("whale"))
      return "Elite";
    if (normalized.includes("pro")) return "Pro";
    return "Basic";
  }

  const diamonds = Number(user?.mining?.diamonds || 0);
  if (diamonds >= 120) return "Elite";
  if (diamonds >= 30) return "Pro";
  return "Basic";
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [userSources, setUserSources] = useState({
    users: [],
    Users: [],
    kyro_users: [],
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingKycFor, setUpdatingKycFor] = useState("");
  const [syncError, setSyncError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (!authUser?.email) {
        navigate("/admin-signin");
        return;
      }
      const email = normalizeEmail(authUser.email);
      const adminRecord = await fetchAdminRecordByEmail(email);
      if (!canAccessAdmin({ email, adminRecord })) {
        navigate("/admin-signin");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const sourceNames = ["users", "Users", "kyro_users"];
    const unsubscribers = sourceNames.map((sourceName) =>
      onSnapshot(
        collection(db, sourceName),
        (snapshot) => {
          const rows = snapshot.docs.map((entry) => ({
            uid: entry.id,
            ...entry.data(),
            _source: sourceName,
          }));
          setUserSources((prev) => ({ ...prev, [sourceName]: rows }));
          setLoading(false);
        },
        () => {
          setLoading(false);
        },
      ),
    );

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  const users = useMemo(() => {
    const merged = [
      ...userSources.users,
      ...userSources.Users,
      ...userSources.kyro_users,
    ];
    const byKey = new Map();
    merged.forEach((row) => {
      const key = row.uid || row.email;
      if (!key) return;
      if (!byKey.has(key)) byKey.set(key, row);
    });
    return Array.from(byKey.values());
  }, [userSources]);

  useEffect(() => {
    if (loading) return;
    if (users.length === 0) {
      setSyncError(
        "No user documents found in Firestore collections: users, Users, kyro_users.",
      );
    } else {
      setSyncError("");
    }
  }, [loading, users.length]);

  const metrics = useMemo(() => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    let activeUsersToday = 0;
    let pendingKyc = 0;
    let verifiedKyc = 0;
    const tiers = { Basic: 0, Pro: 0, Elite: 0 };

    users.forEach((user) => {
      const updatedAt = toDate(user.updatedAt) || toDate(user.createdAt);
      if (updatedAt && updatedAt >= twentyFourHoursAgo) activeUsersToday += 1;

      const kycStatus = user?.kyc?.status || "Not Submitted";
      if (kycStatus === "Submitted") pendingKyc += 1;
      if (kycStatus === "Verified") verifiedKyc += 1;

      tiers[getMembershipTier(user)] += 1;
    });

    return {
      totalUsers: users.length,
      activeUsersToday,
      pendingKyc,
      verifiedKyc,
      tiers,
    };
  }, [users]);

  const filteredUsers = useMemo(() => {
    const queryText = search.trim().toLowerCase();
    if (!queryText) return users;
    return users.filter((user) => {
      const haystack =
        `${user.name || ""} ${user.email || ""} ${getMembershipTier(user)}`.toLowerCase();
      return haystack.includes(queryText);
    });
  }, [search, users]);

  const activityFeed = useMemo(() => {
    const rows = [];

    filteredUsers.forEach((user) => {
      const label = user.name || user.email || "Unknown User";
      const updatedAt = user.updatedAt || user.createdAt;

      rows.push({
        key: `${user.uid}-profile`,
        title: "Profile Activity",
        description: `${label} updated account activity.`,
        time: updatedAt,
        type: "profile",
      });

      if (user?.kyc?.status === "Submitted") {
        rows.push({
          key: `${user.uid}-kyc`,
          title: "KYC Submission",
          description: `${label} submitted KYC for review.`,
          time: updatedAt,
          type: "kyc",
        });
      }

      if (user?.mining?.lastMined) {
        rows.push({
          key: `${user.uid}-mining`,
          title: "Mining Activity",
          description: `${label} mined on ${user.mining.lastMined}.`,
          time: updatedAt,
          type: "mining",
        });
      }
    });

    return rows
      .sort((a, b) => {
        const d1 = toDate(a.time)?.getTime() || 0;
        const d2 = toDate(b.time)?.getTime() || 0;
        return d2 - d1;
      })
      .slice(0, 8);
  }, [filteredUsers]);

  const kycQueue = useMemo(
    () =>
      filteredUsers
        .filter((user) => user?.kyc?.status === "Submitted")
        .sort((a, b) => {
          const d1 = toDate(a.updatedAt)?.getTime() || 0;
          const d2 = toDate(b.updatedAt)?.getTime() || 0;
          return d2 - d1;
        }),
    [filteredUsers],
  );

  const handleKycDecision = async (user, status) => {
    try {
      setUpdatingKycFor(user.uid);
      await updateDoc(doc(db, "users", user.uid), {
        kyc: {
          ...(user.kyc || {}),
          status,
        },
      });

      await createNotification(user.uid, {
        title: "KYC Update",
        message:
          status === "Verified"
            ? "Your KYC has been approved by admin."
            : "Your KYC needs corrections. Please update and resubmit.",
        type: status === "Verified" ? "success" : "warning",
      });
    } finally {
      setUpdatingKycFor("");
    }
  };

  const totalMemberships =
    metrics.tiers.Basic + metrics.tiers.Pro + metrics.tiers.Elite || 1;
  const basicPercent = (metrics.tiers.Basic / totalMemberships) * 100;
  const proPercent = (metrics.tiers.Pro / totalMemberships) * 100;
  const elitePercent = (metrics.tiers.Elite / totalMemberships) * 100;

  return (
    <div className="flex bg-black min-h-screen font-sans text-gray-300">
      <AdminAside />

      <main className="flex-1 min-w-0 overflow-y-auto">
        <header className="h-20 border-b border-white/10 bg-[#0B0E14]/60 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 gap-4">
          <div className="relative max-w-md w-full group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users, activities..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 outline-none focus:border-orange-500/50 transition-all text-sm"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative p-2 rounded-lg bg-white/5 text-gray-400">
              <Bell
                size={18}
                className="cursor-pointer hover:text-white transition-colors"
              />
              {metrics.pendingKyc > 0 && (
                <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center bg-orange-500 text-black rounded-full text-[10px] font-bold">
                  {metrics.pendingKyc > 99 ? "99+" : metrics.pendingKyc}
                </span>
              )}
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-black font-bold text-[10px] uppercase tracking-widest cursor-pointer px-4 py-2.5 rounded-lg transition-all">
              Quick Actions
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 space-y-8">
          <div>
            <h2 className="text-orange-500 text-2xl font-bold tracking-tight italic">
              Dashboard Overview
            </h2>
            <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] mt-1 font-semibold">
              Live data from user activities
            </p>
            {syncError && (
              <p className="text-red-400 text-xs mt-2">{syncError}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <MetricCard
              label="Total Users"
              value={String(metrics.totalUsers)}
              note="Registered accounts"
              icon={<Users size={18} />}
            />
            <MetricCard
              label="Active (24h)"
              value={String(metrics.activeUsersToday)}
              note="Profiles updated in last 24h"
              icon={<Activity size={18} />}
            />
            <MetricCard
              label="Pending KYC"
              value={String(metrics.pendingKyc)}
              note="Needs admin review"
              icon={<ShieldAlert size={18} />}
            />
            <MetricCard
              label="Verified KYC"
              value={String(metrics.verifiedKyc)}
              note="Approved identities"
              icon={<CheckCircle2 size={18} />}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <section className="xl:col-span-1 bg-[#0B0E14] border border-white/10 p-6 rounded-2xl">
              <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-5">
                Real-Time Activity
              </h3>
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {activityFeed.length === 0 && (
                  <p className="text-xs text-gray-500">
                    No activity available.
                  </p>
                )}
                {activityFeed.map((item) => (
                  <ActivityRow key={item.key} item={item} />
                ))}
              </div>
            </section>

            <section className="xl:col-span-1 bg-[#0B0E14] border border-white/10 p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white text-sm font-bold uppercase tracking-widest">
                  Membership Distribution
                </h3>
                <Crown size={16} className="text-orange-500" />
              </div>

              <div className="flex items-center justify-center mb-6">
                <div
                  className="w-40 h-40 rounded-full relative"
                  style={{
                    background: `conic-gradient(#3b82f6 0 ${basicPercent}%, #06b6d4 ${basicPercent}% ${basicPercent + proPercent}%, #f59e0b ${basicPercent + proPercent}% 100%)`,
                  }}
                >
                  <div className="absolute inset-6 rounded-full bg-[#0B0E14] border border-white/10 flex items-center justify-center text-center">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase">
                        Users
                      </p>
                      <p className="text-white text-xl font-bold">
                        {metrics.totalUsers}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <TierRow
                  name="Basic"
                  color="bg-blue-500"
                  value={metrics.tiers.Basic}
                />
                <TierRow
                  name="Pro"
                  color="bg-cyan-500"
                  value={metrics.tiers.Pro}
                />
                <TierRow
                  name="Elite"
                  color="bg-amber-500"
                  value={metrics.tiers.Elite}
                />
              </div>
            </section>

            <section className="xl:col-span-1 bg-[#0B0E14] border border-white/10 p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white text-sm font-bold uppercase tracking-widest">
                  Pending Actions
                </h3>
                <span className="text-[10px] uppercase text-orange-500">
                  {kycQueue.length} items
                </span>
              </div>

              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                {kycQueue.length === 0 && (
                  <p className="text-xs text-gray-500">
                    No pending KYC submissions right now.
                  </p>
                )}

                {kycQueue.map((user) => (
                  <div
                    key={user.uid}
                    className="bg-white/5 border border-white/10 rounded-xl p-4"
                  >
                    <p className="text-xs text-white font-bold">
                      KYC Verification Request
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {user.name || "Unnamed User"} ({user.email || "No email"})
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1">
                      Submitted: {formatTime(user.updatedAt || user.createdAt)}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleKycDecision(user, "Verified")}
                        disabled={updatingKycFor === user.uid}
                        className="bg-teal-500 text-black px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-teal-400 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleKycDecision(user, "Needs Review")}
                        disabled={updatingKycFor === user.uid}
                        className="bg-orange-500 text-black px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-orange-400 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        Request Update
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="bg-[#0B0E14] border border-white/10 rounded-2xl p-6">
            <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-4">
              System Health
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <HealthRow
                icon={<Clock3 size={16} className="text-cyan-400" />}
                label="Data Sync"
                value={loading ? "Syncing..." : "Live"}
                tone={loading ? "text-yellow-400" : "text-green-400"}
              />
              <HealthRow
                icon={<AlertTriangle size={16} className="text-orange-400" />}
                label="Pending KYC Alerts"
                value={String(metrics.pendingKyc)}
                tone={
                  metrics.pendingKyc > 0 ? "text-orange-400" : "text-green-400"
                }
              />
              <HealthRow
                icon={<Users size={16} className="text-blue-400" />}
                label="Tracked Users"
                value={String(metrics.totalUsers)}
                tone="text-blue-400"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const MetricCard = ({ label, value, note, icon }) => (
  <div className="bg-[#0B0E14] border border-white/10 p-6 rounded-2xl">
    <div className="flex items-center justify-between mb-4">
      <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">
        {label}
      </p>
      <div className="text-orange-500">{icon}</div>
    </div>
    <h3 className="text-3xl font-black text-white">{value}</h3>
    <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-wider">
      {note}
    </p>
  </div>
);

const ActivityRow = ({ item }) => {
  const accent =
    item.type === "kyc"
      ? "bg-orange-500"
      : item.type === "mining"
        ? "bg-teal-500"
        : "bg-blue-500";

  return (
    <div className="flex gap-4 items-start bg-black/40 p-3 rounded-xl border border-white/5">
      <div className={`w-1 min-h-[40px] rounded-full ${accent} shrink-0`} />
      <div className="min-w-0">
        <p className="text-white text-xs font-bold">{item.title}</p>
        <p className="text-gray-500 text-[10px]">{item.description}</p>
        <p className="text-gray-600 text-[9px] uppercase mt-1 tracking-tighter">
          {formatTime(item.time)}
        </p>
      </div>
    </div>
  );
};

const TierRow = ({ name, color, value }) => (
  <div className="flex items-center justify-between bg-black/30 rounded-lg px-3 py-2 border border-white/5">
    <div className="flex items-center gap-2">
      <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <span className="text-xs text-gray-400 uppercase tracking-wider">
        {name}
      </span>
    </div>
    <span className="text-sm text-white font-bold">{value}</span>
  </div>
);

const HealthRow = ({ icon, label, value, tone }) => (
  <div className="bg-black/30 rounded-xl border border-white/5 p-4 flex items-center gap-3">
    {icon}
    <div>
      <p className="text-[10px] uppercase tracking-wider text-gray-500">
        {label}
      </p>
      <p className={`text-sm font-bold ${tone}`}>{value}</p>
    </div>
  </div>
);

export default AdminDashboard;
