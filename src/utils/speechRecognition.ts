export class SpeechRecognitionService {
  private recognition: any = null;
  private isListening = false;
  private retryAttempt = 0;
  private maxRetries = 2;

  constructor() {
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 1;
    }
  }

  isSupported(): boolean {
    return this.recognition !== null;
  }

  start(
    onResult: (transcript: string) => void,
    onError: (error: string) => void
  ): void {
    if (!this.recognition || this.isListening) return;

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log('Speech recognized:', transcript);
      onResult(transcript);
      this.isListening = false;
      this.retryAttempt = 0;
    };

    this.recognition.onerror = (event: any) => {
      console.log('Speech recognition error:', event.error);
      
      // Handle "no-speech" error by retrying automatically
      if (event.error === 'no-speech' && this.retryAttempt < this.maxRetries) {
        console.log(`No speech detected, retry attempt ${this.retryAttempt + 1}/${this.maxRetries}`);
        this.retryAttempt++;
        this.isListening = false;
        
        // Automatically retry after a short delay
        setTimeout(() => {
          if (!this.isListening) {
            this.start(onResult, onError);
          }
        }, 300);
        return;
      }
      
      // For other errors or max retries reached
      this.isListening = false;
      this.retryAttempt = 0;
      
      if (event.error === 'no-speech') {
        onError('No speech detected. Please speak clearly into your microphone.');
      } else if (event.error === 'not-allowed') {
        onError('Microphone access denied. Please allow microphone permissions.');
      } else if (event.error === 'network') {
        onError('Network error. Please check your connection.');
      } else {
        onError(`Speech recognition error: ${event.error}`);
      }
    };

    this.recognition.onend = () => {
      console.log('Speech recognition ended');
      // Only set to false if we're not retrying
      if (this.retryAttempt === 0) {
        this.isListening = false;
      }
    };

    try {
      this.recognition.start();
      this.isListening = true;
      console.log('Speech recognition started');
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      onError('Failed to start speech recognition. Please try again.');
      this.isListening = false;
      this.retryAttempt = 0;
    }
  }

  stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      this.retryAttempt = 0;
      console.log('Speech recognition stopped');
    }
  }

  getIsListening(): boolean {
    return this.isListening;
  }
}

export class TextToSpeechService {
  private synthesis: SpeechSynthesis;
  private isSpeaking = false;

  constructor() {
    this.synthesis = window.speechSynthesis;
  }

  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  speak(
    text: string,
    onEnd: () => void,
    onError: (error: string) => void
  ): void {
    if (!this.isSupported() || this.isSpeaking) return;

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to use a British English voice for J.A.R.V.I.S. effect
    const voices = this.synthesis.getVoices();
    const britishVoice = voices.find(voice => 
      voice.lang.includes('en-GB') || voice.name.includes('British')
    );
    
    if (britishVoice) {
      utterance.voice = britishVoice;
    }
    
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      onEnd();
    };

    utterance.onerror = (event) => {
      this.isSpeaking = false;
      onError(event.error);
    };

    this.synthesis.speak(utterance);
  }

  stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.isSpeaking = false;
    }
  }

  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}
