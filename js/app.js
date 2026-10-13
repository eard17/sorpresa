/**
 * AVENTURAS DE APRENDIZAJE - LÓGICA INTERACTIVA
 * Para niños de 5 años: Ciencias Naturales (Transcripción) e Inglés (Pronunciación y Práctica)
 */

// ============================================================================
// 1. DATOS EDUCATIVOS
// ============================================================================

const SCIENCE_DATA = {
  tree: {
    id: 'tree',
    title: 'Árboles',
    badge: '🌳 Árboles',
    image: 'assets/images/tree.jpg',
    description: 'Son plantas grandes con un tronco leñoso, grueso y duro que supera los 5 metros de altura (el pino, el roble).',
    size: 'Supera los 5 metros de altura',
    stem: 'Tronco leñoso, grueso y duro',
    examples: 'El pino, el roble, el nogal',
    word: 'Árboles',
    sentence: 'Los árboles son plantas grandes con tronco leñoso.',
    full: 'Árboles: Son plantas grandes con un tronco leñoso, grueso y duro que supera los 5 metros de altura (el pino, el roble).'
  },
  bush: {
    id: 'bush',
    title: 'Arbustos',
    badge: '🌿 Arbustos',
    image: 'assets/images/bush.jpg',
    description: 'Son plantas de tamaño mediano con múltiples ramas leñosas que nacen desde la base del suelo.',
    size: 'Tamaño mediano (1 a 4 metros)',
    stem: 'Múltiples ramas leñosas desde la base del suelo',
    examples: 'El romero, la lavanda, el rosal',
    word: 'Arbustos',
    sentence: 'Los arbustos tienen ramas leñosas desde el suelo.',
    full: 'Arbustos: Son plantas de tamaño mediano con múltiples ramas leñosas que nacen desde la base del suelo.'
  },
  herbs: {
    id: 'herbs',
    title: 'Hierbas',
    badge: '🌱 Hierbas',
    image: 'assets/images/herbs.jpg',
    description: 'Son plantas pequeñas con tallos tiernos, blandos y flexibles, sin madera (la menta, el perejil, la manzanilla).',
    size: 'Pequeñas (menos de 1 metro)',
    stem: 'Tallos tiernos, blandos y flexibles sin madera',
    examples: 'La menta, el perejil, la manzanilla',
    word: 'Hierbas',
    sentence: 'Las hierbas son plantas pequeñas con tallos blandos.',
    full: 'Hierbas: Son plantas pequeñas con tallos tiernos, blandos y flexibles, sin madera (la menta, el perejil, la manzanilla).'
  },
  full: {
    id: 'full',
    title: 'Clasificación de las plantas',
    badge: '📓 Cuaderno Completo',
    image: 'assets/images/tree.jpg',
    description: 'Las plantas se clasifican principalmente según su estructura, su ciclo de vida y según su tamaño y tipo de tallo: Árboles, Arbustos y Hierbas.',
    size: 'Variado según el tipo',
    stem: 'Troncos duros, ramas medias o tallos tiernos',
    examples: 'Pinos, arbustos y flores',
    word: 'Plantas',
    sentence: 'Clasificación de las plantas según su tamaño y tallo.',
    full: 'Clasificación de las plantas: Árboles con tronco grueso, arbustos con ramas del suelo y hierbas con tallos tiernos.'
  }
};

const ENGLISH_DATA = [
  {
    id: 'study',
    word: 'study',
    phonetic: '/ ˈstʌdi /',
    spanish: 'Estudiar 📚',
    image: 'assets/images/study.jpg',
    sentence: 'I study with my book'
  },
  {
    id: 'read',
    word: 'read',
    phonetic: '/ riːd /',
    spanish: 'Leer 📖',
    image: 'assets/images/read.jpg',
    sentence: 'I read a fun story'
  },
  {
    id: 'drink',
    word: 'drink',
    phonetic: '/ drɪŋk /',
    spanish: 'Beber / Tomar agua 🥛',
    image: 'assets/images/drink.jpg',
    sentence: 'I drink fresh water'
  },
  {
    id: 'eat',
    word: 'eat',
    phonetic: '/ iːt /',
    spanish: 'Comer 🍎',
    image: 'assets/images/eat.jpg',
    sentence: 'I eat healthy food'
  },
  {
    id: 'sleep',
    word: 'sleep',
    phonetic: '/ sliːp /',
    spanish: 'Dormir 😴',
    image: 'assets/images/sleep.jpg',
    sentence: 'I sleep and have sweet dreams'
  }
];

// ============================================================================
// 2. SISTEMA DE AUDIO NATIVO Y SÍNTESIS DE VOZ
// ============================================================================

let soundEnabled = true;
let audioCtx = null;
let isAudioUnlocked = false;
window._activeUtterance = null; // Protege contra Garbage Collector prematuro en WebKit (iOS Safari)

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Desbloquear motor de audio en iOS y Android con el primer gesto táctil
function unlockAudioEngine() {
  if (isAudioUnlocked) return;
  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    // Desbloquear Web Speech en Safari iOS con locución vacía
    if ('speechSynthesis' in window) {
      const dummy = new SpeechSynthesisUtterance('');
      dummy.volume = 0;
      window.speechSynthesis.speak(dummy);
      window.speechSynthesis.getVoices();
    }
    isAudioUnlocked = true;
  } catch (e) {
    console.warn('Unlock audio note:', e);
  }
}

// Registrar en eventos globales de interacción para desbloquear audio de inmediato
['touchstart', 'touchend', 'pointerdown', 'click'].forEach(evtType => {
  window.addEventListener(evtType, unlockAudioEngine, { once: true, passive: true });
});

// Efectos de sonido sintetizados y amigables para niños
function playChime(type = 'success') {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (type === 'success') {
      // Campanitas de éxito
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.18, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.4);
      });
    } else if (type === 'click') {
      // Pop suave al tocar
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === 'wrong') {
      // Bong suave no punitivo
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.25);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    } else if (type === 'star') {
      // Sonido de estrellita brillante
      const notes = [659.25, 880, 1174.66, 1760];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0.15, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.45);
      });
    }
  } catch (e) {
    console.warn('Audio effect error:', e);
  }
}

// Síntesis de Voz (TTS) adaptada a niños (tono amable y velocidad calmada)
function speakText(text, lang = 'es-ES', onEnd = null) {
  if (!soundEnabled || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  try {
    // Si ya está hablando, detener con seguridad
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    // Pequeño timeout (35ms) para evitar el bug de iOS Safari donde cancel() cancela la nueva locución
    setTimeout(() => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        window._activeUtterance = utterance; // Referencia global contra Garbage Collector en iOS WebKit
        utterance.lang = lang;
        utterance.rate = lang.startsWith('en') ? 0.8 : 0.85; // Calma para niños de 5 años
        utterance.pitch = 1.05;

        // Búsqueda de voz óptima incluyendo voces nativas de iOS (Apple) y Android (Google)
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          const langCode = lang.slice(0, 2).toLowerCase();
          const preferredVoice = voices.find(v => {
            const vLang = v.lang.toLowerCase();
            const vName = v.name.toLowerCase();
            if (!vLang.startsWith(langCode)) return false;
            return vName.includes('natural') || vName.includes('google') || 
                   vName.includes('siri') || vName.includes('monica') || 
                   vName.includes('jorge') || vName.includes('paulina') ||
                   vName.includes('samantha') || vName.includes('helena') || 
                   vName.includes('karen') || vName.includes('zira');
          }) || voices.find(v => v.lang.toLowerCase().startsWith(langCode));

          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }
        }

        utterance.onend = () => {
          window._activeUtterance = null;
          if (onEnd) onEnd();
        };

        utterance.onerror = (err) => {
          window._activeUtterance = null;
          if (onEnd) onEnd();
        };

        window.speechSynthesis.speak(utterance);
      } catch (innerErr) {
        console.warn('speakText inner error:', innerErr);
        if (onEnd) onEnd();
      }
    }, 35);
  } catch (e) {
    console.warn('speakText error:', e);
    if (onEnd) onEnd();
  }
}

// Cargar voces anticipadamente si es necesario
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

// ============================================================================
// 3. CANVAS DE CONFETI PARA CELEBRACIONES
// ============================================================================

const confettiCanvas = document.getElementById('confetti-canvas');
const confettiCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
let confettiParticles = [];
let confettiAnimationId = null;

function resizeConfetti() {
  if (!confettiCanvas) return;
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeConfetti);
resizeConfetti();

function triggerConfetti(durationMs = 3000) {
  if (!confettiCtx) return;
  resizeConfetti();
  const colors = ['#f43f5e', '#38bdf8', '#4ade80', '#facc15', '#a855f7', '#fb923c'];
  const particleCount = 120;

  for (let i = 0; i < particleCount; i++) {
    confettiParticles.push({
      x: window.innerWidth * 0.5 + (Math.random() - 0.5) * 200,
      y: window.innerHeight * 0.4,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.8) * 16,
      size: Math.random() * 10 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRotation: (Math.random() - 0.5) * 8,
      shape: Math.random() > 0.4 ? 'rect' : 'circle',
      alpha: 1
    });
  }

  if (!confettiAnimationId) {
    renderConfettiLoop();
  }

  setTimeout(() => {
    // Las partículas se van disipando gradualmente
  }, durationMs);
}

function renderConfettiLoop() {
  if (!confettiCtx) return;
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.35; // Gravedad
    p.vx *= 0.98; // Resistencia
    p.rotation += p.vRotation;
    p.alpha -= 0.007;

    if (p.alpha <= 0 || p.y > window.innerHeight) {
      confettiParticles.splice(i, 1);
      continue;
    }

    confettiCtx.save();
    confettiCtx.globalAlpha = Math.max(0, p.alpha);
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate((p.rotation * Math.PI) / 180);
    confettiCtx.fillStyle = p.color;

    if (p.shape === 'rect') {
      confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
    } else {
      confettiCtx.beginPath();
      confettiCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      confettiCtx.fill();
    }
    confettiCtx.restore();
  }

  if (confettiParticles.length > 0) {
    confettiAnimationId = requestAnimationFrame(renderConfettiLoop);
  } else {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiAnimationId = null;
  }
}

// ============================================================================
// 4. CONTROLADOR DE VISTAS (ENRUTADOR SPA)
// ============================================================================

const viewMenu = document.getElementById('view-menu');
const viewScience = document.getElementById('view-science');
const viewEnglish = document.getElementById('view-english');

function showView(viewName, shouldPlayAudio = true) {
  if (shouldPlayAudio) {
    unlockAudioEngine();
    playChime('click');
  }
  [viewMenu, viewScience, viewEnglish].forEach(v => v.classList.remove('active-view'));

  if (viewName === 'menu') {
    viewMenu.classList.add('active-view');
    if (shouldPlayAudio) {
      speakText('¡Bienvenido! Elige Ciencias Naturales o Inglés para jugar.', 'es-ES');
    }
  } else if (viewName === 'science') {
    viewScience.classList.add('active-view');
    initScienceView();
    if (shouldPlayAudio) {
      speakText('¡Bienvenido a Ciencias Naturales! Vamos a conocer los árboles, arbustos y hierbas.', 'es-ES');
    }
  } else if (viewName === 'english') {
    viewEnglish.classList.add('active-view');
    initEnglishView();
    if (shouldPlayAudio) {
      speakText('Welcome to English! Toca las palabras para escuchar su pronunciación.', 'es-ES');
    }
  }
}

// Botones de navegación en la cabecera y tarjetas
document.getElementById('btn-home').addEventListener('click', () => showView('menu', true));
document.getElementById('brand-title').addEventListener('click', () => showView('menu', true));
document.getElementById('btn-start-science').addEventListener('click', () => showView('science', true));
document.getElementById('card-select-science').addEventListener('click', () => showView('science', true));
document.getElementById('btn-start-english').addEventListener('click', () => showView('english', true));
document.getElementById('card-select-english').addEventListener('click', () => showView('english', true));
document.getElementById('btn-back-science').addEventListener('click', () => showView('menu', true));
document.getElementById('btn-back-english').addEventListener('click', () => showView('menu', true));

// Saludo al tocar el banner de bienvenida
const welcomeBanner = document.querySelector('.welcome-banner');
if (welcomeBanner) {
  welcomeBanner.addEventListener('click', () => {
    unlockAudioEngine();
    playChime('star');
    speakText('¡Hola pequeño campeón! ¿Qué hermosa aventura vamos a explorar hoy? Toca una para empezar.', 'es-ES');
  });
}

// Toggle de Sonido
const btnSoundToggle = document.getElementById('btn-sound-toggle');
const soundIcon = document.getElementById('sound-icon');
btnSoundToggle.addEventListener('click', () => {
  unlockAudioEngine();
  soundEnabled = !soundEnabled;
  soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
  btnSoundToggle.title = soundEnabled ? 'Sonidos Activos' : 'Sonidos Silenciados';
  if (soundEnabled) {
    playChime('click');
  } else if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
});

// Pantalla Completa con soporte multiplataforma seguro para iPadOS, Android y PC
const btnFullscreen = document.getElementById('btn-fullscreen');
if (btnFullscreen) {
  const doc = document;
  const docEl = document.documentElement;

  // Detección de soporte de API fullscreen
  const isFullscreenSupported = !!(
    docEl.requestFullscreen ||
    docEl.webkitRequestFullscreen ||
    docEl.mozRequestFullScreen ||
    docEl.msRequestFullscreen
  );

  if (!isFullscreenSupported) {
    // Si no está soportado (ej. iPhone Safari), ocultar el botón sin lanzar errores
    btnFullscreen.style.display = 'none';
  } else {
    btnFullscreen.addEventListener('click', () => {
      unlockAudioEngine();
      playChime('click');

      const isFs = doc.fullscreenElement ||
                   doc.webkitFullscreenElement ||
                   doc.mozFullScreenElement ||
                   doc.msFullscreenElement;

      try {
        if (!isFs) {
          if (docEl.requestFullscreen) {
            docEl.requestFullscreen().catch(() => {});
          } else if (docEl.webkitRequestFullscreen) {
            docEl.webkitRequestFullscreen();
          } else if (docEl.mozRequestFullScreen) {
            docEl.mozRequestFullScreen();
          } else if (docEl.msRequestFullscreen) {
            docEl.msRequestFullscreen();
          }
        } else {
          if (doc.exitFullscreen) {
            doc.exitFullscreen().catch(() => {});
          } else if (doc.webkitExitFullscreen) {
            doc.webkitExitFullscreen();
          } else if (doc.mozCancelFullScreen) {
            doc.mozCancelFullScreen();
          } else if (doc.msExitFullscreen) {
            doc.msExitFullscreen();
          }
        }
      } catch (e) {
        console.warn('Fullscreen request warning:', e);
      }
    });
  }
}

// ============================================================================
// 5. MÓDULO DE CIENCIAS NATURALES (TRANSCRIPCIÓN INTERACTIVA)
// ============================================================================

let currentPlantKey = 'tree';
let currentTranscribeMode = 'word'; // 'word' | 'sentence' | 'full'
let currentTargetText = '';

const plantImage = document.getElementById('plant-image');
const plantBadgeText = document.getElementById('plant-badge-text');
const plantTitle = document.getElementById('plant-title');
const plantDescriptionText = document.getElementById('plant-description-text');
const hlSize = document.getElementById('hl-size');
const hlStem = document.getElementById('hl-stem');
const hlExamples = document.getElementById('hl-examples');
const targetTranscribeTextEl = document.getElementById('target-transcribe-text');
const childTranscribeInput = document.getElementById('child-transcribe-input');
const lettersVisualTrack = document.getElementById('letters-visual-track');
const transcribePercentBadge = document.getElementById('transcribe-percent-badge');
const transcribeStars = document.getElementById('transcribe-stars');
const transcribeSuccessBanner = document.getElementById('transcribe-success-banner');
const kidKeyboard = document.getElementById('kid-keyboard');

function initScienceView() {
  updatePlantSelection(currentPlantKey);
  renderKidKeyboard();
}

function updatePlantSelection(plantKey) {
  currentPlantKey = plantKey;
  const plant = SCIENCE_DATA[plantKey];

  // Actualizar Ficha de Información
  plantImage.src = plant.image;
  plantImage.alt = plant.title;
  plantBadgeText.textContent = plant.badge;
  plantTitle.textContent = plant.title;
  plantDescriptionText.innerHTML = `<strong>${plant.title}:</strong> ${plant.description}`;
  hlSize.textContent = `Tamaño: ${plant.size}`;
  hlStem.textContent = `Tallo: ${plant.stem}`;
  hlExamples.textContent = `Ejemplos: ${plant.examples}`;

  // Actualizar botones de pestaña
  document.querySelectorAll('.plant-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.plant === plantKey);
  });

  // Determinar texto objetivo según el modo
  updateTranscribeTarget();
}

function updateTranscribeTarget() {
  const plant = SCIENCE_DATA[currentPlantKey];
  if (currentTranscribeMode === 'word') {
    currentTargetText = plant.word;
  } else if (currentTranscribeMode === 'sentence') {
    currentTargetText = plant.sentence;
  } else {
    currentTargetText = plant.full;
  }

  targetTranscribeTextEl.textContent = currentTargetText;
  childTranscribeInput.value = '';
  transcribeSuccessBanner.classList.add('hidden');
  evaluateTranscription();
}

// Cambio de pestaña de planta
document.querySelectorAll('.plant-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    playChime('click');
    updatePlantSelection(btn.dataset.plant);
  });
});

// Cambio de modo de transcripción (Palabra, Frase, Completo)
document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    playChime('click');
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTranscribeMode = btn.dataset.transMode;
    updateTranscribeTarget();
  });
});

// Evaluación en tiempo real letra a letra de la transcripción
function evaluateTranscription() {
  const typed = childTranscribeInput.value;
  const target = currentTargetText;

  lettersVisualTrack.innerHTML = '';
  let correctCount = 0;
  let hasError = false;

  // Generar cuadritos visuales para cada letra del modelo
  for (let i = 0; i < target.length; i++) {
    const targetChar = target[i];
    const cell = document.createElement('div');
    cell.classList.add('char-cell');

    if (targetChar === ' ') {
      cell.classList.add('char-space');
      cell.textContent = ' ';
    } else {
      cell.textContent = targetChar;
    }

    if (i < typed.length) {
      const typedChar = typed[i];
      // Comparación insensible a mayúsculas/minúsculas para facilitar a niños de 5 años
      if (typedChar.toLowerCase() === targetChar.toLowerCase()) {
        cell.classList.add('correct');
        correctCount++;
      } else {
        cell.classList.add('wrong');
        hasError = true;
      }
    } else if (i === typed.length && !hasError) {
      cell.classList.add('current'); // Siguiente letra a escribir
    }

    lettersVisualTrack.appendChild(cell);
  }

  // Cálculo del porcentaje y estrellas
  const progressPercent = Math.min(100, Math.round((correctCount / target.length) * 100));
  transcribePercentBadge.textContent = `Progreso: ${progressPercent}%`;

  if (progressPercent >= 100) {
    transcribeStars.textContent = '⭐⭐⭐';
    onTranscriptionComplete();
  } else if (progressPercent >= 60) {
    transcribeStars.textContent = '⭐⭐☆';
  } else if (progressPercent >= 20) {
    transcribeStars.textContent = '⭐☆☆';
  } else {
    transcribeStars.textContent = '☆☆☆';
  }
}

function onTranscriptionComplete() {
  if (!transcribeSuccessBanner.classList.contains('hidden')) return;
  transcribeSuccessBanner.classList.remove('hidden');
  playChime('success');
  triggerConfetti(3500);
  speakText(`¡Fantástico! Transcribiste ${SCIENCE_DATA[currentPlantKey].title} de manera excelente.`, 'es-ES');
}

childTranscribeInput.addEventListener('input', () => {
  evaluateTranscription();
});

// Pista mágica: Escribe la siguiente letra correcta
document.getElementById('btn-transcribe-help').addEventListener('click', () => {
  playChime('star');
  const target = currentTargetText;
  const currentVal = childTranscribeInput.value;

  if (currentVal.length < target.length) {
    const nextChar = target[currentVal.length];
    childTranscribeInput.value += nextChar;
    evaluateTranscription();
  }
});

// Escuchar qué escribir en voz alta
document.getElementById('btn-transcribe-listen').addEventListener('click', () => {
  playChime('click');
  speakText(currentTargetText, 'es-ES');
});

// Escuchar texto de la planta en la ficha
document.getElementById('btn-speak-plant-text').addEventListener('click', () => {
  playChime('click');
  const plant = SCIENCE_DATA[currentPlantKey];
  speakText(`${plant.title}. ${plant.description}`, 'es-ES');
});

// Borrar transcripción
document.getElementById('btn-transcribe-clear').addEventListener('click', () => {
  playChime('click');
  childTranscribeInput.value = '';
  transcribeSuccessBanner.classList.add('hidden');
  evaluateTranscription();
});

// Botón de verificar / terminar
document.getElementById('btn-transcribe-check').addEventListener('click', () => {
  const typed = childTranscribeInput.value.trim().toLowerCase();
  const target = currentTargetText.trim().toLowerCase();

  if (typed === target) {
    onTranscriptionComplete();
  } else {
    playChime('wrong');
    speakText('¡Vas muy bien! Revisa las letras que faltan para completar tu cuaderno.', 'es-ES');
  }
});

// Siguiente Planta al terminar
document.getElementById('btn-next-plant').addEventListener('click', () => {
  playChime('click');
  const keys = ['tree', 'bush', 'herbs', 'full'];
  const nextIdx = (keys.indexOf(currentPlantKey) + 1) % keys.length;
  updatePlantSelection(keys[nextIdx]);
});

// Imprimir cuaderno
document.getElementById('btn-print-notebook').addEventListener('click', () => {
  window.print();
});

// Teclado amigable en pantalla para niños
function renderKidKeyboard() {
  kidKeyboard.innerHTML = '';
  // Distribución amigable dividida en filas
  const rows = [
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
    ['J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q'],
    ['R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    ['Á', 'É', 'Í', 'Ó', 'Ú', ',', '.', '(', ')'],
    ['ESPACIO', 'BORRAR ⌫']
  ];

  rows.forEach((rowKeys) => {
    const rowEl = document.createElement('div');
    rowEl.classList.add('kb-row');

    rowKeys.forEach(k => {
      const keyBtn = document.createElement('button');
      keyBtn.classList.add('kb-key');
      keyBtn.textContent = k;
      keyBtn.setAttribute('type', 'button');

      if (k === 'ESPACIO') {
        keyBtn.classList.add('kb-key-space');
      } else if (k.startsWith('BORRAR')) {
        keyBtn.classList.add('kb-key-backspace');
      }

      // Usar pointerdown con preventDefault para evitar desenfoque y saltos en tablets
      const pressAction = (e) => {
        if (e) e.preventDefault();
        unlockAudioEngine();
        if (k === 'ESPACIO') {
          handleKidKeyPress(' ');
        } else if (k.startsWith('BORRAR')) {
          handleKidKeyBackspace();
        } else {
          handleKidKeyPress(k.toLowerCase());
        }
      };

      keyBtn.addEventListener('pointerdown', pressAction);
      keyBtn.addEventListener('click', (e) => {
        e.preventDefault();
      });

      rowEl.appendChild(keyBtn);
    });

    kidKeyboard.appendChild(rowEl);
  });
}

function handleKidKeyPress(char) {
  playChime('click');
  childTranscribeInput.value += char;
  evaluateTranscription();
}

function handleKidKeyBackspace() {
  playChime('click');
  childTranscribeInput.value = childTranscribeInput.value.slice(0, -1);
  evaluateTranscription();
}

// Toggle para mostrar/ocultar teclado en pantalla
const btnToggleKeyboard = document.getElementById('btn-toggle-keyboard');
if (btnToggleKeyboard) {
  btnToggleKeyboard.addEventListener('click', () => {
    unlockAudioEngine();
    playChime('click');
    if (kidKeyboard.style.display === 'none') {
      kidKeyboard.style.display = 'flex';
      btnToggleKeyboard.textContent = 'Ocultar ⌨️';
    } else {
      kidKeyboard.style.display = 'none';
      btnToggleKeyboard.textContent = 'Mostrar ⌨️';
    }
  });
}

// Toggle entre Teclado Táctil Infantil (inputmode="none") y Teclado del Sistema (inputmode="text")
const btnToggleInputmode = document.getElementById('btn-toggle-inputmode');
let isSystemKeyboardActive = false;

if (btnToggleInputmode) {
  btnToggleInputmode.addEventListener('click', () => {
    unlockAudioEngine();
    playChime('click');
    isSystemKeyboardActive = !isSystemKeyboardActive;
    if (isSystemKeyboardActive) {
      childTranscribeInput.setAttribute('inputmode', 'text');
      btnToggleInputmode.textContent = '🖐️ Teclado Pantalla';
      btnToggleInputmode.title = 'Volver al teclado amigable en pantalla';
      childTranscribeInput.placeholder = 'Escribe con el teclado de tu dispositivo...';
      childTranscribeInput.focus();
    } else {
      childTranscribeInput.setAttribute('inputmode', 'none');
      btnToggleInputmode.textContent = '📱 Teclado Sistema';
      btnToggleInputmode.title = 'Usar el teclado nativo de tu tablet/celular';
      childTranscribeInput.placeholder = 'Toca las letras del teclado abajo o escribe aquí...';
      if (kidKeyboard.style.display === 'none') {
        kidKeyboard.style.display = 'flex';
        btnToggleKeyboard.textContent = 'Ocultar ⌨️';
      }
    }
  });
}

// ============================================================================
// 6. MÓDULO DE INGLÉS (REPASO, ALERTA Y RETO DE PRONUNCIACIÓN)
// ============================================================================

let currentWordIndex = 0;
let practiceScore = 0;
let hasViewedAllWords = false;
let isListening = false;
let speechRecognition = null;

// Elementos de la Fase 1: Repaso
const englishReviewStage = document.getElementById('english-review-stage');
const englishPracticeStage = document.getElementById('english-practice-stage');
const wordsStepIndicator = document.getElementById('words-step-indicator');
const cardStepBadge = document.getElementById('card-step-badge');
const englishWordImg = document.getElementById('english-word-img');
const cardEnglishWord = document.getElementById('card-english-word');
const cardPhoneticHint = document.getElementById('card-phonetic-hint');
const cardSpanishHint = document.getElementById('card-spanish-hint');
const wordTouchArea = document.getElementById('word-touch-area');
const btnSpeakEnglishCard = document.getElementById('btn-speak-english-card');
const btnPrevWord = document.getElementById('btn-prev-word');
const btnNextWord = document.getElementById('btn-next-word');
const btnListenAgain = document.getElementById('btn-listen-again');
const wordSelectorStrip = document.getElementById('word-selector-strip');
const englishPhasePill = document.getElementById('english-phase-pill');

// Modales
const modalPracticeConfirm = document.getElementById('modal-practice-confirm');
const btnModalReviewAgain = document.getElementById('btn-modal-review-again');
const btnModalStartPractice = document.getElementById('btn-modal-start-practice');
const modalCongratsAll = document.getElementById('modal-congrats-all');
const btnTrophyReplay = document.getElementById('btn-trophy-replay');
const btnTrophyScience = document.getElementById('btn-trophy-science');

// Elementos de la Fase 2: Práctica
const practiceWordImg = document.getElementById('practice-word-img');
const practiceTargetWord = document.getElementById('practice-target-word');
const practiceTranslation = document.getElementById('practice-translation');
const btnMicRecord = document.getElementById('btn-mic-record');
const micIconState = document.getElementById('mic-icon-state');
const micLabelState = document.getElementById('mic-label-state');
const listeningHint = document.getElementById('listening-hint');
const speechResultPreview = document.getElementById('speech-result-preview');
const practiceSuccessCard = document.getElementById('practice-success-card');
const successWordHighlight = document.getElementById('success-word-highlight');
const btnPracticeNext = document.getElementById('btn-practice-next');
const practiceCorrectionCard = document.getElementById('practice-correction-card');
const correctionWordTarget = document.getElementById('correction-word-target');
const btnHearCorrection = document.getElementById('btn-hear-correction');
const btnRetryMic = document.getElementById('btn-retry-mic');
const practiceStarsCount = document.getElementById('practice-stars-count');
const practiceDotsContainer = document.getElementById('practice-dots-container');

function initEnglishView() {
  currentWordIndex = 0;
  hasViewedAllWords = false;
  showReviewStage();
  renderWordSelectorStrip();
  renderStepIndicators();
  updateEnglishWordCard(0, true);
}

function showReviewStage() {
  englishReviewStage.classList.add('active-stage');
  englishPracticeStage.classList.remove('active-stage');
  englishPhasePill.textContent = 'Modo: Repaso y Pronunciación';
}

function showPracticeStage() {
  englishReviewStage.classList.remove('active-stage');
  englishPracticeStage.classList.add('active-stage');
  englishPhasePill.textContent = 'Modo: Reto de Pronunciación 🎤';
  currentWordIndex = 0;
  practiceScore = 0;
  updatePracticeCard(0);
}

function renderStepIndicators() {
  wordsStepIndicator.innerHTML = '';
  ENGLISH_DATA.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.classList.add('step-dot');
    if (idx === currentWordIndex) dot.classList.add('active');
    wordsStepIndicator.appendChild(dot);
  });
}

function renderWordSelectorStrip() {
  wordSelectorStrip.innerHTML = '';
  ENGLISH_DATA.forEach((item, idx) => {
    const btn = document.createElement('button');
    btn.classList.add('strip-item-btn');
    if (idx === currentWordIndex) btn.classList.add('active');

    btn.innerHTML = `
      <img src="${item.image}" alt="${item.word}" class="strip-thumb">
      <span>${item.word}</span>
    `;

    btn.addEventListener('click', () => {
      playChime('click');
      updateEnglishWordCard(idx, true);
    });

    wordSelectorStrip.appendChild(btn);
  });
}

// Actualizar tarjeta de palabra en modo Repaso
function updateEnglishWordCard(index, shouldSpeak = false) {
  currentWordIndex = index;
  const item = ENGLISH_DATA[index];

  cardStepBadge.textContent = `Palabra ${index + 1} de ${ENGLISH_DATA.length}`;
  englishWordImg.src = item.image;
  englishWordImg.alt = item.word;
  cardEnglishWord.textContent = item.word;
  cardPhoneticHint.textContent = item.phonetic;
  cardSpanishHint.textContent = `Significa: "${item.spanish}"`;

  // Actualizar indicadores visuales
  document.querySelectorAll('.step-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
    if (i < index) dot.classList.add('completed');
  });

  document.querySelectorAll('.strip-item-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });

  // Si toca actualizar y hablar
  if (shouldSpeak) {
    speakEnglishWord(item.word);
  }
}

// Pronunciar palabra en inglés con Web Speech API
function speakEnglishWord(word, onEnd = null) {
  speakText(word, 'en-US', onEnd);
}

// Tocar palabra o tarjeta para escuchar su pronunciación
wordTouchArea.addEventListener('click', () => {
  playChime('click');
  speakEnglishWord(ENGLISH_DATA[currentWordIndex].word);
});

btnSpeakEnglishCard.addEventListener('click', (e) => {
  e.stopPropagation();
  playChime('click');
  speakEnglishWord(ENGLISH_DATA[currentWordIndex].word);
});

document.getElementById('english-flashcard').addEventListener('click', () => {
  playChime('click');
  speakEnglishWord(ENGLISH_DATA[currentWordIndex].word);
});

btnListenAgain.addEventListener('click', () => {
  playChime('click');
  speakEnglishWord(ENGLISH_DATA[currentWordIndex].word);
});

// Navegación en el carrusel de repaso
btnPrevWord.addEventListener('click', () => {
  playChime('click');
  if (currentWordIndex > 0) {
    updateEnglishWordCard(currentWordIndex - 1, true);
  } else {
    updateEnglishWordCard(ENGLISH_DATA.length - 1, true);
  }
});

btnNextWord.addEventListener('click', () => {
  playChime('click');
  if (currentWordIndex < ENGLISH_DATA.length - 1) {
    updateEnglishWordCard(currentWordIndex + 1, true);
  } else {
    // Al pasar las palabras completas: Disparar alerta interactiva
    triggerPracticePromptAlert();
  }
});

// ============================================================================
// ALERTA: ¿DESEA PRACTICAR?
// "al pasar las palabras completas, una alerta de si desea practicar,
//  si dice que no, se inicia el ciclo volviendolas a repasar,
//  si dice que si, se muestra la palabra un botón para el pronuncie..."
// ============================================================================

function triggerPracticePromptAlert() {
  playChime('star');
  modalPracticeConfirm.classList.remove('hidden');
  speakText('¡Completaste todas las palabras! ¿Deseas practicar la pronunciación?', 'es-ES');
}

// Si dice NO: Vuelve a iniciar el ciclo repasándolas desde la primera
btnModalReviewAgain.addEventListener('click', () => {
  playChime('click');
  modalPracticeConfirm.classList.add('hidden');
  updateEnglishWordCard(0, true);
  speakText('¡Muy bien! Vamos a repasar las palabras una vez más.', 'es-ES');
});

// Si dice SÍ: Va al modo reto de pronunciación
btnModalStartPractice.addEventListener('click', () => {
  playChime('success');
  modalPracticeConfirm.classList.add('hidden');
  showPracticeStage();
  speakText('¡Genial! Presiona el micrófono y pronuncia la palabra en inglés.', 'es-ES');
});

// ============================================================================
// FASE 2: RETO DE PRONUNCIACIÓN (SPEECH RECOGNITION & CORRECCIÓN)
// ============================================================================

function updatePracticeCard(index) {
  currentWordIndex = index;
  const item = ENGLISH_DATA[index];

  practiceWordImg.src = item.image;
  practiceWordImg.alt = item.word;
  practiceTargetWord.textContent = item.word;
  practiceTranslation.textContent = `Significa: ${item.spanish}`;

  micLabelState.textContent = `Toca aquí y Di: "${item.word}"`;
  listeningHint.textContent = 'Presiona el botón para empezar a hablar...';
  speechResultPreview.textContent = '';

  // Ocultar resultados previos
  practiceSuccessCard.classList.add('hidden');
  practiceCorrectionCard.classList.add('hidden');
  btnMicRecord.classList.remove('listening');

  // Actualizar estrellas
  practiceStarsCount.textContent = `${practiceScore} / ${ENGLISH_DATA.length} ⭐`;

  // Indicador de progreso de práctica
  renderPracticeDots();
}

function renderPracticeDots() {
  practiceDotsContainer.innerHTML = '';
  ENGLISH_DATA.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.classList.add('step-dot');
    if (idx === currentWordIndex) dot.classList.add('active');
    if (idx < currentWordIndex) dot.classList.add('completed');
    practiceDotsContainer.appendChild(dot);
  });
}

// Inicialización de Reconocimiento de Voz compatible y robusto
function setupSpeechRecognition() {
  const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognitionClass) {
    console.warn('SpeechRecognition no está soportado en este navegador.');
    return null;
  }

  try {
    const recognition = new SpeechRecognitionClass();
    recognition.lang = 'en-US'; // Reconocimiento en inglés
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      isListening = true;
      btnMicRecord.classList.add('listening');
      micIconState.textContent = '👂';
      micLabelState.textContent = '¡Te escucho! Habla ahora...';
      listeningHint.textContent = 'Escuchando tu voz en inglés... 🎙️';
    };

    recognition.onresult = (event) => {
      isListening = false;
      btnMicRecord.classList.remove('listening');
      micIconState.textContent = '🎙️';
      micLabelState.textContent = `Toca para repetir: "${ENGLISH_DATA[currentWordIndex].word}"`;

      const recognizedWord = event.results[0][0].transcript.toLowerCase().trim();
      speechResultPreview.textContent = `Escuché: "${recognizedWord}"`;
      evaluateSpokenWord(recognizedWord);
    };

    recognition.onerror = (event) => {
      isListening = false;
      btnMicRecord.classList.remove('listening');
      micIconState.textContent = '🎙️';
      micLabelState.textContent = `Toca aquí y Di: "${ENGLISH_DATA[currentWordIndex].word}"`;
      
      if (event.error === 'not-allowed') {
        listeningHint.textContent = '⚠️ Permiso de micrófono no habilitado o requiere HTTPS en tablets. Usa el panel de ayuda docente para evaluar.';
        const details = document.querySelector('#mic-fallback-panel details');
        if (details) details.open = true;
      } else if (event.error === 'service-not-allowed') {
        listeningHint.textContent = 'Servicio de reconocimiento no disponible en este dispositivo. Usa el panel de ayuda docente.';
        const details = document.querySelector('#mic-fallback-panel details');
        if (details) details.open = true;
      } else {
        listeningHint.textContent = 'No pude escucharte bien. Toca el micrófono para intentar de nuevo.';
      }
      console.warn('Speech recognition note:', event.error);
    };

    recognition.onend = () => {
      isListening = false;
      btnMicRecord.classList.remove('listening');
    };

    return recognition;
  } catch (err) {
    console.warn('SpeechRecognition init error:', err);
    return null;
  }
}

// Botón de Micrófono
btnMicRecord.addEventListener('click', () => {
  if (isListening) return;
  unlockAudioEngine();
  playChime('click');

  if (!speechRecognition) {
    speechRecognition = setupSpeechRecognition();
  }

  if (speechRecognition) {
    try {
      speechRecognition.start();
    } catch (e) {
      console.warn('Recognition start retry:', e);
      speechRecognition = setupSpeechRecognition();
      try { 
        speechRecognition.start(); 
      } catch (err) {
        listeningHint.textContent = 'No fue posible iniciar el micrófono. Usa el panel de ayuda docente abajo para validar.';
        const details = document.querySelector('#mic-fallback-panel details');
        if (details) details.open = true;
      }
    }
  } else {
    // Si el navegador no soporta micrófono (o estamos en HTTP local en tablet)
    const isSecure = window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    if (!isSecure) {
      listeningHint.textContent = '⚠️ En tablets/móviles el micrófono requiere HTTPS. ¡Usa los botones de ayuda docente para evaluar!';
    } else {
      listeningHint.textContent = 'Micrófono no compatible en este navegador. Usa los botones de ayuda docente abajo.';
    }
    const details = document.querySelector('#mic-fallback-panel details');
    if (details) details.open = true;
  }
});

// Evaluación de la palabra pronunciada
function evaluateSpokenWord(spokenText) {
  const target = ENGLISH_DATA[currentWordIndex].word.toLowerCase();
  const cleaned = spokenText.toLowerCase().replace(/[^a-z]/g, '');

  // Criterios tolerantes para niños de 5 años aprendiendo inglés
  const isMatch = cleaned === target || 
                  cleaned.includes(target) || 
                  target.includes(cleaned) ||
                  isClosePhoneticMatch(cleaned, target);

  if (isMatch) {
    handlePronunciationSuccess();
  } else {
    handlePronunciationCorrection();
  }
}

// Comparación fonética amigable para niños pequeños
function isClosePhoneticMatch(a, b) {
  if (Math.abs(a.length - b.length) > 2) return false;
  let matches = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] === b[i]) matches++;
  }
  return matches >= 2;
}

// ============================================================================
// RESULTADO 1: VISTO BUENO ✅
// "un visto bueno ... indicando que la palabra..."
// ============================================================================

function handlePronunciationSuccess() {
  playChime('success');
  triggerConfetti(2500);

  practiceSuccessCard.classList.remove('hidden');
  practiceCorrectionCard.classList.add('hidden');
  successWordHighlight.textContent = ENGLISH_DATA[currentWordIndex].word;

  practiceScore++;
  practiceStarsCount.textContent = `${practiceScore} / ${ENGLISH_DATA.length} ⭐`;

  speakText(`Excellent! You said ${ENGLISH_DATA[currentWordIndex].word}!`, 'en-US');
}

// Siguiente palabra en práctica
btnPracticeNext.addEventListener('click', () => {
  playChime('click');
  if (currentWordIndex < ENGLISH_DATA.length - 1) {
    updatePracticeCard(currentWordIndex + 1);
  } else {
    // ¡Completó todas las 5 palabras practicadas!
    onCompleteAllPractice();
  }
});

// ============================================================================
// RESULTADO 2: CORRECCIÓN INDICANDO LA PRONUNCIACIÓN ❌
// "...o la corección indicando que la palabra se pronuncia : PALABRA."
// ============================================================================

function handlePronunciationCorrection() {
  playChime('wrong');

  const targetWord = ENGLISH_DATA[currentWordIndex].word;
  practiceSuccessCard.classList.add('hidden');
  practiceCorrectionCard.classList.remove('hidden');
  correctionWordTarget.textContent = targetWord.toUpperCase();

  // Reproducir la corrección explícita con voz en inglés:
  // "The word is pronounced: [PALABRA]"
  speakText(`The word is pronounced: ${targetWord}`, 'en-US');
}

// Botón para escuchar la corrección
btnHearCorrection.addEventListener('click', () => {
  playChime('click');
  const targetWord = ENGLISH_DATA[currentWordIndex].word;
  speakText(`The word is pronounced: ${targetWord}`, 'en-US');
});

// Botón para reintentar hablar
btnRetryMic.addEventListener('click', () => {
  playChime('click');
  practiceCorrectionCard.classList.add('hidden');
  btnMicRecord.click();
});

// ============================================================================
// HERRAMIENTAS DOCENTES / SIMULACIÓN (Garantiza pruebas sin micrófono físico)
// ============================================================================

document.getElementById('btn-sim-correct').addEventListener('click', () => {
  speechResultPreview.textContent = `Escuché (Simulado): "${ENGLISH_DATA[currentWordIndex].word}"`;
  handlePronunciationSuccess();
});

document.getElementById('btn-sim-wrong').addEventListener('click', () => {
  speechResultPreview.textContent = 'Escuché (Simulado): "otra palabra"';
  handlePronunciationCorrection();
});

// ============================================================================
// PANTALLA FINAL: TROFEO DE CAMPEÓN
// ============================================================================

function onCompleteAllPractice() {
  playChime('success');
  triggerConfetti(5000);
  modalCongratsAll.classList.remove('hidden');
  speakText('¡Felicitaciones! Has completado todas las palabras y eres un campeón de inglés.', 'es-ES');
}

btnTrophyReplay.addEventListener('click', () => {
  playChime('click');
  modalCongratsAll.classList.add('hidden');
  initEnglishView();
});

btnTrophyScience.addEventListener('click', () => {
  playChime('click');
  modalCongratsAll.classList.add('hidden');
  showView('science');
});

// ============================================================================
// INICIALIZACIÓN GLOBAL
// ============================================================================

window.addEventListener('DOMContentLoaded', () => {
  console.log('Aventuras de Aprendizaje initialized successfully!');
  // Iniciar en el menú principal sin violar la Autoplay Policy en móviles y tablets
  showView('menu', false);
});
