
import React, { useState, useEffect } from 'react';
import { getTimeUntilNextDay } from '../utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-100">{title}</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 transition-colors"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How to Play">
      <div className="space-y-4 text-slate-300">
        <p>Guess the <span className="text-blue-400 font-semibold">Country</span> based on its shape outline.</p>
        <div className="space-y-2">
            <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-xs text-slate-400 mt-0.5">1</div>
                <p>The shape starts highly blurred. Every incorrect guess reveals more detail.</p>
            </div>
            <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-xs text-slate-400 mt-0.5">2</div>
                <p>You'll see the distance and direction to the correct country after each guess.</p>
            </div>
            <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-xs text-slate-400 mt-0.5">3</div>
                <p>A new daily country arrives at midnight London Time. Or play <b>Infinite Mode</b> anytime!</p>
            </div>
        </div>
        <button 
          onClick={onClose}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-2xl transition-colors"
        >
          Got it!
        </button>
      </div>
    </Modal>
  );
};

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  won: boolean;
  countryName: string;
  countryCode: string;
  capital: string;
  onShare: () => void;
  isInfinite: boolean;
  onStartInfinite: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ 
  isOpen, onClose, won, countryName, countryCode, capital, onShare, isInfinite, onStartInfinite 
}) => {
  const [countdown, setCountdown] = useState(getTimeUntilNextDay());

  useEffect(() => {
    if (!isOpen || isInfinite) return;
    const timer = setInterval(() => {
      setCountdown(getTimeUntilNextDay());
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, isInfinite]);

  const flagUrl = `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={won ? "Correct! 🎉" : "Game Over 😔"}>
      <div className="text-center">
        <div className="mb-6 relative group inline-block">
            <img 
                src={flagUrl} 
                alt={`${countryName} flag`} 
                className="w-48 h-auto mx-auto rounded-lg shadow-xl border border-slate-700 transition-transform group-hover:scale-105"
            />
        </div>
        <h3 className="text-3xl font-black text-slate-100 mb-2">{countryName}</h3>
        <p className="text-slate-400 mb-6 flex items-center justify-center gap-2">
            <i className="fa-solid fa-landmark text-blue-400"></i>
            Capital: <span className="text-slate-200 font-medium">{capital}</span>
        </p>

        {!isInfinite && (
          <div className="bg-slate-950/50 rounded-2xl p-4 mb-8 border border-slate-800">
              <p className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-1">Next Daily Shape In</p>
              <p className="text-2xl font-mono text-blue-400 font-bold">{countdown}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={onShare}
              className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 border border-slate-700"
            >
              <i className="fa-solid fa-share-nodes"></i>
              Share Result
            </button>

            <button 
              onClick={onStartInfinite}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
            >
              <i className="fa-solid fa-infinity"></i>
              {isInfinite ? "Next Random Shape" : "Play Infinite Mode"}
            </button>

            <button 
              onClick={onClose}
              className="bg-slate-900 hover:bg-slate-800 text-slate-400 font-bold py-4 px-6 rounded-2xl transition-all"
            >
              Close
            </button>
        </div>
      </div>
    </Modal>
  );
};
