import React, { useState, useEffect } from "react";
import {
  Camera,
  Eye,
  EyeOff,
  Lock,
  Bell,
  Moon,
  Sun,
  Shield,
  User,
  FileBadge,
} from "lucide-react";
import { onAuthStateChanged, EmailAuthProvider, reauthenticateWithCredential, sendPasswordResetEmail, updatePassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { fetchUserProfile, migrateLocalStorageToFirebase, saveUserProfile } from "../services/userData";
import { createNotification } from "../services/notifications";
import { getStoredTheme, setStoredTheme } from "../services/theme";
import Aside from "../layout/Aside";
import UserNavbar from "../components/UserNavbar";

const UserSettings = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState({ name: "", email: "", profilePic: "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: getStoredTheme() === "dark",
    kyc: false
  });
  const [kycData, setKycData] = useState({
    legalName: "",
    country: "",
    idType: "Passport",
    idNumber: "",
    documentName: "",
    status: "Not Submitted",
  });
  const [previewImage, setPreviewImage] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUid, setCurrentUid] = useState("");
  const fileInputRef = React.useRef(null);
  const kycDocInputRef = React.useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (!authUser) {
        navigate("/signup");
        return;
      }

      setCurrentUid(authUser.uid);
      await migrateLocalStorageToFirebase(authUser.uid, authUser.email || "");
      const profile = await fetchUserProfile(authUser.uid);
      if (!profile) return;

      setUser({
        name: profile.name || "",
        email: profile.email || authUser.email || "",
        profilePic: profile.profilePic || "",
      });
      setPreviewImage(profile.profilePic || "");
      if (profile.preferences) {
        const nextSettings = {
          notifications: profile.preferences.notifications ?? true,
          darkMode: profile.preferences.darkMode ?? true,
          // Backward compatibility: if twoFactor exists, treat it as old KYC flag.
          kyc: profile.preferences.kyc ?? profile.preferences.twoFactor ?? false,
        };
        setSettings(nextSettings);
        setStoredTheme(nextSettings.darkMode ? "dark" : "light");
      }
      if (profile.kyc) {
        setKycData({
          legalName: profile.kyc.legalName || "",
          country: profile.kyc.country || "",
          idType: profile.kyc.idType || "Passport",
          idNumber: profile.kyc.idNumber || "",
          documentName: profile.kyc.documentName || "",
          status: profile.kyc.status || "Not Submitted",
        });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const pushNotification = async (title, message, type = "info") => {
    if (!currentUid) return;
    await createNotification(currentUid, { title, message, type });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        const updatedUser = { ...user, profilePic: imageUrl };
        setPreviewImage(imageUrl);
        setUser(updatedUser);
        if (currentUid) {
          saveUserProfile(currentUid, updatedUser);
          pushNotification("Profile Updated", "Profile picture changed.", "success");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePersonalInfoChange = (field, value) => {
    const updatedUser = { ...user, [field]: value };
    setUser(updatedUser);
  };

  const handleUpdateInformation = async () => {
    if (!currentUid) return;
    await saveUserProfile(currentUid, {
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
    });
    await pushNotification(
      "Profile Updated",
      "Personal information was updated successfully.",
      "success",
    );
    alert("Personal information updated successfully!");
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleUpdatePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        alert("No active session found");
        return;
      }

      const credential = EmailAuthProvider.credential(
        currentUser.email,
        passwordData.currentPassword,
      );
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, passwordData.newPassword);

      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      await pushNotification(
        "Security Update",
        "Password changed successfully.",
        "success",
      );
      alert("Password updated successfully!");
    } catch (error) {
      await pushNotification(
        "Security Error",
        error?.message || "Unable to update password",
        "error",
      );
      alert(error?.message || "Unable to update password");
    }
  };

  const handleForgotPassword = async () => {
    try {
      const email = auth.currentUser?.email || user.email;
      if (!email) {
        alert("No email found for reset");
        return;
      }
      await sendPasswordResetEmail(auth, email);
      await pushNotification(
        "Password Reset",
        "Password reset link sent to your email.",
        "info",
      );
      alert("Password reset link has been sent to your email address.");
    } catch (error) {
      await pushNotification(
        "Password Reset Failed",
        error?.message || "Unable to send reset link",
        "error",
      );
      alert(error?.message || "Unable to send reset link");
    }
  };

  const handleSettingToggle = (setting) => {
    setSettings((prev) => {
      const next = { ...prev, [setting]: !prev[setting] };
      if (setting === "darkMode") {
        const nextTheme = next.darkMode ? "dark" : "light";
        setStoredTheme(nextTheme);
      }
      if (currentUid) {
        saveUserProfile(currentUid, { preferences: next });
      }
      pushNotification(
        "Preferences Updated",
        `${setting} was set to ${next[setting] ? "enabled" : "disabled"}.`,
        "info",
      );
      return next;
    });
  };

  const handleKycInputChange = (field, value) => {
    setKycData((prev) => ({ ...prev, [field]: value }));
  };

  const handleKycDocumentChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setKycData((prev) => ({ ...prev, documentName: file.name }));
  };

  const handleSubmitKyc = async () => {
    if (!currentUid) return;
    if (!kycData.legalName || !kycData.country || !kycData.idNumber) {
      alert("Please complete all required KYC fields.");
      return;
    }

    const payload = {
      ...kycData,
      status: "Submitted",
    };

    setKycData(payload);
    await saveUserProfile(currentUid, { kyc: payload });
    await pushNotification(
      "KYC Submitted",
      "Your KYC details were submitted and are under review.",
      "success",
    );
    alert("KYC submitted successfully.");
  };
  return (
    <div className="bg-black text-white font-sans overflow-hidden flex h-screen">
      {/* Mobile Navbar */}
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

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hidden">
        <header className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight uppercase italic text-orange-500">
            Settings
          </h2>
        </header>
        <div className="bg-[#0B0E14] rounded-3xl p-6 border border-white/50">
          <h3 className="text-lg font-bold tracking-tight uppercase italic text-orange-500">
            Profile Settings
          </h3>
          <div className="mt-4 flex gap-4 items-center">
            <div className="w-25 h-25 rounded-[50%] border border-gray-400 overflow-hidden bg-black relative group">
              {previewImage ? (
                <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-500 text-4xl">{user.name?.charAt(0) || <User />}</span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
                accept="image/*"
              />
              <Camera
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 w-8 h-8 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 p-2 rounded-full"
                onClick={handleButtonClick}
              />
            </div>
            <div>
              <button
                onClick={handleButtonClick}
                className="cursor-pointer px-4 py-2 bg-orange-500 text-black rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Update Picture
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#0B0E14] rounded-3xl p-6 border border-white/50 mt-6">
          <h3 className="text-lg font-bold tracking-tight uppercase italic text-orange-500 mb-4">
            Personal Information
          </h3>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={user.name}
              onChange={(e) => handlePersonalInfoChange("name", e.target.value)}
              placeholder="Username"
              className="w-full px-4 py-2 bg-[#0B0E14] border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="email"
              value={user.email}
              onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2 bg-[#0B0E14] border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button 
            onClick={handleUpdateInformation}
            className="mt-4 cursor-pointer px-4 py-2 bg-orange-500 text-black rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Update Information
          </button>
        </div>

        <div className="bg-[#0B0E14] rounded-3xl p-6 border border-white/50 mt-6">
          <h3 className="text-lg font-bold tracking-tight uppercase italic text-orange-500 mb-4">
            Access & Security
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Current Password"
                  className="w-full px-4 py-2 bg-[#0B0E14] border border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="relative flex-1">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="New Password"
                  className="w-full px-4 py-2 bg-[#0B0E14] border border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="relative flex-1">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm New Password"
                  className="w-full px-4 py-2 bg-[#0B0E14] border border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <button 
                onClick={handleUpdatePassword}
                className="cursor-pointer px-4 py-2 bg-orange-500 text-black rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Update Password
              </button>
              <button 
                onClick={handleForgotPassword}
                className="cursor-pointer px-4 py-2 bg-orange-500 text-black rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>

        {/* Toggle Settings Section */}
        <div className="bg-[#0B0E14] rounded-3xl p-6 border border-white/50 mt-6">
          <h3 className="text-lg font-bold tracking-tight uppercase italic text-orange-500 mb-6">
            Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
              <div className="flex items-center gap-3">
                <Bell className="text-orange-500" size={20} />
                <div>
                  <p className="text-white font-medium">Push Notifications</p>
                  <p className="text-gray-400 text-sm">Receive notifications about your account</p>
                </div>
              </div>
              <button
                onClick={() => handleSettingToggle("notifications")}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.notifications ? "bg-orange-500" : "bg-gray-600"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.notifications ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
              <div className="flex items-center gap-3">
                {settings.darkMode ? (
                  <Moon className="text-orange-500" size={20} />
                ) : (
                  <Sun className="text-orange-500" size={20} />
                )}
                <div>
                  <p className="text-white font-medium">Dark Mode</p>
                  <p className="text-gray-400 text-sm">Toggle dark mode theme</p>
                </div>
              </div>
              <button
                onClick={() => handleSettingToggle("darkMode")}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.darkMode ? "bg-orange-500" : "bg-gray-600"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.darkMode ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
              <div className="flex items-center gap-3">
                <Shield className="text-orange-500" size={20} />
                <div>
                  <p className="text-white font-medium">Enable KYC</p>
                  <p className="text-gray-400 text-sm">Turn on identity verification access</p>
                </div>
              </div>
              <button
                onClick={() => handleSettingToggle("kyc")}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.kyc ? "bg-orange-500" : "bg-gray-600"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.kyc ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {settings.kyc && (
          <div className="bg-[#0B0E14] rounded-3xl p-6 border border-white/50 mt-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold tracking-tight uppercase italic text-orange-500">
                  KYC Verification
                </h3>
                <p className="text-xs text-gray-400">
                  Complete your verification details to unlock full access.
                </p>
              </div>
              <span className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-orange-500/40 text-orange-400">
                {kycData.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={kycData.legalName}
                onChange={(e) => handleKycInputChange("legalName", e.target.value)}
                placeholder="Legal Full Name *"
                className="w-full px-4 py-2 bg-[#0B0E14] border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="text"
                value={kycData.country}
                onChange={(e) => handleKycInputChange("country", e.target.value)}
                placeholder="Country *"
                className="w-full px-4 py-2 bg-[#0B0E14] border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <select
                value={kycData.idType}
                onChange={(e) => handleKycInputChange("idType", e.target.value)}
                className="w-full px-4 py-2 bg-[#0B0E14] border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Passport">Passport</option>
                <option value="National ID">National ID</option>
                <option value="Driver's License">Driver's License</option>
              </select>
              <input
                type="text"
                value={kycData.idNumber}
                onChange={(e) => handleKycInputChange("idNumber", e.target.value)}
                placeholder="ID Number *"
                className="w-full px-4 py-2 bg-[#0B0E14] border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="mt-4 p-4 rounded-xl border border-white/20 bg-black/20 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-3">
                <FileBadge className="text-orange-500" size={20} />
                <div>
                  <p className="text-sm text-white">Verification Document</p>
                  <p className="text-xs text-gray-400">
                    {kycData.documentName || "No file selected"}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <input
                  ref={kycDocInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  className="hidden"
                  onChange={handleKycDocumentChange}
                />
                <button
                  onClick={() => kycDocInputRef.current?.click()}
                  className="cursor-pointer px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm hover:border-orange-500 transition-colors"
                >
                  Upload Document
                </button>
                <button
                  onClick={handleSubmitKyc}
                  className="cursor-pointer px-4 py-2 bg-orange-500 text-black rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                  Submit KYC
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserSettings;
