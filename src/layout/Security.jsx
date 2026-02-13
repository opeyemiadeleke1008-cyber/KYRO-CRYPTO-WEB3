import React from 'react';

const Security = () => {
  return (
    <section className="bg-linear-to-br from-black/90 to-[#15393b] py-20 px-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        
        {/* Left Side: Content */}
        <div className="md:w-1/2">
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Your Assets, Protected by <span className="text-orange-500">Kyro Shield</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            We use military-grade encryption, cold storage for 98% of assets, 
            and multi-factor authentication to ensure your portfolio remains yours alone.
          </p>
          
          <div className="space-y-4">
            {['Institutional-grade Security', '24/7 Real-time Monitoring', 'Insurance Fund Protection'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white group">
                <div className="bg-orange-500/20 p-1 rounded-full group-hover:bg-orange-500/40 transition-colors">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                </div>
                <span className="font-semibold text-sm md:text-base">{item}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Side: Visual Security Terminal */}
        <div className="md:w-1/2 border border-white/10 rounded-3xl p-8 bg-white/5 backdrop-blur-md shadow-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-black/40 rounded-2xl text-center border border-white/5 hover:border-orange-500/30 transition-all cursor-default">
              <h4 className="text-orange-500 text-xl font-bold">2FA</h4>
              <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Security Standard</p>
            </div>
            
            <div className="p-6 bg-black/40 rounded-2xl text-center border border-white/5 hover:border-orange-500/30 transition-all cursor-default">
              <h4 className="text-orange-500 text-xl font-bold">SSL</h4>
              <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Encryption Layer</p>
            </div>
            
            <div className="p-6 bg-black/40 rounded-2xl text-center border border-white/5 hover:border-orange-500/30 transition-all cursor-default col-span-2">
              <h4 className="text-orange-500 text-xl font-bold">Safe Deposit</h4>
              <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">98% Cold Wallet Storage</p>
            </div>
          </div>
          
          {/* Animated Status Bar */}
          <div className="mt-6 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="bg-orange-500 h-full w-[98%] animate-pulse"></div>
          </div>
          <p className="text-[10px] text-gray-500 mt-2 text-center uppercase font-bold tracking-tighter">
            System Status: Fully Operational
          </p>
        </div>
        
      </div>
    </section>
  );
};

export default Security;