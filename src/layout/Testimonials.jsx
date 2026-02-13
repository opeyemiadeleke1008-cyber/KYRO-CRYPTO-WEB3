import React from "react";
import {
  ArrowLeft,
  Star,
  Quote,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const Testimonials = () => {
  const navigate = useNavigate();

  const reviews = [
    {
      name: "Alex Rivero",
      role: "Institutional Trader",
      text: "The latency on Kyro's terminal is unmatched. I've moved my entire high-frequency portfolio here because the execution speed is actually what they claim it to be.",
      rating: 5,
      verified: true,
    },
    {
      name: "Sarah Moses",
      role: "Data Scientist",
      text: "Security is my primary concern. Knowing 98% of assets are in cold storage gives my clients the peace of mind they need in this volatile market.",
      rating: 5,
      verified: true,
    },
    {
      name: "Marcus Thorne",
      role: "Crypto Enthusiast",
      text: "The Kyro Visa card is a game changer. I get my BTC cashback instantly. It’s the first crypto card that actually works flawlessly at every terminal I've tried.",
      rating: 4,
      verified: true,
    },
    {
      name: "Elena Rodriguez",
      role: "DeFi Developer",
      text: "The API documentation is the cleanest I've seen. Integrating my custom bots was seamless. Kyro is clearly built by developers, for developers.",
      rating: 5,
      verified: true,
    },
    {
      name: "Jameson K.",
      role: "Cloud Miner",
      text: "I was skeptical about cloud mining, but the transparency of the hashrate reporting on Kyro is excellent. Consistent payouts every single week.",
      rating: 5,
      verified: false,
    },
    {
      name: "Li Wei",
      role: "Day Trader",
      text: "Great UI. Dark mode is easy on the eyes during 12-hour sessions. Customer support actually responds in minutes, not days.",
      rating: 5,
      verified: true,
    },
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
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
            </div>
            Back
          </button>
          <div className="flex items-center gap-2 opacity-50">
            <span className="font-bold text-[10px] tracking-[0.2em]">
              USER VOICES // TRUSTED GLOBAL
            </span>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="py-24 px-10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-radial-to-b from-orange-500/10 to-transparent opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 italic tracking-tight">
            Trusted by the <span className="text-orange-500">Bold.</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Join over 30 million users worldwide who have chosen Kyro as their
            primary gateway to the decentralized economy.
          </p>
        </div>
      </header>

      {/* Testimonials Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="break-inside-avoid bg-white/5 border border-white/10 p-8 rounded-3xl hover:border-orange-500/40 transition-all group relative"
            >
              <Quote
                className="absolute top-6 right-8 text-white/5 group-hover:text-orange-500/10 transition-colors"
                size={48}
              />

              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="fill-orange-500 text-orange-500"
                  />
                ))}
              </div>

              <p className="text-gray-300 mb-8 leading-relaxed italic">
                "{review.text}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-orange-500 to-[#15393b] flex items-center justify-center font-bold text-black">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm">{review.name}</h4>
                    {review.verified && (
                      <CheckCircle2 size={14} className="text-orange-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    {review.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-10 border-t border-white/5 bg-linear-to-b from-black to-[#0a1a1b]">
        <div className="max-w-4xl mx-auto text-center">
          <MessageSquare className="mx-auto text-orange-500 mb-6" size={40} />
          <h2 className="text-3xl font-bold mb-6">
            Ready to write your own success story?
          </h2>
          <p className="text-gray-400 mb-10">
            Start trading with Kyro today and experience the future of finance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <button className="bg-orange-500 text-black px-10 py-4 rounded-full font-bold hover:bg-orange-600 transition-all uppercase text-xs tracking-widest cursor-pointer">
                Get Started Now
              </button>
            </Link>
            <button className="bg-white/5 text-white px-10 py-4 rounded-full font-bold border border-white/10 hover:bg-white/10 transition-all uppercase text-xs tracking-widest cursor-pointer">
              View Live Markets
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
