import React from 'react'

const Faq = () => {
  return (
    <section className="bg-black py-20 px-10">
  <div className="max-w-4xl mx-auto">
    <h2 className="text-3xl font-bold text-white text-center mb-12 italic">Frequently Asked Questions</h2>
    <div className="space-y-4">
      {[
        { q: "How do I secure my Kyro account?", a: "Enable 2FA in settings and never share your seed phrase." },
        { q: "What are the trading fees?", a: "Kyro offers industry-leading fees starting at 0.01% for VIP members." },
        { q: "How long do withdrawals take?", a: "Crypto withdrawals are instant; fiat may take 1-3 business days." }
      ].map((faq, i) => (
        <div key={i} className="bg-[#15393b]/30 p-6 rounded-2xl border border-white/5">
          <h4 className="text-white font-semibold mb-2">{faq.q}</h4>
          <p className="text-gray-400 text-sm">{faq.a}</p>
        </div>
      ))}
    </div>
  </div>
</section>
  )
}

export default Faq