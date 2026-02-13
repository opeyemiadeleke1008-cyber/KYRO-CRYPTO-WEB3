import React from 'react';

const LineChart = ({ timePeriod = '24H' }) => {
  const dataMap = {
    '24H': [{ x: 0, y: 30 }, { x: 1, y: 45 }, { x: 2, y: 42 }, { x: 3, y: 65 }, { x: 4, y: 58 }, { x: 5, y: 85 }],
    '7D': [{ x: 0, y: 20 }, { x: 1, y: 30 }, { x: 2, y: 45 }, { x: 3, y: 40 }, { x: 4, y: 55 }, { x: 5, y: 50 }],
    '30D': [{ x: 0, y: 60 }, { x: 1, y: 55 }, { x: 2, y: 70 }, { x: 3, y: 65 }, { x: 4, y: 80 }, { x: 5, y: 75 }],
    'ALL': [{ x: 0, y: 10 }, { x: 1, y: 40 }, { x: 2, y: 30 }, { x: 3, y: 80 }, { x: 4, y: 60 }, { x: 5, y: 95 }]
  };

  const dataPoints = dataMap[timePeriod] || dataMap['24H'];

  // Sharp terminal path
  const pathData = dataPoints.reduce((path, point, index) => {
    const x = (point.x / 5) * 100;
    const y = 100 - (point.y / 100) * 100;
    return index === 0 ? `M ${x} ${y}` : `${path} L ${x} ${y}`;
  }, '');

  return (
    <div className="w-full h-full bg-black/20 border border-white/5 p-4 rounded-3xl relative overflow-hidden group">
      {/* Terminal Metadata Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-[10px] font-black text-orange-500 uppercase italic tracking-tighter">Live_Performance_Index</p>
          <p className="text-[8px] text-gray-600 font-mono tracking-widest">SIGNAL: STABLE // VOL: HIGH</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-mono text-teal-500">+{dataPoints[5].y}%</p>
        </div>
      </div>

      <div className="relative h-[120px] w-full mt-4">
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Hard scanline-style area gradient */}
            <linearGradient id="terminalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </linearGradient>
            
            {/* Neon Glow Filter */}
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Subtle Cyber Grid */}
          {[0, 25, 50, 75, 100].map((val) => (
            <React.Fragment key={val}>
              <line x1="0" y1={val} x2="100" y2={val} stroke="white" strokeOpacity="0.03" strokeWidth="0.5" />
              <line x1={val} y1="0" x2={val} y2="100" stroke="white" strokeOpacity="0.03" strokeWidth="0.5" />
            </React.Fragment>
          ))}

          {/* Background Area */}
          <path
            d={`${pathData} L 100 100 L 0 100 Z`}
            fill="url(#terminalGradient)"
          />

          {/* The Main Line */}
          <path
            d={pathData}
            fill="none"
            stroke="#f97316" // Orange-500
            strokeWidth="1.2"
            strokeLinecap="square"
            filter="url(#neonGlow)"
            className="drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]"
          />

          {/* Interactive Points - Only visible on hover */}
          {dataPoints.map((point, index) => {
            const x = (point.x / 5) * 100;
            const y = 100 - (point.y / 100) * 100;
            return (
              <rect
                key={index}
                x={x - 1}
                y={y - 1}
                width="2"
                height="2"
                fill="white"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            );
          })}
        </svg>
      </div>

      {/* X-Axis labels */}
      <div className="flex justify-between mt-2 px-1">
         {['00:00', '06:00', '12:00', '18:00', '23:59'].map(time => (
           <span key={time} className="text-[8px] font-mono text-gray-700 tracking-tighter">{time}</span>
         ))}
      </div>
    </div>
  );
};

export default LineChart;