import React, { useState, useEffect } from "react";
import { Camera, Eye, EyeOff, Lock, Bell, Moon, Sun, Shield, User } from "lucide-react";
import Aside from "../layout/Aside";
import UserNavbar from "../components/UserNavbar";

const UserSettings = () => {
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
    darkMode: true,
    twoFactor: false
  });
  const [previewImage, setPreviewImage] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const fileInputRef = React.useRef(null);
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("kyro_user"));
    if (storedUser) {
      setUser({
        name: storedUser.name || "",
        email: storedUser.email || "",
        profilePic: storedUser.profilePic || ""
      });
      setPreviewImage(storedUser.profilePic || "");
    }
  }, []);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setPreviewImage(imageUrl);
        setUser({ ...user, profilePic: imageUrl });
        // Update localStorage immediately to sync with dashboard
        const updatedUser = { ...user, profilePic: imageUrl };
        localStorage.setItem("kyro_user", JSON.stringify(updatedUser));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePersonalInfoChange = (field, value) => {
    const updatedUser = { ...user, [field]: value };
    setUser(updatedUser);
    // Update localStorage immediately to sync with dashboard
    localStorage.setItem("kyro_user", JSON.stringify(updatedUser));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleUpdatePassword = () => {
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

    const updatedUser = { ...user, password: passwordData.newPassword };
    localStorage.setItem("kyro_user", JSON.stringify(updatedUser));
    
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    alert("Password updated successfully!");
  };

  const handleForgotPassword = () => {
    alert("Password reset link has been sent to your email address.");
  };

  const handleSettingToggle = (setting) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
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
            onClick={() => alert("Personal information updated successfully!")}
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
                <Moon className="text-orange-500" size={20} />
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
                  <p className="text-white font-medium">Two-Factor Authentication</p>
                  <p className="text-gray-400 text-sm">Add an extra layer of security</p>
                </div>
              </div>
              <button
                onClick={() => handleSettingToggle("twoFactor")}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.twoFactor ? "bg-orange-500" : "bg-gray-600"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.twoFactor ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserSettings;
