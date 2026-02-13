import React from "react";
import { ArrowLeft, Check, Crown, Diamond, Rocket, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Membership = () => {
  const navigate = useNavigate();

  const tiers = [
    {
      name: "Basic",
      price: "Free",
      icon: <Rocket size={24} />,
      features: ["0.1% Spot Trading Fee", "Standard Kyro Card", "Basic Market Analytics", "24/7 Support"],
      buttonText: "Current Plan",
      highlight: false
    },
    {
      name: "Pro",
      price: "$29.99/mo",
      icon: <Zap size={24} />,
      features: ["0.05% Spot Trading Fee", "Metal Kyro Card", "Advanced AI Signals", "Priority Support", "2% Crypto Cashback"],
      buttonText: "Upgrade to Pro",
      highlight: true
    },
    {
      name: "Whale",
      price: "Custom",
      icon: <Diamond size={24} />,
      features: ["0.01% Spot Trading Fee", "Premium Obsidian Card", "Direct OTC Access", "Personal Account Manager", "5% Crypto Cashback"],
      buttonText: "Contact Sales",
      highlight: false
    }
  ];

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
             <Crown size={14} className="text-orange-500" />
            <span className="font-bold text-[10px] tracking-[0.2em]">KYRO PRIVILEGE PROGRAM</span>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="py-20 px-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 italic tracking-tight">
          Elevate Your <span className="text-orange-500">Trading</span> Status
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Unlock lower fees, higher cashback, and institutional-grade tools by choosing the tier that fits your journey.
        </p>
      </header>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <div 
              key={index}
              className={`relative p-8 rounded-3xl border transition-all duration-500 ${
                tier.highlight 
                ? "bg-linear-to-b from-[#15393b] to-black border-orange-500/50 scale-105 shadow-[0_0_40px_rgba(249,115,22,0.15)]" 
                : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-black text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                  Most Popular
                </div>
              )}

              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${tier.highlight ? "bg-orange-500 text-black" : "bg-white/10 text-orange-500"}`}>
                {tier.icon}
              </div>

              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold">{tier.price}</span>
                {tier.price !== "Free" && tier.price !== "Custom" && <span className="text-gray-500 text-sm">/month</span>}
              </div>

              <ul className="space-y-4 mb-10">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                    <Check size={16} className="text-orange-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-xl font-bold uppercase text-xs tracking-widest transition-all cursor-pointer ${
                tier.highlight 
                ? "bg-orange-500 text-black hover:bg-orange-600 shadow-lg shadow-orange-500/20" 
                : "bg-white/10 text-white hover:bg-white/20"
              }`}>
                {tier.buttonText}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Mini Section */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <h2 className="text-xl font-bold mb-8 text-center uppercase tracking-widest text-gray-500">Membership FAQs</h2>
        <div className="space-y-6">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <h4 className="font-bold mb-2 text-sm text-orange-500">Can I cancel anytime?</h4>
                <p className="text-gray-400 text-xs leading-relaxed">Yes, all paid memberships are monthly subscriptions and can be downgraded at the end of your billing cycle.</p>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <h4 className="font-bold mb-2 text-sm text-orange-500">How do I pay for the Pro plan?</h4>
                <p className="text-gray-400 text-xs leading-relaxed">Subscriptions can be paid via Credit Card or directly using your Kyro USDT/BTC wallet balance.</p>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Membership;