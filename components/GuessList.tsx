
import React from 'react';
import { MAX_GUESSES, COUNTRIES } from '../constants';
import { getDistance, getDirectionArrow } from '../utils';

interface GuessListProps {
  guesses: string[];
  correctCountryName: string;
}

const GuessList: React.FC<GuessListProps> = ({ guesses, correctCountryName }) => {
  const correctCountry = COUNTRIES.find(c => c.name.toLowerCase() === correctCountryName.toLowerCase());

  return (
    <div className="w-full max-w-md mx-auto mt-6 flex flex-col gap-2">
      {[...Array(MAX_GUESSES)].map((_, i) => {
        const guessName = guesses[i];
        const isCorrect = guessName?.toLowerCase() === correctCountryName.toLowerCase();
        const guessedCountry = guessName ? COUNTRIES.find(c => c.name.toLowerCase() === guessName.toLowerCase()) : null;
        
        let distance = 0;
        let direction = '';

        if (guessedCountry && correctCountry && !isCorrect) {
          distance = getDistance(guessedCountry.lat, guessedCountry.lng, correctCountry.lat, correctCountry.lng);
          direction = getDirectionArrow(guessedCountry.lat, guessedCountry.lng, correctCountry.lat, correctCountry.lng);
        }

        return (
          <div 
            key={i}
            className={`h-14 flex items-center px-4 rounded-xl border transition-all duration-300 ${
              guessName 
                ? isCorrect 
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-slate-900/50 border-slate-800 text-slate-600'
            }`}
          >
            <span className="mr-3 font-mono text-xs opacity-50">{i + 1}</span>
            
            {guessedCountry && (
              <img 
                src={`https://flagcdn.com/w40/${guessedCountry.code.toLowerCase()}.png`} 
                alt="" 
                className="w-6 h-auto rounded-sm shadow-sm border border-slate-700 mr-3"
                loading="lazy"
              />
            )}

            <div className="flex flex-col min-w-0">
              <span className="font-semibold truncate leading-tight">{guessName || ''}</span>
              {guessedCountry && !isCorrect && (
                <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">
                  {distance.toLocaleString()} km {direction}
                </span>
              )}
            </div>
            
            {guessName && (
              <i className={`ml-auto fa-solid ${isCorrect ? 'fa-check' : 'fa-xmark'}`}></i>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GuessList;
