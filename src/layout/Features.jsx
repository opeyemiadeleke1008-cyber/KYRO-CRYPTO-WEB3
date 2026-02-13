import React from "react";
import { 
  ArrowLeft, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  CreditCard, 
  Smartphone 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white font-sans min-h-screen">
      {/* Sticky Back Navigation */}
      <nav className="sticky top-0 z-60 bg-black/60 backdrop-blur-lg border-b border-white/5 py-4 px-6 md:px-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-all duration-300 font-semibold text-sm uppercase tracking-widest cursor-pointer"
          >
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-orange-500/20 transition-colors">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            </div>
            Back
          </button>
          <div className="flex items-center gap-2 opacity-50">
            <span className="font-bold text-xs tracking-tighter">KYRO FEATURES // 2026</span>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <header className="py-20 px-10 text-center bg-linear-to-b from-[#15393b]/20 to-black">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 italic">
          Powerful Tools for <span className="text-orange-500">Global</span> Trading
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Explore the suite of advanced features designed to give you an edge in the volatile world of digital assets.
        </p>
      </header>

      {/* Main Features Bento Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Feature 1: Advanced Terminal (Large) */}
          <div className="md:col-span-2 bg-linear-to-br from-[#15393b] to-black p-8 rounded-3xl border border-white/10 flex flex-col justify-between group">
            <div>
              <div className="bg-orange-500 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                <BarChart3 size={24} className="text-black" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Pro-Level Trading Terminal</h3>
              <p className="text-gray-300 leading-relaxed max-w-md">
                Experience lightning-fast execution with our proprietary matching engine. Access advanced charting tools, limit orders, and real-time order books.
              </p>
            </div>
            <div className="mt-10 bg-black/40 rounded-xl p-4 border border-white/5">
                <div className="flex gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="h-32 flex items-end gap-1">
                    {[40, 70, 45, 90, 65, 80, 50, 95, 70].map((h, i) => (
                        <div key={i} className="flex-1 bg-orange-500/20 rounded-t-sm group-hover:bg-orange-500/40 transition-all" style={{height: `${h}%`}}></div>
                    ))}
                </div>
            </div>
          </div>

          {/* Feature 2: Security */}
          <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-orange-500/30 transition-all">
            <ShieldCheck size={40} className="text-orange-500 mb-6" />
            <h3 className="text-xl font-bold mb-3">Institutional Custody</h3>
            <p className="text-gray-400 text-sm leading-6">
              Your assets are secured with multi-signature cold wallets and hardware security modules (HSM).
            </p>
          </div>

          {/* Feature 3: Cloud Mining */}
          <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-orange-500/30 transition-all flex flex-col justify-between">
            <div>
              <Cpu size={40} className="text-orange-500 mb-6" />
              <h3 className="text-xl font-bold mb-3">Eco-Cloud Mining</h3>
              <p className="text-gray-400 text-sm leading-6">
                Earn passive rewards with our sustainable mining clusters. No hardware setup required.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-orange-500 font-mono text-xs">
                HASHRATE: 142.5 TH/s
            </div>
          </div>

          {/* Feature 4: Kyro Card */}
          <div className="md:col-span-2 bg-linear-to-tr from-black to-[#0d2223] p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center gap-8 group">
            <div className="md:w-1/2">
              <CreditCard size={40} className="text-orange-500 mb-6" />
              <h3 className="text-3xl font-bold mb-4">Kyro Visa® Card</h3>
              <p className="text-gray-300 leading-relaxed">
                Spend your crypto anywhere Visa is accepted. Get up to 5% cashback in BTC on every transaction.
              </p>
            </div>
            <div className="md:w-1/2 relative">
                <div className="w-full h-48 bg-linear-to-br from-orange-400 to-orange-600 rounded-xl p-6 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                    <div className="flex justify-between items-start">
                        <Zap size={30} className="text-white fill-white" />
                        <span className="text-xs font-bold tracking-widest uppercase">Platinum</span>
                    </div>
                    <div className="mt-12 text-xl font-mono tracking-widest">**** **** **** 8824</div>
                    <div className="mt-4 flex justify-between uppercase text-[8px] tracking-widest">
                        <span>Kyro Holder</span>
                        <span>Exp 12/28</span>
                    </div>
                </div>
            </div>
          </div>

          {/* Feature 5: Mobile App */}
          <div className="bg-orange-500 p-8 rounded-3xl text-black flex flex-col justify-between">
            <div>
              <Smartphone size={40} className="mb-6" />
              <h3 className="text-xl font-bold mb-3">Mobile Native</h3>
              <p className="font-medium text-sm leading-6">
                Stay connected to the markets on the go with our top-rated iOS and Android apps.
              </p>
            </div>
            <button className="mt-6 bg-black text-white py-3 rounded-xl font-bold text-xs uppercase tracking-tighter hover:bg-zinc-800 transition-colors">
                Download App
            </button>
          </div>

        </div>
      </section>

      {/* Technical Specs Section */}
      <section className="py-20 bg-zinc-950 border-t border-white/5 px-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-10 text-center italic tracking-widest">Technical Specifications</h2>
          <div className="space-y-4">
            {[
              { label: "Engine Latency", value: "< 50 Microseconds" },
              { label: "Uptime SLA", value: "99.99%" },
              { label: "API Rate Limit", value: "10,000 req/min" },
              { label: "Encryption", value: "AES-256-GCM" }
            ].map((spec, i) => (
              <div key={i} className="flex justify-between border-b border-white/5 py-4">
                <span className="text-gray-500 uppercase text-xs tracking-widest font-bold">{spec.label}</span>
                <span className="text-orange-500 font-mono text-sm">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;