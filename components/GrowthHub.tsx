
import React from 'react';

const GROWTH_SERVICES = [
  {
    id: 'lead-gen',
    title: 'Lead Generation',
    desc: 'Dive into a robust pipeline of potential clients tailored for the commercial construction realm.',
    price: '199',
    cta: 'Get 10 Leads FREE',
    icon: '🎯',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'marketing',
    title: 'Marketing Service',
    desc: "Elevate your brand's presence in the commercial construction space from digital strategy to content creation.",
    price: '999',
    cta: 'See Your Potential',
    icon: '📣',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'advertising',
    title: 'Advertising Service',
    desc: 'Amplify your reach with targeted campaigns meticulously crafted to resonate with decision-makers.',
    price: '1999',
    cta: 'Grow Your Business',
    icon: '🚀',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'scaling',
    title: 'Scale Your Business',
    desc: 'Supercharge your operations using industry insights and growth hacking techniques.',
    price: '4999',
    cta: 'Grow Now',
    icon: '📈',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'sales-training',
    title: 'Sales Training',
    desc: 'Supercharge your sales team with skills tailored for the construction industry’s unique cycles.',
    price: '2299',
    cta: 'Boost Sales Skills',
    icon: '🎓',
    color: 'from-yellow-500 to-orange-600'
  },
  {
    id: 'web-dev',
    title: 'Web Development',
    desc: 'Step into the digital age with a web presence tailored for high-end commercial construction businesses.',
    price: '3999',
    cta: 'Build Your Digital Image',
    icon: '💻',
    color: 'from-cyan-500 to-blue-600'
  }
];

export const GrowthHub = () => {
  return (
    <div className="p-8 md:p-16 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter uppercase">
          Why Choose PrimeBidPro Growth?
        </h2>
        <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
          We utilize latest estimation software and real-world expertise to support your project from start to finish.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {GROWTH_SERVICES.map((service) => (
          <div key={service.id} className="glass p-8 rounded-[2rem] border border-white/5 flex flex-col items-center text-center transition-all hover:scale-[1.02] hover:bg-white/5 group relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${service.color}`}></div>
            
            <div className="text-5xl mb-6 bg-white/5 w-20 h-20 rounded-3xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
              {service.icon}
            </div>
            
            <h3 className="text-xl font-black text-white uppercase mb-4 tracking-tight">{service.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-8 flex-1">
              {service.desc}
            </p>

            <button className={`w-full py-4 rounded-2xl bg-gradient-to-r ${service.color} text-white text-[10px] font-black uppercase tracking-widest shadow-xl transition-all hover:brightness-110 active:scale-95`}>
              {service.cta}
            </button>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Starting @</span>
              <span className="text-2xl font-black text-white">${service.price}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-24 p-12 glass rounded-[3rem] border border-white/10 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 text-left">
          <div className="flex-1">
            <h3 className="text-3xl font-black text-white mb-6 tracking-tighter uppercase">Ready to scale?</h3>
            <ul className="space-y-4">
              {[
                { label: 'Advanced Tools', text: 'Latest estimation software ensuring fast and accurate results.' },
                { label: 'Experienced Team', text: 'Decades of combined experience in commercial construction.' },
                { label: 'Custom Solutions', text: 'Tailored services to meet specific project needs.' },
                { label: 'Trusted Partnership', text: 'Your partner in success from start to finish.' }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                  <p className="text-sm text-slate-400">
                    <strong className="text-slate-200 uppercase text-[11px] font-black mr-2 tracking-wide">{item.label}:</strong>
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-shrink-0">
            <button className="px-12 py-5 bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl transition-all transform active:scale-95 border border-white/10">
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
