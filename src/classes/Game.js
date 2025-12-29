import * as THREE from 'three';
import { InputManager } from './InputManager.js';
import { Player } from './Player.js';
import { GameScene } from './GameScene.js';
import { AudioManager } from './AudioManager.js';
import { FPSCounter } from './FPSCounter.js';
import { SpeechRecognitionManager } from './SpeechRecognitionManager.js';

export class Game {
  constructor() {
    this.inputManager = new InputManager();
    this.gameScene = new GameScene();
    this.player = new Player(this.inputManager);
    this.audioManager = new AudioManager(this.player.getCamera());
    this.fpsCounter = new FPSCounter();
    this.speechRecognitionManager = new SpeechRecognitionManager();
    this.speechIndicator = document.getElementById('speech-indicator');

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;

    this.isPaused = false;
    this.animationFrameId = null;

    this.settingsMenu = document.getElementById('settings-container');
    if (!this.settingsMenu) {
        console.error("O 'settings-container' elemenento não foi encontrado no DOM.");
    }

    const container = document.getElementById('canvas-container');
    if (container) {
      container.appendChild(this.renderer.domElement);
    }

    const params = new URLSearchParams(window.location.search);
    this.settingsOnlyMode = params.get('startMenu') === 'true';
    if (this.settingsOnlyMode) {
        this.hideGameUI();
        this.togglePause();
    }

    this.setupEventListeners();
    this.setupAudio();
    this.setupCollisions();
    this.setupPlayerAudio();
    this.setupSpeechIndicator();
    this.animate();
  }

togglePause() {
    this.isPaused = !this.isPaused;

    if (this.isPaused) {
        if (this.settingsMenu) {
            this.settingsMenu.style.display = 'block';
        }

        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

    } else {
        if (this.settingsMenu) {
            this.settingsMenu.style.display = 'none';
        }

        this.animate();
    }
}

hideGameUI() {
    const elementsToHide = [
        'canvas-container',
        'health-bar-container',
        'pergaminho-magico',
        'hud',
        'menu-button',
        'crosshair',
        'info',
        'speech-indicator'
    ];

    elementsToHide.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    });
}

  setupEventListeners() {
    window.addEventListener('resize', () => this.onWindowResize());

    // Event listener para a tecla "P" para pausar/despausar o jogo
    document.addEventListener('keydown', (event) => {
        if (event.key.toLowerCase() === "p" && !this.settingsOnlyMode) {
            this.togglePause();
        }
        // Event listener para a tecla "V" para iniciar/parar a captura de voz
        if (event.key.toLowerCase() === "v" && !this.settingsOnlyMode) {
            this.speechRecognitionManager.toggle();
        }
    });
    // Event Listener para perda de foco (mudança de aba ou minimização)
    document.addEventListener('visibilitychange', () => this.handleFocusChange());

    //Event Listener para o clique fora da janela do navegador (opcional, use blur/focus)
    window.addEventListener('blur', () => this.handleBlur());
    window.addEventListener('focus', () => this.handleFocus());
  } 

handleFocusChange() {
    if (this.settingsOnlyMode) return;

    if (document.hidden) {
        if (!this.isPaused) {
            this.togglePause();
        }
    } else {
        if (this.isPaused) {
            this.togglePause();
        }
    }
}

handleBlur() {
    if (this.settingsOnlyMode) return;

    if (!this.isPaused) {
        this.togglePause();
    }
}

handleFocus() {
    if (this.settingsOnlyMode) return;

    if (this.isPaused) {
        this.togglePause();
    }
}

  async setupAudio() {
    try {
      await this.audioManager.loadSound('walk', '/sounds/walking-on-grass.mp3');
      await this.audioManager.loadSound('jumpFall', '/sounds/jump-fall.mp3');
    } catch (error) {
      console.warn('Erro ao carregar sons:', error);
    }
  }

  setupCollisions() {
    const barriers = this.gameScene.getBarriers();
    this.player.setBarriers(barriers);
  }

  setupPlayerAudio() {
    this.player.onLand = () => {
      this.audioManager.playJumpFallSound();
    };
  }

  setupSpeechIndicator() {
    this.speechRecognitionManager.onListeningStart = () => {
      if (this.speechIndicator) {
        this.speechIndicator.style.display = 'flex';
      }
    };

    this.speechRecognitionManager.onListeningStop = () => {
      if (this.speechIndicator) {
        this.speechIndicator.style.display = 'none';
      }
    };
  }

  onWindowResize() {
    this.player.onWindowResize();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  update() {
    this.player.update();
    const playerPos = this.player.getPosition();
    this.gameScene.update(playerPos);

    if (this.player.isMoving && this.player.canJump) {
      this.audioManager.playWalkSound();
    }
  }

  render() {
    this.renderer.render(
      this.gameScene.getScene(),
      this.player.getCamera()
    );
  }

  animate = () => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    
    //Lógica para somente atualizar e renderizar quando não estiver pausado
    if (!this.isPaused) { 
        this.update();
        this.render();
        this.fpsCounter.update();
    } 
  };

  dispose() {
    this.gameScene.dispose();
    this.renderer.dispose();
    this.fpsCounter.dispose();
    this.speechRecognitionManager.stop();
  }
}
