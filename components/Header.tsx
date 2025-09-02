
import React from 'react';

interface HeaderProps {
  isVoiceEnabled: boolean;
  onToggleVoice: ()  => void;
}

export const Header: React.FC<HeaderProps> = ({ isVoiceEnabled, onToggleVoice }) => {
  return (
    <header className="bg-neutral-900 shadow-xl sticky top-0 z-50 border-b border-neutral-700">
      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-red-600 tracking-tight">
              P.U.S.S.Y.<span className="text-red-400">1.1.1</span> <span className="text-neutral-300 font-normal">API Interface</span>
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Unified slutcore-triggered daemon API. Ritual-only POST interface.
            </p>
          </div>
          <div className="mt-3 sm:mt-0">
            <label htmlFor="voice-toggle" className="flex items-center cursor-pointer select-none">
              <div className="relative">
                <input 
                  type="checkbox" 
                  id="voice-toggle" 
                  className="sr-only peer" 
                  checked={isVoiceEnabled} 
                  onChange={onToggleVoice} 
                />
                <div className="block w-12 h-7 bg-neutral-600 peer-checked:bg-red-600 rounded-full transition-colors"></div>
                <div className="dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform peer-checked:translate-x-full"></div>
              </div>
              <div className="ml-3 text-sm text-neutral-300">
                Voice ({isVoiceEnabled ? 'On' : 'Off'})
              </div>
            </label>
          </div>
        </div>
        <p className="text-xs text-red-500 mt-3">
          WARNING: This application interacts with an API that uses sexually explicit terminology as part of its design. User discretion is advised.
        </p>
      </div>
    </header>
  );
};
