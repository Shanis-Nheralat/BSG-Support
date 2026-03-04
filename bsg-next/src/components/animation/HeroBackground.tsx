'use client';

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient orbs */}
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gold/10 blur-3xl animate-float-slow" />
      <div className="absolute top-1/2 -left-20 h-60 w-60 rounded-full bg-gold/5 blur-2xl animate-float-medium" />
      <div className="absolute -bottom-20 right-1/4 h-72 w-72 rounded-full bg-white/5 blur-3xl animate-float-reverse" />
      
      {/* Floating geometric shapes */}
      <div className="absolute top-20 right-[20%] h-4 w-4 rotate-45 bg-gold/20 animate-float-slow" />
      <div className="absolute top-1/3 right-[10%] h-3 w-3 rounded-full bg-white/20 animate-float-medium" />
      <div className="absolute bottom-1/4 right-[30%] h-2 w-2 rotate-45 bg-gold/30 animate-float-reverse" />
      <div className="absolute top-[60%] right-[15%] h-5 w-5 rounded-full border border-white/10 animate-float-slow" />
      <div className="absolute top-[40%] right-[25%] h-3 w-3 rounded-full border border-gold/20 animate-float-medium" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Diagonal lines */}
      <svg className="absolute top-0 right-0 h-full w-1/2 opacity-5" preserveAspectRatio="none">
        <defs>
          <pattern id="diagonal-lines" patternUnits="userSpaceOnUse" width="40" height="40">
            <path d="M-10,10 l20,-20 M0,40 l40,-40 M30,50 l20,-20" 
                  stroke="currentColor" 
                  strokeWidth="0.5" 
                  className="text-white"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagonal-lines)" />
      </svg>
    </div>
  );
}
