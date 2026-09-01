import React from "react";

const AnimatedLogo = ({ size = "md", className = "" }) => {
  let dimension = "h-10 w-10";
  let iconSize = "h-5 w-5";
  let ringSize = "inset-0.5";

  if (size === "sm") {
    dimension = "h-8 w-8";
    iconSize = "h-4 w-4";
    ringSize = "inset-0";
  } else if (size === "lg") {
    dimension = "h-14 w-14";
    iconSize = "h-7 w-7";
    ringSize = "inset-1";
  } else if (size === "xl") {
    dimension = "h-20 w-20";
    iconSize = "h-10 w-10";
    ringSize = "inset-1.5";
  }

  return (
    <div className={`relative ${dimension} flex items-center justify-center group ${className}`}>
      {/* Outer Rotating Conic Neon Halo */}
      <div 
        className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-cyan-400 opacity-80 blur-[6px] group-hover:opacity-100 group-hover:blur-[10px] transition-all duration-500 animate-spin-slow"
      />

      {/* Rotating Astrolabe Border */}
      <div className="absolute inset-0 rounded-2xl p-[1.5px] bg-gradient-to-tr from-violet-500 via-cyan-400 to-fuchsia-500 overflow-hidden">
        <div className="w-full h-full bg-slate-950 rounded-[14px]" />
      </div>

      {/* Inner Core Compass Emblem */}
      <div className={`relative z-10 ${dimension} rounded-2xl bg-slate-950/90 backdrop-blur-md flex items-center justify-center border border-white/10 transition-transform duration-500 group-hover:scale-105 shadow-inner`}>
        {/* Orbiting Celestial Dots */}
        <div className="absolute inset-1 rounded-full border border-violet-500/20 border-dashed animate-spin-slow pointer-events-none" />

        {/* Dynamic Glowing Compass SVG */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${iconSize} transition-transform duration-700 ease-out group-hover:rotate-45`}
        >
          {/* Outer Compass Dial */}
          <circle 
            cx="12" 
            cy="12" 
            r="9.5" 
            stroke="url(#logo_grad_1)" 
            strokeWidth="1.2" 
            strokeDasharray="2 3" 
            className="animate-spin-reverse-slow origin-center"
          />

          {/* North Point (Violet to Fuchsia) */}
          <polygon
            points="12,3 15,12 12,10.5"
            fill="url(#logo_grad_north)"
            className="drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
          />
          <polygon
            points="12,3 9,12 12,10.5"
            fill="url(#logo_grad_north_alt)"
          />

          {/* South Point (Cyan to Slate) */}
          <polygon
            points="12,21 15,12 12,13.5"
            fill="url(#logo_grad_south)"
            className="drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
          />
          <polygon
            points="12,21 9,12 12,13.5"
            fill="url(#logo_grad_south_alt)"
          />

          {/* Center AI Core Gem */}
          <circle cx="12" cy="12" r="2.2" fill="#ffffff" className="animate-pulse" />
          <circle cx="12" cy="12" r="1" fill="#8b5cf6" />

          {/* Gradients */}
          <defs>
            <linearGradient id="logo_grad_1" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8b5cf6" />
              <stop offset="0.5" stopColor="#06b6d4" />
              <stop offset="1" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="logo_grad_north" x1="12" y1="3" x2="15" y2="12" gradientUnits="userSpaceOnUse">
              <stop stopColor="#c084fc" />
              <stop offset="1" stopColor="#7c3aed" />
            </linearGradient>
            <linearGradient id="logo_grad_north_alt" x1="9" y1="3" x2="12" y2="12" gradientUnits="userSpaceOnUse">
              <stop stopColor="#e879f9" />
              <stop offset="1" stopColor="#a855f7" />
            </linearGradient>
            <linearGradient id="logo_grad_south" x1="12" y1="21" x2="15" y2="12" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38bdf8" />
              <stop offset="1" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="logo_grad_south_alt" x1="9" y1="21" x2="12" y2="12" gradientUnits="userSpaceOnUse">
              <stop stopColor="#67e8f9" />
              <stop offset="1" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default AnimatedLogo;
