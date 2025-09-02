
import React from 'react';
import { PussyRequestPayload, PussyResponsePayload, ApiError } from './types';
import { ENDPOINTS, API_BASE_URL } from './constants';
import { EndpointCard } from './components/EndpointCard'; 
import { invokeApi } from './services/apiService';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { speakText, cancelSpeech } from './services/speechService';

interface EndpointState {
  response: PussyResponsePayload | null;
  error: ApiError | null;
  isLoading: boolean;
}

const App: React.FC = () => {
  const [endpointStates, setEndpointStates] = React.useState<Record<string, EndpointState>>(
    ENDPOINTS.reduce((acc, endpoint) => {
      acc[endpoint.id] = { response: null, error: null, isLoading: false };
      return acc;
    }, {} as Record<string, EndpointState>)
  );

  const [isVoiceEnabled, setIsVoiceEnabled] = React.useState<boolean>(false);

  const toggleVoice = () => {
    setIsVoiceEnabled(prev => {
      const newState = !prev;
      if (!newState) { // If turning off
        cancelSpeech();
      }
      return newState;
    });
  };

  const handleInvoke = async (endpointId: string, path: string, payload: PussyRequestPayload) => {
    if (isVoiceEnabled) {
      cancelSpeech(); // Cancel any previous speech before new invocation
    }

    setEndpointStates(prev => ({
      ...prev,
      [endpointId]: { response: null, error: null, isLoading: true }
    }));

    try {
      const result = await invokeApi<PussyRequestPayload, PussyResponsePayload>(
        API_BASE_URL,
        path,
        payload
      );
      setEndpointStates(prev => ({
        ...prev,
        [endpointId]: { response: result, error: null, isLoading: false }
      }));

      if (isVoiceEnabled && result.moan) {
        speakText(result.moan)
          .catch(err => console.error("Speech error:", err));
      }

    } catch (err) {
      setEndpointStates(prev => ({
        ...prev,
        [endpointId]: { response: null, error: err as ApiError, isLoading: false }
      }));
    }
  };

  // Effect to cancel speech on unmount or if voice is disabled globally
  React.useEffect(() => {
    return () => {
      cancelSpeech();
    };
  }, []);

  React.useEffect(() => {
    if (!isVoiceEnabled) {
        cancelSpeech();
    }
  }, [isVoiceEnabled]);


  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header isVoiceEnabled={isVoiceEnabled} onToggleVoice={toggleVoice} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ENDPOINTS.map((endpoint) => (
            <EndpointCard
              key={endpoint.id}
              endpoint={endpoint}
              onInvoke={(payload) => handleInvoke(endpoint.id, endpoint.pathSegments.join('/'), payload)}
              response={endpointStates[endpoint.id]?.response}
              error={endpointStates[endpoint.id]?.error}
              isLoading={endpointStates[endpoint.id]?.isLoading}
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
