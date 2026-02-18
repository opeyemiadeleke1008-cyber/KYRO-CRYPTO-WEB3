import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Download,
  RefreshCw,
  Pencil,
  Shield,
  Trash2,
  UserPlus,
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import AdminAside from "../components/AdminAside";
import { auth, db } from "../firebase";
import {
  ADMINS_COLLECTION,
  SUPER_ADMIN_EMAILS,
  canAccessAdmin,
  fetchAdminRecordByEmail,
  getAllowedRole,
  normalizeEmail,
} from "../services/adminAccess";

const tabs = [
  "Administrator Accounts",
  "Roles & Permissions",
  "Platform Configuration",
  "Security Policies",
  "Notification Settings",
  "Integration Settings",
];

const permissionGroups = {
  "User Management": ["View Users", "Edit Accounts", "Suspend Users"],
  Transactions: ["View Transactions", "Approve Transactions"],
  "Reports & Data": ["View Reports", "Export Data"],
  "System Admin": ["Manage Admins", "Configure Settings"],
};

const roleColors = {
  "Super Admin": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Admin: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Moderator: "bg-teal-500/20 text-teal-300 border-teal-500/30",
};

const statusColors = {
  Active: "bg-green-500/20 text-green-300 border-green-500/30",
  Suspended: "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

const defaultPermissions = Object.values(permissionGroups)
  .flat()
  .reduce((acc, permission) => ({ ...acc, [permission]: false }), {});

const AdminSetting = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Administrator Accounts");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [admins, setAdmins] = useState([]);
  const [recentChangeAt, setRecentChangeAt] = useState(new Date());
  const [savedNotice, setSavedNotice] = useState("");
  const [syncError, setSyncError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "Admin",
    department: "Operations",
    twoFactor: false,
  });

  const [permissions, setPermissions] = useState(defaultPermissions);

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
    const adminsRef = collection(db, ADMINS_COLLECTION);
    const unsubscribe = onSnapshot(
      adminsRef,
      (snapshot) => {
        const rows = snapshot.docs.map((entry) => {
          const data = entry.data();
          const normalizedRole = getAllowedRole({
            email: data.email,
            desiredRole: data.role,
          });
          if (data.role !== normalizedRole) {
            updateDoc(doc(db, ADMINS_COLLECTION, entry.id), {
              role: normalizedRole,
              updatedAt: serverTimestamp(),
            });
          }
          return {
            id: entry.id,
            ...data,
            role: normalizedRole,
          };
        });
        setAdmins(rows);
        setSyncError("");
      },
      (error) => {
        setSyncError(error?.message || "Could not load admins from Firestore.");
      },
    );

    return () => unsubscribe();
  }, []);

  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) => {
      const matchesSearch =
        (admin.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (admin.email || "").toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "All Roles" || admin.role === roleFilter;
      const matchesStatus =
        statusFilter === "All Status" || admin.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [admins, search, roleFilter, statusFilter]);

  const showSavedNotice = (message) => {
    setSavedNotice(message);
    setTimeout(() => setSavedNotice(""), 1800);
  };

  const handleAdminAction = async (adminId, action) => {
    const selected = admins.find((admin) => admin.id === adminId);
    if (!selected) return;

    if (action === "delete") {
      await deleteDoc(doc(db, ADMINS_COLLECTION, adminId));
      setRecentChangeAt(new Date());
      showSavedNotice("Administrator removed");
      return;
    }

    if (action === "toggleStatus") {
      await updateDoc(doc(db, ADMINS_COLLECTION, adminId), {
        status: selected.status === "Active" ? "Suspended" : "Active",
        lastLogin: "just now",
        updatedAt: serverTimestamp(),
      });
      setRecentChangeAt(new Date());
      showSavedNotice("Administrator status updated");
      return;
    }

    showSavedNotice("Edit action ready");
  };

  const handleAddAdmin = async (event) => {
    event.preventDefault();
    const email = normalizeEmail(formData.email);
    const username = formData.username.trim();

    if (!username || !email) {
      showSavedNotice("Username and email are required");
      return;
    }

    const role = getAllowedRole({ email, desiredRole: formData.role });
    const payload = {
      name: username,
      email,
      role,
      status: "Active",
      twoFactor: formData.twoFactor,
      department: formData.department,
      lastLogin: "never",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await addDoc(collection(db, ADMINS_COLLECTION), payload);
    setFormData({
      username: "",
      email: "",
      role: "Admin",
      department: "Operations",
      twoFactor: false,
    });
    setRecentChangeAt(new Date());
    showSavedNotice(
      role === "Super Admin"
        ? "Super Admin created from allowlisted email"
        : "New administrator created",
    );
  };

  const handleSavePermissions = () => {
    setRecentChangeAt(new Date());
    showSavedNotice("Permission matrix saved");
  };

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      <AdminAside />

      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="h-20 border-b border-white/10 bg-[#0B0E14]/70 backdrop-blur-md px-4 md:px-8 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Settings</h1>
            <p className="text-xs text-gray-500">
              Firestore-backed administrator management
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="text-[11px] px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:text-white transition-colors flex items-center gap-2 cursor-pointer">
              <RefreshCw size={13} />
              Recent Changes
            </button>
            <button className="text-[11px] px-3 py-2 rounded-lg bg-orange-500 text-black font-bold hover:bg-orange-400 transition-colors flex items-center gap-2 cursor-pointer">
              <Download size={13} />
              Export Config
            </button>
          </div>
        </div>

        <section className="p-4 md:p-8 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 bg-[#0B0E14] border border-white/10 rounded-xl p-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[10px] md:text-[11px] px-3 py-2 rounded-lg border transition-all uppercase tracking-wider font-semibold cursor-pointer ${
                  activeTab === tab
                    ? "bg-orange-500/20 text-orange-300 border-orange-500/30"
                    : "bg-white/5 text-gray-400 border-white/5 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="bg-[#0B0E14] border border-white/10 rounded-2xl p-4 md:p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm md:text-base font-bold uppercase tracking-wider">
                Administrator Accounts
              </h2>
              <button
                onClick={() => setActiveTab("Administrator Accounts")}
                className="bg-orange-500 text-black px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-orange-400 transition-colors cursor-pointer flex items-center gap-2"
              >
                <Plus size={14} />
                Add Admin
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search administrators..."
                  className="w-full pl-9 pr-3 py-2.5 bg-black border border-white/10 rounded-lg text-sm outline-none focus:border-orange-500/50"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-black border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-500/50"
              >
                <option>All Roles</option>
                <option>Super Admin</option>
                <option>Admin</option>
                <option>Moderator</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-black border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-500/50"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Suspended</option>
              </select>
            </div>

            <div className="space-y-3">
              {filteredAdmins.map((admin) => (
                <div
                  key={admin.id}
                  className={`rounded-xl border px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 ${
                    admin.status === "Suspended"
                      ? "border-orange-500/40 bg-orange-500/5"
                      : "border-white/10 bg-black/40"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{admin.name}</p>
                    <p className="text-xs text-gray-500 truncate">{admin.email}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${roleColors[admin.role]}`}
                      >
                        {admin.role}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${statusColors[admin.status]}`}
                      >
                        {admin.status}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        Last login: {admin.lastLogin || "never"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAdminAction(admin.id, "edit")}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-orange-500/30 hover:text-orange-300 transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleAdminAction(admin.id, "toggleStatus")}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-blue-500/40 hover:text-blue-300 transition-colors cursor-pointer"
                      title="Suspend/Reactivate"
                    >
                      <Shield size={14} />
                    </button>
                    <button
                      onClick={() => handleAdminAction(admin.id, "delete")}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-red-500/40 hover:text-red-300 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <form
                onSubmit={handleAddAdmin}
                className="rounded-xl border border-white/10 bg-black/40 p-4 md:p-5"
              >
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
                  Add New Administrator
                </h3>
                <div className="space-y-3">
                  <input
                    value={formData.username}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, username: e.target.value }))
                    }
                    placeholder="Enter username"
                    className="w-full bg-black border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-500/50"
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="Enter email address"
                    className="w-full bg-black border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-500/50"
                  />
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, role: e.target.value }))
                    }
                    className="w-full bg-black border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-500/50"
                  >
                    <option>Admin</option>
                    <option>Moderator</option>
                  </select>
                  <select
                    value={formData.department}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, department: e.target.value }))
                    }
                    className="w-full bg-black border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-orange-500/50"
                  >
                    <option>Operations</option>
                    <option>Security</option>
                    <option>Finance</option>
                    <option>Support</option>
                  </select>
                  <label className="flex items-center gap-3 text-sm text-gray-300 py-1">
                    <input
                      type="checkbox"
                      checked={formData.twoFactor}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          twoFactor: e.target.checked,
                        }))
                      }
                      className="accent-orange-500"
                    />
                    Require Two Factor Authentication
                  </label>
                  <p className="text-[11px] text-gray-500">
                    Only these emails become Super Admin:
                    {" "}
                    <span className="text-orange-300">
                      {SUPER_ADMIN_EMAILS.join(", ")}
                    </span>
                  </p>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-orange-500 text-black font-bold text-xs uppercase tracking-widest hover:bg-orange-400 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <UserPlus size={14} />
                    Create Administrator
                  </button>
                </div>
              </form>

              <div className="rounded-xl border border-white/10 bg-black/40 p-4 md:p-5">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
                  Permission Matrix
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(permissionGroups).map(
                    ([groupName, groupPermissions]) => (
                      <div
                        key={groupName}
                        className="border border-white/10 rounded-lg p-3 bg-black/30"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-300 mb-3">
                          {groupName}
                        </p>
                        <div className="space-y-2">
                          {groupPermissions.map((permission) => (
                            <label
                              key={permission}
                              className="flex items-center gap-2 text-xs text-gray-400"
                            >
                              <input
                                type="checkbox"
                                checked={permissions[permission]}
                                onChange={() =>
                                  setPermissions((prev) => ({
                                    ...prev,
                                    [permission]: !prev[permission],
                                  }))
                                }
                                className="accent-orange-500"
                              />
                              {permission}
                            </label>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-xs text-gray-500">
                    Editing super admin role - Last change:{" "}
                    {recentChangeAt.toLocaleTimeString()}
                  </p>
                  <button
                    onClick={handleSavePermissions}
                    className="px-4 py-2 rounded-lg bg-orange-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-orange-400 transition-colors cursor-pointer"
                  >
                    Save Permissions
                  </button>
                </div>
              </div>
            </div>
          </div>

          {savedNotice && (
            <div className="fixed bottom-5 right-5 bg-[#0B0E14] border border-orange-500/40 text-orange-300 px-4 py-2 rounded-lg text-sm shadow-xl">
              {savedNotice}
            </div>
          )}
          {syncError && (
            <div className="fixed bottom-5 left-5 bg-[#0B0E14] border border-red-500/40 text-red-300 px-4 py-2 rounded-lg text-sm shadow-xl max-w-sm">
              {syncError}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminSetting;
