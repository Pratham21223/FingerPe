const WAKE_WORDS = ['hello', 'hey', 'hi', 'fingu', 'hey there', 'hey fingu', 'hello fingu'];

let recognitionInstance = null;
let isRunning = false;

export const initWakeWordDetector = (onWakeWordDetected) => {
  if (recognitionInstance) {
    return recognitionInstance;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    console.error('❌ Speech Recognition not supported');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onstart = () => {
    isRunning = true;
    console.log('🎤 Wake word detector STARTED');
  };

  recognition.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript.toLowerCase().trim();
      const isFinal = event.results[i].isFinal;

      console.log(`[${isFinal ? 'FINAL' : 'INTERIM'}] "${transcript}"`);

      if (isFinal) {
        const found = WAKE_WORDS.some(word => transcript.includes(word));
        if (found) {
          console.log('✅ WAKE WORD DETECTED:', transcript);
          isRunning = false;
          recognition.stop(); // Stop properly
          onWakeWordDetected?.();
        }
      }
    }
  };

  recognition.onerror = (event) => {
    console.error('❌ Recognition error:', event.error);
  };

  recognition.onend = () => {
    isRunning = false;
    console.log('⏸️  Recognition ended');
  };

  recognitionInstance = recognition;
  return recognition;
};

export const startWakeWordDetector = () => {
  if (!recognitionInstance) {
    console.warn('⚠️  Detector not initialized');
    return;
  }

  if (isRunning) {
    console.log('Already running');
    return;
  }

  try {
    isRunning = true;
    recognitionInstance.start();
    console.log('🎤 Starting detector...');
  } catch (error) {
    console.log('Already starting:', error.message);
  }
};

export const stopWakeWordDetector = () => {
  if (!recognitionInstance || !isRunning) {
    return;
  }

  try {
    recognitionInstance.stop();
    isRunning = false;
    console.log('🛑 Stopped detector');
  } catch (error) {
    console.log('Error stopping:', error.message);
  }
};
