
import React from 'react';
import { BlurLevel } from '../types';

interface ShapeDisplayProps {
  countryCode: string;
  guessCount: number;
  isRevealed: boolean;
}

const ShapeDisplay: React.FC<ShapeDisplayProps> = ({ countryCode, guessCount, isRevealed }) => {
  const getBlurClass = () => {
    if (isRevealed) return BlurLevel.NONE;
    switch (guessCount) {
      case 0: return BlurLevel.LEVEL_0;
      case 1: return BlurLevel.LEVEL_1;
      case 2: return BlurLevel.LEVEL_2;
      case 3: return BlurLevel.LEVEL_3;
      case 4: return BlurLevel.LEVEL_4;
      case 5: return BlurLevel.LEVEL_5;
      default: return BlurLevel.NONE;
    }
  };

  const svgUrl = `https://raw.githubusercontent.com/djaiss/mapsicon/master/all/${countryCode.toLowerCase()}/vector.svg`;

  return (
    <div className="relative w-full max-w-[300px] h-[300px] flex items-center justify-center mx-auto mb-8 bg-slate-900/40 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden group">
      {/* Dynamic Background Pulse */}
      <div className={`absolute inset-0 bg-blue-500/5 transition-opacity duration-700 ${isRevealed ? 'opacity-20' : 'opacity-0'}`} />
      
      {/* The Country Shape */}
      <img
        src={svgUrl}
        alt="Country outline"
        className={`w-4/5 h-4/5 object-contain transition-all duration-700 ease-in-out select-none pointer-events-none drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] invert ${getBlurClass()}`}
      />
      
      {/* Fog Overlay Effect */}
      {!isRevealed && (
        <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent to-slate-950/20" />
      )}
    </div>
  );
};

export default ShapeDisplay;
