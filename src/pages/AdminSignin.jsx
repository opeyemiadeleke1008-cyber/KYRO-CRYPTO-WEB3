import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Shield, ArrowLeft } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import {
  canAccessAdmin,
  fetchAdminRecordByEmail,
  isSuperAdminEmail,
  normalizeEmail,
  syncAdminOnLogin,
} from "../services/adminAccess";

const AdminSignin = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const setError = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 2500);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = normalizeEmail(form.email);
    if (!email || !form.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      if (mode === "setup") {
        if (!isSuperAdminEmail(email)) {
          setError("Only super admin allowlisted emails can set password here.");
          return;
        }
        if (form.password.length < 8) {
          setError("Password must be at least 8 characters.");
          return;
        }
        if (form.password !== form.confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        const created = await createUserWithEmailAndPassword(auth, email, form.password);
        await syncAdminOnLogin({
          email: created.user.email || email,
          displayName: created.user.displayName || "",
        });
        navigate("/admin-dashboard");
        return;
      }

      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        form.password,
      );
      const adminRecord = await fetchAdminRecordByEmail(email);
      const allowed = canAccessAdmin({ email, adminRecord });

      if (!allowed) {
        await signOut(auth);
        setError("Access denied. Not in super admin list or admins collection.");
        return;
      }

      await syncAdminOnLogin({
        email: credential.user.email || email,
        displayName: credential.user.displayName || "",
      });
      navigate("/admin-dashboard");
    } catch (error) {
      const code = error?.code || "";
      if (code === "auth/invalid-credential") setError("Invalid email or password.");
      else if (code === "auth/too-many-requests") setError("Too many attempts. Try again later.");
      else setError("Unable to sign in as admin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[420px] h-[420px] rounded-full bg-orange-500/10 blur-[120px]" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#0B0E14] border border-white/10 rounded-2xl p-6 md:p-8 relative z-10"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white mb-6 uppercase tracking-wider"
        >
          <ArrowLeft size={14} />
          Back
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center text-orange-400">
            <Shield size={18} />
          </div>
          <div>
            <h1 className="text-2xl font-bold italic tracking-tight">Admin Sign In</h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest">
              Restricted Console Access
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="Admin email"
              className="w-full pl-10 pr-3 py-3 bg-black border border-white/10 rounded-lg outline-none text-sm focus:border-orange-500/50"
            />
          </div>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              name="password"
          type="password"
          required
          value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full pl-10 pr-3 py-3 bg-black border border-white/10 rounded-lg outline-none text-sm focus:border-orange-500/50"
            />
          </div>

          {mode === "setup" && (
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                name="confirmPassword"
                type="password"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full pl-10 pr-3 py-3 bg-black border border-white/10 rounded-lg outline-none text-sm focus:border-orange-500/50"
              />
            </div>
          )}
        </div>

        <p className={`text-xs min-h-5 mt-3 ${message ? "text-red-400" : "text-gray-500"}`}>
          {message ||
            (mode === "setup"
              ? "Use this only to set first-time password for super admin email."
              : "Only super admin emails or created admins can sign in.")}
        </p>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 py-3 rounded-lg bg-orange-500 text-black font-bold text-xs uppercase tracking-widest hover:bg-orange-400 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading
            ? "Authorizing..."
            : mode === "setup"
              ? "Create Super Admin Password"
              : "Enter Admin Console"}
        </button>

        <button
          type="button"
          onClick={() => setMode((prev) => (prev === "signin" ? "setup" : "signin"))}
          className="w-full mt-3 py-2 rounded-lg border border-white/10 bg-white/5 text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors cursor-pointer"
        >
          {mode === "signin"
            ? "First-time Super Admin Setup"
            : "Back To Admin Sign In"}
        </button>
      </form>
    </div>
  );
};

export default AdminSignin;
