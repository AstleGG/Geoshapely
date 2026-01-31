
import React, { useState, useEffect, useRef } from 'react';
import { COUNTRIES } from '../constants';
import { Country, GameFilter } from '../types';

interface GuessInputProps {
  onGuess: (countryName: string) => void;
  disabled: boolean;
  previousGuesses: string[];
  activeFilter: GameFilter;
  isInfiniteMode: boolean;
}

const GuessInput: React.FC<GuessInputProps> = ({ 
  onGuess, 
  disabled, 
  previousGuesses, 
  activeFilter, 
  isInfiniteMode 
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Country[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const normalizedQuery = query.toLowerCase().trim();
      
      const filtered = COUNTRIES.filter(c => {
        // --- MODE-AWARE FILTERING RULES ---
        
        // 1. Search Logic (Basic name match)
        const nameMatch = c.name.toLowerCase().includes(normalizedQuery);
        const alreadyGuessed = previousGuesses.some(pg => pg.toLowerCase() === c.name.toLowerCase());
        if (!nameMatch || alreadyGuessed) return false;

        // 2. Infinite Mode Restrictions
        if (isInfiniteMode) {
          // Continental Restriction: If a continent is set, you can ONLY guess from it.
          if (activeFilter.continent !== 'All' && c.continent !== activeFilter.continent) {
            return false;
          }
          
          // Type Restriction:
          // If 'Sovereign' selected -> Only Sovereign.
          // If 'Territory' selected -> Only Territory.
          // If 'All' selected -> Both are allowed.
          if (activeFilter.type === 'Sovereign' && c.type !== 'Sovereign') return false;
          if (activeFilter.type === 'Territory' && c.type !== 'Territory') return false;
        } else {
          // Daily Mode (Standard/Normal)
          // Allows all sovereign countries globally, but blocks territories/unrecognized regions.
          if (c.type === 'Territory') return false;
        }

        return true;
      })
      .sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(normalizedQuery);
        const bStarts = b.name.toLowerCase().startsWith(normalizedQuery);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.name.localeCompare(b.name);
      })
      .slice(0, 10);

      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query, previousGuesses, activeFilter, isInfiniteMode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (name: string) => {
    onGuess(name);
    setQuery('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (suggestions.length > 0) {
        handleSelect(suggestions[0].name);
      } else if (query.trim() !== '') {
        const exactMatch = COUNTRIES.find(c => {
           // Apply same strict logic as the search filter
           if (isInfiniteMode) {
             if (activeFilter.continent !== 'All' && c.continent !== activeFilter.continent) return false;
             if (activeFilter.type === 'Sovereign' && c.type !== 'Sovereign') return false;
             if (activeFilter.type === 'Territory' && c.type !== 'Territory') return false;
           } else {
             if (c.type === 'Territory') return false;
           }
           return c.name.toLowerCase() === query.toLowerCase().trim();
        });
        if (exactMatch) {
            handleSelect(exactMatch.name);
        }
      }
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const getPlaceholder = () => {
    if (disabled) return "Game finished";
    
    if (isInfiniteMode) {
      const region = activeFilter.continent === 'All' ? 'global' : activeFilter.continent.toLowerCase();
      if (activeFilter.type === 'Territory') return `Guess ${region} territories...`;
      if (activeFilter.type === 'Sovereign') return `Guess ${region} countries...`;
      return `Guess any ${region} country...`;
    }
    
    return "Guess a sovereign country...";
  };

  return (
    <div className="relative w-full max-w-md mx-auto" ref={containerRef}>
      <div className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          placeholder={getPlaceholder()}
          disabled={disabled}
          autoComplete="off"
          className="w-full bg-slate-900 border-2 border-slate-800 text-slate-100 px-5 py-4 rounded-2xl focus:outline-none focus:border-blue-500 transition-all text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group-hover:border-slate-700"
        />
        {!disabled && (
           <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
             <i className="fa-solid fa-magnifying-glass"></i>
           </div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 max-h-[40vh] overflow-y-auto custom-scrollbar">
          {suggestions.map((country) => (
            <li
              key={country.code}
              onClick={() => handleSelect(country.name)}
              className="px-5 py-3 hover:bg-slate-800 cursor-pointer transition-colors flex items-center gap-4 border-b border-slate-800 last:border-0"
            >
              <img 
                src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`} 
                alt="" 
                className="w-8 h-auto rounded shadow-sm border border-slate-700"
                loading="lazy"
              />
              <div className="flex flex-col">
                <span className="text-slate-100 font-medium leading-none mb-1">{country.name}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-tighter font-bold">
                    {country.continent} • {country.type === 'Territory' ? 'Region' : 'Country'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GuessInput;
