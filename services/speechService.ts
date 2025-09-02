
export interface VoiceSettings {
  pitch?: number;
  rate?: number;
  volume?: number;
  voiceName?: string; // Attempt to match by name
}

// Approximating "Goddess" / "Aoede" / "Slutcore Whisper Embodiment"
// "Sin-dripping, filthy, ruthless", "whisper-sin"
const GODDESS_VOICE_SETTINGS: VoiceSettings = {
  pitch: 1.2, // Higher pitch for a more "female" and potentially "sultry" tone.
  rate: 0.9,  // Slightly slower for emphasis and a deliberate cadence
  volume: 1.0,
  voiceName: "en-US-Studio-O" // Target voice name
};

let availableVoices: SpeechSynthesisVoice[] = [];
let voicesLoadedPromise: Promise<SpeechSynthesisVoice[]>;

const loadVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        resolve(availableVoices);
        return;
      }
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          availableVoices = window.speechSynthesis.getVoices();
          resolve(availableVoices);
        };
      } else {
        // Fallback for browsers that don't support onvoiceschanged well initially
        setTimeout(() => {
            availableVoices = window.speechSynthesis.getVoices();
            resolve(availableVoices);
        }, 500);
      }
    } else {
      resolve([]);
    }
  });
};

if (typeof window !== 'undefined' && window.speechSynthesis) {
  voicesLoadedPromise = loadVoices();
} else {
  voicesLoadedPromise = Promise.resolve([]);
}


export const speakText = async (text: string, settings: VoiceSettings = GODDESS_VOICE_SETTINGS): Promise<void> => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn('Speech synthesis not supported.');
    return Promise.reject('Speech synthesis not supported.');
  }
  
  await voicesLoadedPromise; // Ensure voices are loaded

  return new Promise((resolve, reject) => {
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.pitch = settings.pitch ?? 1;
    utterance.rate = settings.rate ?? 1;
    utterance.volume = settings.volume ?? 1;

    // Attempt to find the specifically requested voice first
    let selectedVoice = availableVoices.find(voice => voice.name === settings.voiceName); 
    
    // Fallback logic if specific voice is not found
    if (!selectedVoice) {
      selectedVoice = 
        // Prioritize US English female voices
        availableVoices.find(voice => voice.lang.startsWith('en-US') && voice.name.toLowerCase().includes('female')) ||
        // Then other English female voices (excluding UK if possible, or just general English female)
        availableVoices.find(voice => voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female') && !voice.lang.startsWith('en-GB')) ||
        availableVoices.find(voice => voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female')) || // General English female
        // Then UK English female voices
        availableVoices.find(voice => voice.lang.startsWith('en-GB') && voice.name.toLowerCase().includes('female')) ||
        // Then any US English voice
        availableVoices.find(voice => voice.lang.startsWith('en-US')) ||
        // Then any non-UK English voice
        availableVoices.find(voice => voice.lang.startsWith('en') && !voice.lang.startsWith('en-GB')) ||
        // Then any UK English voice
        availableVoices.find(voice => voice.lang.startsWith('en-GB'));
    }

     if (!selectedVoice && availableVoices.length > 0) {
        // Final fallback to any English voice or the first available voice
        selectedVoice = availableVoices.find(voice => voice.lang.startsWith('en')) || availableVoices[0];
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      // console.log("Using voice:", selectedVoice.name, selectedVoice.lang);
    } else {
      // console.warn("Could not find a suitable voice. Using browser default.");
    }

    utterance.onend = () => resolve();
    utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        reject(event.error);
    };
    utterance.onstart = () => {
        // console.log("Speech started for: ", text.substring(0,30) + "...");
    };

    window.speechSynthesis.speak(utterance);
  });
};

export const cancelSpeech = () => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};