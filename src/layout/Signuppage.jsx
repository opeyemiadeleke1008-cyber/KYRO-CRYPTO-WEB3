import React, { useState, useEffect } from "react";
import { X, User, Mail, Lock, Asterisk } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { migrateLocalStorageToFirebase, saveUserProfile } from "../services/userData";
import SigninLoader from "../components/SigninLoader";

const Signuppage = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState("signup");
  const [signinLoading, setsigninLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    referral: "",
  });

  const [strength, setStrength] = useState("");
  const [passMatch, setPassMatch] = useState(null);
  const [emailValid, setEmailValid] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      setEmailValid(emailRegex.test(value));
    }

    if (name === "password") {
      if (value.length === 0) setStrength("");
      else if (value.length < 6) setStrength("bad");
      else if (value.length <= 9) setStrength("good");
      else setStrength("excellent");
    }
  };

  useEffect(() => {
    if (formData.confirmPassword.length > 0) {
      setPassMatch(formData.password === formData.confirmPassword);
    } else {
      setPassMatch(null);
    }
  }, [formData.password, formData.confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = formData.email.trim().toLowerCase();
    const isEmailValid = emailRegex.test(cleanEmail);

    if (!isEmailValid) {
      setMessageType("error");
      setMessage("Enter a valid email!");
      setTimeout(() => {
        setMessage("");
      }, 1500);

      return;
    }

    try {
      setsigninLoading(true);
      if (mode === "signup") {
      if (strength === "bad" || strength === "") {
        setMessageType("error");
        setMessage("Password too weak");
        setTimeout(() => {
          setMessage("");
        }, 1500);
        return;
      }
      if (!passMatch) {
        setMessageType("error");
        setMessage("Passwords do not match");
        setTimeout(() => {
          setMessage("");
        }, 1500);
        return;
      }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          cleanEmail,
          formData.password,
        );

        try {
          await saveUserProfile(userCredential.user.uid, {
            name: formData.fullName,
            email: cleanEmail,
            referral: formData.referral,
          });
        } catch (profileError) {
          console.error("Profile save failed after signup:", profileError);
        }

        setShowSuccessMessage(true);
        setTimeout(() => {
          navigate("/user-dashboard");
        }, 1500);
        // REDIRECT TO DASHBOARD AFTER SIGNUP
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          cleanEmail,
          formData.password,
        );

        // One-time migration of old local user/mining data into Firestore.
        try {
          await migrateLocalStorageToFirebase(userCredential.user.uid, cleanEmail);
        } catch (migrationError) {
          console.error("Local migration failed after signin:", migrationError);
        }

        setShowSuccessMessage(true);
        setTimeout(() => {
          navigate("/user-dashboard");
        }, 1500);
        // REDIRECT TO DASHBOARD AFTER SIGNIN
      }
    } catch (error) {
      setMessageType("error");
      const code = error?.code || "";
      if (code === "auth/email-already-in-use") setMessage("Email already in use");
      else if (code === "auth/invalid-credential") setMessage("Invalid email or password");
      else if (code === "auth/invalid-email") setMessage("Invalid email format");
      else if (code === "auth/user-not-found") setMessage("Account not found");
      else if (code === "auth/wrong-password") setMessage("Wrong password");
      else if (code === "auth/too-many-requests") setMessage("Too many attempts. Try again later");
      else setMessage("Authentication failed");
      setTimeout(() => {
        setMessage("");
      }, 2000);
    } finally {
      setsigninLoading(false);
    }
  };

  return (
    <section className="relative bg-black h-screen flex items-center overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full"></div>

      <div className="flex w-[90%] mx-auto h-[85vh] z-10 shadow-2xl shadow-orange-500/5">
        <img
          src="/img/kyroheroimg.jpg"
          alt="auth visual"
          className="w-[50%] h-full object-cover rounded-l-3xl hidden md:block border-y border-l border-white/10 opacity-60"
        />

        <form
          onSubmit={handleSubmit}
          className="bg-[#0B0E14] w-full md:w-[50%] py-10 px-10 rounded-r-3xl md:rounded-l-none rounded-l-3xl relative overflow-y-auto border border-white/10"
        >
          <div className="flex bg-white/5 p-1 rounded-xl w-fit mb-8 border border-white/10">
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`text-[10px] uppercase tracking-widest font-bold px-6 py-2 rounded-lg transition-all cursor-pointer ${mode === "signup" ? "bg-orange-500 text-black" : "text-gray-400 hover:text-white"}`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`text-[10px] uppercase tracking-widest font-bold px-6 py-2 rounded-lg transition-all cursor-pointer ${mode === "signin" ? "bg-orange-500 text-black" : "text-gray-400 hover:text-white"}`}
            >
              Sign In
            </button>
          </div>

          <div className="text-white absolute right-9 top-10 cursor-pointer hover:text-orange-500 transition-colors">
            <Link to="/">
              <X size={24} strokeWidth={3} />
            </Link>
          </div>

          <h2 className="text-white text-3xl font-bold mb-2 italic tracking-tight">
            {mode === "signup" ? "Initialize Terminal" : "Authorize Access"}
          </h2>
          <p className="text-gray-500 text-xs mb-8 uppercase tracking-widest">
            {mode === "signup"
              ? "Secure your spot in the borderless economy"
              : "Resume your institutional trading sessions"}
          </p>

          <div className="space-y-2">
            {mode === "signup" && (
              <div className="group relative">
                <User
                  size={16}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500"
                />
                <input
                  required
                  name="fullName"
                  onChange={handleChange}
                  type="text"
                  placeholder="Username"
                  className="w-full pl-14 pr-6 py-4 bg-white/5 border-b border-white/10 outline-none text-white focus:border-orange-500 transition-all text-sm rounded-t-lg"
                />
              </div>
            )}

            <div className="group relative">
              <Mail
                size={16}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500"
              />
              <input
                required
                name="email"
                onChange={handleChange}
                type="email"
                placeholder="Institutional Email"
                className="w-full pl-14 pr-6 py-4 bg-white/5 border-b border-white/10 outline-none text-white focus:border-orange-500 transition-all text-sm"
              />
            </div>
            <div className="h-4 pl-14">
              {formData.email && !emailValid && (
                <span className="text-red-500 text-[9px] font-bold uppercase tracking-tighter">
                  Protocol Error: Invalid Email Format
                </span>
              )}
            </div>

            <div className="group relative">
              <Lock
                size={16}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500"
              />
              <input
                required
                name="password"
                onChange={handleChange}
                type="password"
                placeholder="Access Key"
                className="w-full pl-14 pr-6 py-4 bg-white/5 border-b border-white/10 outline-none text-white focus:border-orange-500 transition-all text-sm"
              />
            </div>

            <div className="h-4 pl-14">
              {mode === "signup" && strength === "bad" && (
                <span className="text-red-500 text-[9px] font-bold uppercase tracking-tighter">
                  Entropy: Bad
                </span>
              )}
              {mode === "signup" && strength === "good" && (
                <span className="text-yellow-500 text-[9px] font-bold uppercase tracking-tighter">
                  Entropy: Good
                </span>
              )}
              {mode === "signup" && strength === "excellent" && (
                <span className="text-green-500 text-[9px] font-bold uppercase tracking-tighter">
                  Entropy: Optimal
                </span>
              )}
            </div>

            {mode === "signup" && (
              <>
                <div className="group relative">
                  <Lock
                    size={16}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500"
                  />
                  <input
                    required
                    name="confirmPassword"
                    onChange={handleChange}
                    type="password"
                    placeholder="Verify Access Key"
                    className="w-full pl-14 pr-6 py-4 bg-white/5 border-b border-white/10 outline-none text-white focus:border-orange-500 transition-all text-sm"
                  />
                </div>
                <div className="h-4 pl-14">
                  {passMatch === true && (
                    <span className="text-green-500 text-[9px] font-bold uppercase tracking-tighter">
                      Integrity Check: Verified
                    </span>
                  )}
                  {passMatch === false && (
                    <span className="text-red-500 text-[9px] font-bold uppercase tracking-tighter">
                      Integrity Check: Mismatch
                    </span>
                  )}
                </div>

                <div className="group relative">
                  <Asterisk
                    size={16}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500"
                  />
                  <input
                    name="referral"
                    onChange={handleChange}
                    type="text"
                    placeholder="Referral Code (Optional)"
                    className="w-full pl-14 pr-6 py-4 bg-white/5 border-b border-white/10 outline-none text-white focus:border-orange-500 transition-all text-sm"
                  />
                </div>

                <div className="flex items-center gap-3 py-4">
                  <input
                    type="checkbox"
                    required
                    className="accent-orange-500 w-4 h-4 cursor-pointer"
                    id="agree"
                  />
                  <label
                    htmlFor="agree"
                    className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold cursor-pointer"
                  >
                    Accept{" "}
                    <Link
                      to="/terms-of-service"
                      className="text-orange-500 hover:underline"
                    >
                      Kyro Protocol Terms
                    </Link>
                  </label>
                </div>
              </>
            )}
          </div>
          <div className="text-sm text-center min-h-[20px]">
            {showSuccessMessage ? (
              <div className="flex items-center gap-2 flex-col">
                <SigninLoader />
                <span className="text-green-500">Welcome To Kyro</span>
              </div>
            ) : (
              <span className={messageType === "error" ? "text-red-500" : ""}>
                {message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={signinLoading}
            className="bg-orange-500 hover:bg-orange-600 text-black px-6 py-4 rounded-xl transition-all w-full text-xs font-bold uppercase tracking-[0.2em] mt-6 shadow-xl shadow-orange-500/10 cursor-pointer"
          >
            {signinLoading
              ? "Processing..."
              : mode === "signup"
                ? "Initialize Account"
                : "Authorize Session"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Signuppage;
