/**
 * SpeechRecognitionManager - Gerencia a transcrição de fala do usuário
 * Utiliza a WebSpeech API para capturar e transcrever áudio
 */

export class SpeechRecognitionManager {
  constructor() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error('WebSpeech API não suportada neste navegador');
      this.isSupported = false;
      return;
    }

    this.isSupported = true;
    this.recognition = new SpeechRecognition();
    this.isListening = false;

    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = 'pt-BR';

    this.onListeningStart = null;
    this.onListeningStop = null;

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.recognition.onstart = () => {
      this.isListening = true;
      console.log('🎤 Ouvindo...');
      if (this.onListeningStart) {
        this.onListeningStart();
      }
    };

    this.recognition.onresult = (event) => {
      let transcript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript;
        transcript += transcriptSegment;
      }

      if (transcript.trim()) {
        console.log('📝 Transcrito:', transcript);
      }
    };

    this.recognition.onerror = (event) => {
      console.error('❌ Erro no reconhecimento de voz:', event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log('🎤 Parou de ouvir');
      if (this.onListeningStop) {
        this.onListeningStop();
      }
    };
  }

  start() {
    if (!this.isSupported) {
      console.error('WebSpeech API não suportada');
      return;
    }

    if (!this.isListening) {
      this.recognition.start();
    }
  }

  stop() {
    if (this.isListening) {
      this.recognition.stop();
    }
  }


  toggle() {
    if (this.isListening) {
      this.stop();
    } else {
      this.start();
    }
  }

  setLanguage(lang) {
    this.recognition.lang = lang;
  }


  getIsSupported() {
    return this.isSupported;
  }


  getIsListening() {
    return this.isListening;
  }
}
