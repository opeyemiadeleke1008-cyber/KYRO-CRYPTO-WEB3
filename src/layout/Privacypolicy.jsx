import React from "react";
import { ArrowLeft, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Privacypolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white font-sans min-h-screen">
      <nav className="sticky top-0 z-60 bg-black/60 backdrop-blur-lg border-b border-white/5 py-4 px-6 md:px-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
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
            <Shield size={14} className="text-orange-500" />
            <span className="font-bold text-[10px] tracking-widest">LEGAL CENTER</span>
          </div>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-12 uppercase tracking-widest">Last Updated: February 2026</p>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              To provide the Kyro Terminal experience, we collect information that identifies you, such as your email address, IP address, and financial transaction data associated with your wallet.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Identity Data: Name, date of birth, and government-issued ID for KYC.</li>
              <li>Technical Data: Device type, browser cookies, and geolocation.</li>
              <li>Usage Data: How you interact with our trading pairs and mining pools.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. How We Use Your Data</h2>
            <p>
              We use your data to process transactions, prevent fraudulent activity, and comply with international Anti-Money Laundering (AML) regulations. We do not sell your personal data to third-party advertisers.
            </p>
          </section>

          <section className="p-6 bg-white/5 rounded-2xl border border-white/10">
            <h2 className="text-lg font-bold text-orange-500 mb-2">Data Protection Officer</h2>
            <p className="text-sm">If you have questions about your data rights, contact our privacy team at <span className="text-white underline">privacy@kyro.io</span></p>
          </section>
        </div>
      </article>
    </div>
  );
};

export default Privacypolicy;