import React, { useMemo, useState } from "react";
import {
  Bolt,
  ChevronDown,
  Crown,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import Aside from "../layout/Aside";
import UserNavbar from "../components/UserNavbar";

const UserMembership = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const plans = [
    {
      name: "Bronze",
      price: "$0.00",
      cta: "Current Plan",
      badge: "FREE",
      ctaStyle: "bg-orange-400 hover:bg-orange-300 text-white",
      perks: ["Basic dashboard access", "Semi-annual reports", "Email support"],
    },
    {
      name: "Silver",
      price: "$19.99",
      cta: "Upgrade Now",
      badge: "POPULAR",
      ctaStyle: "bg-white/10 hover:bg-white/20 text-white",
      perks: ["Priority dashboard", "Advanced analytics", "Monthly report pack"],
    },
    {
      name: "Gold",
      price: "$39.99",
      cta: "Upgrade Now",
      badge: null,
      ctaStyle: "bg-white/10 hover:bg-white/20 text-white",
      perks: ["Full analytics suite", "Trading signal feed", "Dedicated support desk"],
    },
    {
      name: "Platinum",
      price: "$79.99",
      cta: "Contact Sales",
      badge: null,
      ctaStyle: "bg-white/10 hover:bg-white/20 text-white",
      perks: ["Institutional tools", "VIP support", "Personal account manager"],
    },
  ];

  const bars = useMemo(
    () => [
      { label: "Bronze", height: "h-12" },
      { label: "Silver", height: "h-20" },
      { label: "Gold", height: "h-28" },
      { label: "Platinum", height: "h-36" },
    ],
    [],
  );

  const faqItems = [
    "How does the rewards multiplier work?",
    "Can I upgrade or downgrade my tier anytime?",
    "What payment methods are accepted?",
    "Are there any setup fees or contracts?",
  ];

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden relative">
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

      <main className="flex-1 min-w-0 overflow-y-auto p-4 md:p-6 lg:p-8 scrollbar-hidden">
        <div className="bg-[#0B0E14] border border-white/10 rounded-2xl p-4 md:p-6 space-y-6">
          <header>
            <h1 className="text-xl md:text-2xl font-bold text-white">
              Choose Your Membership Tier
            </h1>
            <p className="text-xs md:text-sm text-gray-400 mt-1">
              Accelerate your mining rewards and unlock premium tools with our
              membership tiers
            </p>
          </header>

          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`relative rounded-xl border p-4 space-y-4 ${
                  plan.name === "Silver"
                    ? "border-orange-400 shadow-[0_0_0_1px_rgba(34,211,238,0.3)] bg-orange-400/5"
                    : "border-white/10 bg-black/30"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-2 right-3 text-[10px] px-2 py-1 rounded-full bg-orange-400 text-black font-bold tracking-wider">
                    {plan.badge}
                  </span>
                )}

                <div className="flex items-center gap-2 text-gray-300">
                  <Crown size={14} className="text-amber-400" />
                  <p className="text-xs font-semibold">{plan.name}</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{plan.price}</p>
                  <p className="text-[11px] text-gray-500">/month</p>
                </div>
                <ul className="space-y-2">
                  {plan.perks.map((perk) => (
                    <li
                      key={perk}
                      className="text-xs text-gray-300 flex items-center gap-2"
                    >
                      <Star size={12} className="text-orange-400 shrink-0" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </button>
              </article>
            ))}
          </section>

          <section className="rounded-xl border border-white/10 bg-black/30 overflow-x-auto">
            <table className="w-full min-w-[720px] text-xs">
              <thead className="text-gray-400 border-b border-white/10">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold">Features</th>
                  <th className="text-left py-3 px-4 font-semibold">Bronze</th>
                  <th className="text-left py-3 px-4 font-semibold">Silver</th>
                  <th className="text-left py-3 px-4 font-semibold">Gold</th>
                  <th className="text-left py-3 px-4 font-semibold">Platinum</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="py-3 px-4 text-gray-300">Rewards Multiplier</td>
                  <td className="py-3 px-4">1.2x</td>
                  <td className="py-3 px-4">1.8x</td>
                  <td className="py-3 px-4">2.4x</td>
                  <td className="py-3 px-4">3x</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 px-4 text-gray-300">Mining Boost Access</td>
                  <td className="py-3 px-4">Basic</td>
                  <td className="py-3 px-4">Advanced</td>
                  <td className="py-3 px-4">Full Suite</td>
                  <td className="py-3 px-4">Custom Requests</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 px-4 text-gray-300">Support Response</td>
                  <td className="py-3 px-4">Email</td>
                  <td className="py-3 px-4">24h</td>
                  <td className="py-3 px-4">12h</td>
                  <td className="py-3 px-4">5h VIP</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-300">Exclusive Tools</td>
                  <td className="py-3 px-4">Standard</td>
                  <td className="py-3 px-4">Enhanced</td>
                  <td className="py-3 px-4">Pro-level</td>
                  <td className="py-3 px-4">Enterprise</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-gray-200">
              Why Upgrade Your Membership?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="flex items-center gap-2 text-orange-400 text-sm font-semibold">
                  <Zap size={14} /> Get Paid Faster
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Higher memberships reduce manual steps to get to better tiers
                  faster.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="flex items-center gap-2 text-orange-400 text-sm font-semibold">
                  <Sparkles size={14} /> Priority Mining Allocation
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Get priority access to the most profitable pools and optimized
                  routes.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="flex items-center gap-2 text-orange-400 text-sm font-semibold">
                  <ShieldCheck size={14} /> Premium Support
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Platinum members get VIP support channels and dedicated account
                  help.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="flex items-center gap-2 text-orange-400 text-sm font-semibold">
                  <Bolt size={14} /> Reduced Fees
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Higher tiers include transaction fee discounts on all
                  transactions.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <h2 className="text-sm font-bold text-gray-200">
                Calculate Your Potential Earnings
              </h2>
              <div className="flex gap-2">
                <input
                  type="number"
                  defaultValue={100}
                  className="bg-black border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-orange-400/60"
                />
                <select className="bg-black border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-orange-400/60">
                  <option>All Tiers</option>
                  <option>Bronze</option>
                  <option>Silver</option>
                  <option>Gold</option>
                  <option>Platinum</option>
                </select>
                <button className="px-4 py-2 rounded-lg bg-orange-400 text-black text-xs font-bold hover:bg-orange-300 cursor-pointer">
                  Calculate
                </button>
              </div>
            </div>

            <div className="h-44 border border-white/10 rounded-lg p-3 flex items-end gap-3">
              {bars.map((bar) => (
                <div
                  key={bar.label}
                  className="flex-1 flex flex-col items-center justify-end gap-2"
                >
                  <div className={`w-full max-w-16 bg-orange-400 rounded-t-md ${bar.height}`} />
                  <span className="text-[11px] text-gray-400">{bar.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-gray-200">
              Frequently Asked Questions
            </h2>
            {faqItems.map((question, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={question}
                  className="border border-white/10 rounded-lg bg-black/30"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-4 py-3 text-left text-xs md:text-sm flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <span>{question}</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <p className="px-4 pb-3 text-xs text-gray-400">
                      Memberships are flexible and update immediately after
                      confirmation.
                    </p>
                  )}
                </div>
              );
            })}
          </section>

          <section className="rounded-xl border border-orange-400/20 bg-orange-400/10 p-6 text-center space-y-3">
            <h3 className="text-lg font-bold">Ready to Start Earning Faster?</h3>
            <p className="text-xs text-gray-300">
              Join thousands of miners who accelerated their mining with premium
              membership tiers.
            </p>
            <button className="px-5 py-2 rounded-lg bg-orange-400 text-black text-xs font-bold hover:bg-orange-300 cursor-pointer">
              Choose Your Tier
            </button>
            <p className="text-[10px] text-gray-400">No commitment, cancel anytime.</p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default UserMembership;
