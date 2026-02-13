import React from "react";
import { ShieldCheck, Zap, Globe, Users, TrendingUp, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Aboutpage = () => {
  const navigate = useNavigate();
  return (
    
    <div className="bg-black text-white font-sans">
      {/* 1. Back Button Navigation Bar */}
      <nav className="sticky top-0 z-60 bg-black/60 backdrop-blur-lg border-b border-white/5 py-4 px-6 md:px-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} // Takes user to the previous page
            className="group flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-all duration-300 font-semibold text-sm uppercase tracking-widest"
          >
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-orange-500/20 transition-colors">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            </div>
            Back
          </button>
          
          {/* Optional: Small Logo to keep brand presence */}
          <div className="flex items-center gap-2 opacity-50">
            <img src="/img/kyrologo.png" alt="kyro" className="w-6 h-6 object-contain" />
            <span className="font-bold text-xs">KYRO TERMINAL</span>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="relative py-24 px-10 bg-linear-to-br from-black/90 to-[#15393b] overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 italic tracking-tight">
            Redefining the <span className="text-orange-500">Financial</span>{" "}
            Frontier
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Kyro was born out of a simple realization: the traditional financial
            system is slow, exclusive, and outdated. We are building the bridge
            to a decentralized future.
          </p>
        </div>
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full"></div>
      </section>

      {/* Our Story / Vision Section */}
      <section className="py-20 px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 border-l-4 border-orange-500 pl-4">
              The Kyro Genesis
            </h2>
            <p className="text-gray-400 leading-8 mb-6">
              Founded in 2024, Kyro began as a small collective of developers
              and economists who believed that financial freedom should be a
              global right, not a localized privilege.
            </p>
            <p className="text-gray-400 leading-8">
              Today, we serve millions of users across 200+ countries, providing
              the tools necessary to trade, mine, and secure digital assets with
              institutional-grade precision. We don't just exchange currency; we
              facilitate the transition to a borderless economy.
            </p>
          </div>
          <div className="relative">
            <img
              src="/img/kyroheroimg.jpg"
              alt="Kyro Office"
              className="rounded-3xl shadow-2xl border border-white/10 opacity-80"
            />
            <div className="absolute -bottom-6 -left-6 bg-[#15393b] p-8 rounded-2xl border border-white/10 hidden md:block">
              <p className="text-4xl font-bold text-orange-500">30M+</p>
              <p className="text-xs uppercase tracking-widest text-gray-300">
                Active Global Users
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values - Grid Section */}
      <section className="bg-[#0B0E14] py-20 px-10 border-y border-white/5">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Core Philosophies
          </h2>
          <p className="text-gray-500">
            The pillars that uphold every transaction on the Kyro terminal.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <ShieldCheck className="text-orange-500" size={32} />,
              title: "Security First",
              desc: "98% of all digital assets are held in geographicaly distributed cold storage. Your safety is our baseline.",
            },
            {
              icon: <Globe className="text-orange-500" size={32} />,
              title: "Radical Inclusion",
              desc: "From the busy streets of Lagos to the tech hubs of Tokyo, our platform is optimized for everyone.",
            },
            {
              icon: <Zap className="text-orange-500" size={32} />,
              title: "Zero-Latency",
              desc: "Our proprietary matching engine handles over 1.4 million transactions per second.",
            },
            {
              icon: <Lock className="text-orange-500" size={32} />,
              title: "Privacy Advocacy",
              desc: "We believe in the sovereign right to financial privacy. We only collect what is legally required.",
            },
            {
              icon: <Users className="text-orange-500" size={32} />,
              title: "User Empowerement",
              desc: "Kyro Academy provides free education to help you navigate the complexities of Web3.",
            },
            {
              icon: <TrendingUp className="text-orange-500" size={32} />,
              title: "Infinite Scalability",
              desc: "As the crypto world grows, Kyro evolves. We are built to sustain the next billion users.",
            },
          ].map((value, index) => (
            <div
              key={index}
              className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-orange-500/50 transition-all group"
            >
              <div className="mb-4 group-hover:scale-110 transition-transform">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{value.title}</h3>
              <p className="text-gray-400 text-sm leading-6">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Ecosystem Section */}
      <section className="py-20 px-10 bg-linear-to-tl from-black/90 to-[#15393b]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2 order-2 md:order-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-40 bg-orange-500/20 rounded-2xl flex items-center justify-center border border-orange-500/30">
                <span className="font-bold text-white italic">
                  Kyro Exchange
                </span>
              </div>
              <div className="h-40 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mt-8">
                <span className="font-bold text-white italic">Kyro Mining</span>
              </div>
              <div className="h-40 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                <span className="font-bold text-white italic">Kyro Wallet</span>
              </div>
              <div className="h-40 bg-orange-500/20 rounded-2xl flex items-center justify-center border border-orange-500/30 mt-8">
                <span className="font-bold text-white italic">Kyro Pay</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 order-1 md:order-2">
            <h2 className="text-4xl font-bold mb-6 italic leading-tight">
              A Unified Ecosystem <br /> for the{" "}
              <span className="text-orange-500">Modern Investor.</span>
            </h2>
            <p className="text-gray-400 leading-8 mb-6">
              We aren't just an exchange; we are a full-suite financial
              ecosystem. Kyro integrates spot trading, cloud mining, and
              cross-border payments into a single, intuitive interface.
            </p>
            <Link to="/signup">
              <button className="bg-orange-500 text-black px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-all uppercase text-xs tracking-widest">
                Join the Evolution
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quote / Mission Statement */}
      <section className="py-24 px-10 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-orange-500 text-6xl font-serif">“</span>
          <h2 className="text-2xl md:text-4xl font-light italic text-gray-200 leading-relaxed -mt-8">
            Our mission is to accelerate the world's transition to a fair,
            decentralized financial system where every individual has full
            custody over their own wealth.
          </h2>
          <div className="mt-8">
            <p className="font-bold text-white">The Kyro Leadership Team</p>
            <p className="text-gray-500 text-sm">
              Est. 2024 • Global Decentralized Entity
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Aboutpage;
