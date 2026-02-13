import React from "react";
import { ArrowLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Termsofservice = () => {
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
            <FileText size={14} className="text-orange-500" />
            <span className="font-bold text-[10px] tracking-widest">USER AGREEMENT</span>
          </div>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-gray-500 text-sm mb-12 uppercase tracking-widest">Effective Date: January 01, 2026</p>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          <section className="bg-orange-500/10 p-6 rounded-2xl border border-orange-500/20">
            <p className="text-sm font-semibold text-orange-500 uppercase mb-2">Risk Disclosure</p>
            <p className="text-xs text-gray-400">
              Trading cryptocurrencies involves significant risk. Prices can be highly volatile. Only invest what you can afford to lose. Kyro Global Ltd. is not responsible for market losses.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing the Kyro platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree, you are prohibited from using this site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Eligibility</h2>
            <p>
              You must be at least 18 years of age and reside in a jurisdiction where cryptocurrency trading is not prohibited by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Prohibited Activities</h2>
            <p className="mb-4">You agree not to engage in:</p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Market manipulation or "wash trading."</li>
              <li>Unauthorized access to other user accounts.</li>
              <li>Using Kyro for money laundering or terrorist financing.</li>
            </ul>
          </section>
        </div>
      </article>
    </div>
  );
};

export default Termsofservice;