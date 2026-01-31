
import React from 'react';
import { Continent, Difficulty, CountryType, GameFilter } from '../types';

interface ModeSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (filter: GameFilter) => void;
  currentFilter: GameFilter;
}

const ModeSelection: React.FC<ModeSelectionProps> = ({ isOpen, onClose, onSelectMode, currentFilter }) => {
  if (!isOpen) return null;

  const continents: Continent[] = ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  const difficulties: (Difficulty | 'Mixed')[] = ['Mixed', 'Easy', 'Normal', 'Hard'];
  const types: (CountryType | 'All')[] = ['All', 'Sovereign', 'Territory'];

  const handleSelection = (key: keyof GameFilter, value: any) => {
    onSelectMode({
      ...currentFilter,
      [key]: value
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 max-w-2xl w-full shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-100 tracking-tight">Game Modes</h2>
            <p className="text-slate-500 font-medium">Customize your challenge pool</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-slate-100 transition-all active:scale-90">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="space-y-8">
          {/* Continent Selection */}
          <section>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <i className="fa-solid fa-globe"></i> Continent
            </h3>
            <div className="flex flex-wrap gap-2">
              {continents.map(c => (
                <button
                  key={c}
                  onClick={() => handleSelection('continent', c)}
                  className={`px-5 py-2.5 rounded-xl font-bold transition-all ${
                    currentFilter.continent === c 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </section>

          {/* Difficulty Selection */}
          <section>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <i className="fa-solid fa-bolt"></i> Difficulty
            </h3>
            <div className="flex flex-wrap gap-2">
              {difficulties.map(d => (
                <button
                  key={d}
                  onClick={() => handleSelection('difficulty', d)}
                  className={`px-5 py-2.5 rounded-xl font-bold transition-all ${
                    currentFilter.difficulty === d 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </section>

          {/* Type Selection */}
          <section>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <i className="fa-solid fa-map-location-dot"></i> Region Type
            </h3>
            <div className="flex flex-wrap gap-2">
              {types.map(t => (
                <button
                  key={t}
                  onClick={() => handleSelection('type', t)}
                  className={`px-5 py-2.5 rounded-xl font-bold transition-all ${
                    currentFilter.type === t 
                      ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {t === 'Sovereign' ? 'Recognized' : t === 'Territory' ? 'Unrecognized/Territories' : 'All'}
                </button>
              ))}
            </div>
          </section>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-10 bg-slate-50 text-slate-950 font-black py-5 rounded-2xl hover:bg-white transition-all active:scale-95 shadow-xl shadow-white/5 uppercase tracking-[0.1em]"
        >
          Confirm Settings
        </button>
      </div>
    </div>
  );
};

export default ModeSelection;
