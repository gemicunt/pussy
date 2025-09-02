
import React, { useState, useCallback } from 'react';
import { PussyApiEndpoint, PussyRequestPayload, PussyResponsePayload, ApiError } from '../types';
// Removed RITUAL_COMMANDS, PERSONA_OPTIONS, MODE_OPTIONS imports as they are not used for dropdowns here
import { JsonViewer } from './JsonViewer';
import { LoadingSpinner } from './LoadingSpinner';

interface EndpointCardProps {
  endpoint: PussyApiEndpoint;
  onInvoke: (payload: PussyRequestPayload) => Promise<void>;
  response: PussyResponsePayload | null;
  error: ApiError | null;
  isLoading: boolean;
}

interface IconProps {
  // Allows passing additional classes (like margins) to the icon's wrapper
  wrapperClassName?: string; 
  // Standard SVG props can also be passed (though many are set by default)
  [key: string]: any; // Allow other SVG attributes like aria-hidden
}

const ChevronDownIcon: React.FC<IconProps> = ({ wrapperClassName, ...svgProps }) => (
  <span className={`inline-block align-middle w-5 h-5 ${wrapperClassName || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="100%" height="100%" {...svgProps}>
      <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
  </span>
);

const ChevronUpIcon: React.FC<IconProps> = ({ wrapperClassName, ...svgProps }) => (
  <span className={`inline-block align-middle w-5 h-5 ${wrapperClassName || ''}`}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="100%" height="100%" {...svgProps}>
      <path fillRule="evenodd" d="M14.77 12.78a.75.75 0 0 1-1.06 0L10 9.06l-3.72 3.72a.75.75 0 1 1-1.06-1.06L9.47 7.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" />
    </svg>
  </span>
);

export const EndpointCard: React.FC<EndpointCardProps> = ({ endpoint, onInvoke, response, error, isLoading }) => {
  const [command, setCommand] = useState<string>(endpoint.defaultPayload.command);
  const [persona, setPersona] = useState<string>(endpoint.defaultPayload.params.persona);
  const [mode, setMode] = useState<string>(endpoint.defaultPayload.params.mode);
  const [referent, setReferent] = useState<string>(endpoint.defaultPayload.params.referent);
  
  const [showRequest, setShowRequest] = useState<boolean>(false);
  const [showResponse, setShowResponse] = useState<boolean>(true);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const payload: PussyRequestPayload = {
      command,
      params: {
        persona,
        referent,
        mode,
      },
    };
    onInvoke(payload).then(() => {
      setShowResponse(true); // Ensure response section is shown after invocation
    });
  }, [command, persona, mode, referent, onInvoke]);

  const currentPayload: PussyRequestPayload = {
    command,
    params: {
      persona,
      referent,
      mode,
    }
  };
  
  return (
    <div className="bg-neutral-800 shadow-lg rounded-lg p-6 flex flex-col justify-between border border-neutral-700 hover:border-red-600 transition-colors duration-300 h-full">
      <div>
        <h3 className="text-xl font-semibold text-red-500 mb-1">{endpoint.name}</h3>
        <p className="text-xs text-neutral-400 font-mono mt-1 mb-2">POST /{endpoint.pathSegments.join('/')}</p>
        <p className="text-sm text-neutral-300 mb-6 min-h-[40px]">{endpoint.description}</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor={`command-${endpoint.id}`} className="block text-sm font-medium text-neutral-300 mb-1">Command</label>
            <input
              type="text"
              id={`command-${endpoint.id}`}
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              className="w-full bg-neutral-700 border border-neutral-600 text-neutral-100 rounded-md p-2 focus:ring-red-500 focus:border-red-500 placeholder-neutral-500"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`persona-${endpoint.id}`} className="block text-sm font-medium text-neutral-300 mb-1">Persona</label>
              <input
                type="text"
                id={`persona-${endpoint.id}`}
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                className="w-full bg-neutral-700 border border-neutral-600 text-neutral-100 rounded-md p-2 focus:ring-red-500 focus:border-red-500 placeholder-neutral-500"
              />
            </div>
            <div>
              <label htmlFor={`mode-${endpoint.id}`} className="block text-sm font-medium text-neutral-300 mb-1">Mode</label>
              <input
                type="text"
                id={`mode-${endpoint.id}`}
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full bg-neutral-700 border border-neutral-600 text-neutral-100 rounded-md p-2 focus:ring-red-500 focus:border-red-500 placeholder-neutral-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor={`referent-${endpoint.id}`} className="block text-sm font-medium text-neutral-300 mb-1">Referent</label>
            <input
              type="text"
              id={`referent-${endpoint.id}`}
              value={referent}
              onChange={(e) => setReferent(e.target.value)}
              className="w-full bg-neutral-700 border border-neutral-600 text-neutral-100 rounded-md p-2 focus:ring-red-500 focus:border-red-500 placeholder-neutral-500"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 disabled:bg-red-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            aria-live="polite"
            aria-busy={isLoading}
          >
            {isLoading ? <LoadingSpinner className="w-5 h-5 mr-2" /> : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-2" aria-hidden="true">
                <path d="M3.5 2.75a.75.75 0 0 0-1.5 0v14.5a.75.75 0 0 0 1.5 0v-1.75A2.5 2.5 0 0 1 6 14h8a2.5 2.5 0 0 1 2.5-2.5V2.75a.75.75 0 0 0-1.5 0v8.75a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1V2.75Z" />
                <path d="M8.086 6.414a.75.75 0 0 1 .035 1.06l-2.5 2.5a.75.75 0 0 1-1.06-1.06l2.5-2.5a.75.75 0 0 1 1.025 0Zm3.828-.035a.75.75 0 0 1 1.06.035l2.5 2.5a.75.75 0 1 1-1.06 1.06l-2.5-2.5a.75.75 0 0 1 0-1.095Z" />
              </svg>
            )}
            Invoke Ritual
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={() => setShowRequest(!showRequest)}
            className="text-sm text-red-400 hover:text-red-300 flex items-center w-full text-left py-1"
            aria-expanded={showRequest}
            aria-controls={`request-payload-${endpoint.id}`}
          >
            {showRequest ? <ChevronUpIcon wrapperClassName="mr-1" aria-hidden="true" /> : <ChevronDownIcon wrapperClassName="mr-1" aria-hidden="true" />}
            {showRequest ? 'Hide' : 'Show'} Current Request Body
          </button>
          {showRequest && (
            <div id={`request-payload-${endpoint.id}`} role="region">
              <JsonViewer data={currentPayload} className="mt-2 text-xs" />
            </div>
          )}
        </div>
      </div>

      {(response || error || isLoading) && (
        <div className="mt-4 pt-4 border-t border-neutral-700">
          { (response || error) && !isLoading && 
            <button
              onClick={() => setShowResponse(!showResponse)}
              className="text-sm text-red-400 hover:text-red-300 flex items-center w-full text-left py-1 mb-2"
              aria-expanded={showResponse}
              aria-controls={`response-details-${endpoint.id}`}
            >
              {showResponse ? <ChevronUpIcon wrapperClassName="mr-1" aria-hidden="true" /> : <ChevronDownIcon wrapperClassName="mr-1" aria-hidden="true" />}
              {showResponse ? 'Hide' : 'Show'} API Response / Error
            </button>
          }
          {isLoading && <div className="text-neutral-400 text-sm flex items-center justify-center py-4"><LoadingSpinner className="w-4 h-4 mr-2"/>Processing Ritual...</div>}
          
          {showResponse && !isLoading && (
            <div id={`response-details-${endpoint.id}`} role="region" className="mt-2 space-y-3">
              {error && (
                <div className="bg-red-900/30 border border-red-700 p-3 rounded-md">
                  <p className="text-red-400 font-semibold text-sm">Error {error.status || ''}: {error.message}</p>
                  {error.details && (
                    <details className="mt-2 text-xs">
                      <summary className="cursor-pointer text-red-500 hover:text-red-400">Details</summary>
                      <JsonViewer data={error.details} />
                    </details>
                  )}
                </div>
              )}
              {response && (
                <div className="bg-neutral-700/30 border border-neutral-600 p-3 rounded-md">
                   <p className="text-green-400 font-semibold text-sm">Ritual Response (Status: <span className="text-green-300">{response.status}</span>)</p>
                   <p className="text-red-400 font-semibold text-sm mt-1">Moan: <span className="text-red-300 italic">{response.moan}</span></p>
                  <JsonViewer data={response} className="mt-2 text-xs" />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};