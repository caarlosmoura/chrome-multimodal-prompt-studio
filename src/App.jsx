import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  Link,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import AutoAwesomeRounded from '@mui/icons-material/AutoAwesomeRounded';
import GraphicEqRounded from '@mui/icons-material/GraphicEqRounded';
import MicRounded from '@mui/icons-material/MicRounded';
import PsychologyAltRounded from '@mui/icons-material/PsychologyAltRounded';
import StopCircleRounded from '@mui/icons-material/StopCircleRounded';
import { useTranslation } from 'react-i18next';
import { resources } from './i18n';
import packageJson from '../package.json';

function getAvailabilityOptions(tab, modelLanguage) {
  const expectedInputs = [{ type: 'text', languages: [modelLanguage] }];

  if (tab === 'audio') {
    expectedInputs.push({ type: 'audio' });
  }

  if (tab === 'image') {
    expectedInputs.push({ type: 'image' });
  }

  return {
    expectedInputs,
    expectedOutputs: [{ type: 'text', languages: [modelLanguage] }],
  };
}

const taskInstructions = {
  chat: {
    en: 'Answer the user request clearly and concisely. If useful, suggest next steps.',
    es: 'Responde la solicitud del usuario con claridad y concision. Si ayuda, sugiere los siguientes pasos.',
    ja: 'ユーザーの依頼に対して、明確かつ簡潔に回答してください。必要なら次の一手も提案してください。',
  },
  audio: {
    en: 'Transcribe the audio accurately, then extract action items, named entities, dates, and a short summary.',
    es: 'Transcribe el audio con precision y luego extrae acciones, entidades, fechas y un breve resumen.',
    ja: '音声を正確に文字起こしし、その後にアクション項目、固有名詞、日付、短い要約を抽出してください。',
  },
  image: {
    en: 'Extract all visible text from the image, list the main entities, and summarize what the image shows.',
    es: 'Extrae todo el texto visible de la imagen, enumera las entidades principales y resume lo que muestra la imagen.',
    ja: '画像内の可視テキストをすべて抽出し、主要な要素を列挙して、画像の内容を要約してください。',
  },
};

const samplePrompts = {
  chat: 'Create a concise project plan for a small internal AI pilot and list the main risks.',
  audio: 'Focus on decisions, deadlines, owners, and explicit commitments from the recording.',
  image: 'Highlight text, numbers, labels, and any structured information that could be useful.',
};

const languageDefaultsByUiLanguage = {
  'pt-BR': {
    modelLanguage: 'en',
    speechLanguage: 'pt-BR',
  },
  'en-US': {
    modelLanguage: 'en',
    speechLanguage: 'en-US',
  },
  'es-ES': {
    modelLanguage: 'es',
    speechLanguage: 'es-ES',
  },
};

const BALLOON_SURFACE_SX = {
  border: '1px solid rgba(47,34,24,0.12)',
  borderRadius: 0.5,
  background: 'linear-gradient(180deg, rgba(255,255,255,0.72), rgba(255,246,238,0.92))',
};

const HERO_BALLOON_SX = {
  ...BALLOON_SURFACE_SX,
  borderRadius: 0.5,
  boxShadow: 'none',
  overflow: 'hidden',
};

const HERO_COMPACT_CARD_SX = {
  ...HERO_BALLOON_SX,
  borderRadius: 0.5,
  py: 1.1,
  px: 1.35,
};

function toPercent(progress) {
  if (typeof progress.total === 'number' && progress.total > 0) {
    return Math.round((progress.loaded / progress.total) * 100);
  }

  return Math.round(progress.loaded * 100);
}

function getSpeechRecognition() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function getStatusTone(kind) {
  if (['ready', 'available', 'complete'].includes(kind)) {
    return 'success';
  }

  if (['unavailable', 'error', 'stopped'].includes(kind)) {
    return 'error';
  }

  return 'warning';
}

function getStatusMessage(kind, uiLanguage) {
  const messages = {
    'pt-BR': {
      checking: 'Validando o navegador e a disponibilidade do modelo.',
      ready: 'Modelo pronto para uso.',
      available: 'Modelo pronto para uso.',
      downloadable: 'O modelo precisa ser preparado localmente pelo Chrome.',
      downloading: 'O navegador esta baixando ou preparando o modelo local.',
      generating: 'Sessao ativa. Recebendo resposta em streaming.',
      complete: 'Resposta concluida.',
      unavailable: 'O modelo local nao esta disponivel neste dispositivo.',
      stopped: 'Geracao interrompida pelo usuario.',
      error: 'O ambiente atual nao esta pronto para usar a Prompt API.',
      attention: 'A API retornou um estado que exige acao do usuario.',
    },
    'en-US': {
      checking: 'Checking browser support and model availability.',
      ready: 'Model ready to use.',
      available: 'Model ready to use.',
      downloadable: 'The model still needs to be prepared locally by Chrome.',
      downloading: 'Chrome is downloading or preparing the local model.',
      generating: 'Active session. Receiving the response in streaming mode.',
      complete: 'Response completed.',
      unavailable: 'The local model is not available on this device.',
      stopped: 'Generation stopped by the user.',
      error: 'The current environment is not ready to use the Prompt API.',
      attention: 'The API returned a state that requires user action.',
    },
    'es-ES': {
      checking: 'Validando el navegador y la disponibilidad del modelo.',
      ready: 'Modelo listo para usar.',
      available: 'Modelo listo para usar.',
      downloadable: 'Chrome todavia necesita preparar el modelo localmente.',
      downloading: 'Chrome esta descargando o preparando el modelo local.',
      generating: 'Sesion activa. Recibiendo la respuesta en streaming.',
      complete: 'Respuesta finalizada.',
      unavailable: 'El modelo local no esta disponible en este dispositivo.',
      stopped: 'La generacion fue detenida por el usuario.',
      error: 'El entorno actual no esta listo para usar la Prompt API.',
      attention: 'La API devolvio un estado que requiere accion del usuario.',
    },
  };

  return messages[uiLanguage]?.[kind] || messages['en-US']?.[kind] || kind;
}

function resolveAvailabilityKind(availability) {
  if (availability === 'available') {
    return 'ready';
  }

  if (availability === 'unavailable') {
    return 'downloadable';
  }

  return availability;
}

async function readModelParams() {
  if (!('LanguageModel' in self) || typeof LanguageModel.params !== 'function') {
    return null;
  }

  try {
    return await LanguageModel.params();
  } catch {
    return null;
  }
}

function getUnavailableDiagnostics(uiLanguage) {
  const diagnostics = {
    'pt-BR': [
      'Verifique se voce esta usando Chrome ou Chrome Canary atualizados.',
      'Abra o projeto em localhost, nao em file://.',
      'Confira as flags chrome://flags/#optimization-guide-on-device-model e chrome://flags/#prompt-api-for-gemini-nano-multimodal-input.',
      'Garanta espaco livre suficiente no disco para o modelo local.',
      'Confirme se o dispositivo atende aos requisitos minimos de hardware do Chrome para IA on-device.',
      'Abra chrome://on-device-internals para inspecionar o estado do modelo no navegador.',
    ],
    'en-US': [
      'Make sure you are using an up-to-date Chrome or Chrome Canary build.',
      'Open the project on localhost, not through file://.',
      'Check chrome://flags/#optimization-guide-on-device-model and chrome://flags/#prompt-api-for-gemini-nano-multimodal-input.',
      'Ensure there is enough free disk space for the local model.',
      'Confirm the device meets Chrome on-device AI minimum hardware requirements.',
      'Open chrome://on-device-internals to inspect the browser model state.',
    ],
    'es-ES': [
      'Asegurate de usar una version actualizada de Chrome o Chrome Canary.',
      'Abre el proyecto en localhost y no con file://.',
      'Revisa chrome://flags/#optimization-guide-on-device-model y chrome://flags/#prompt-api-for-gemini-nano-multimodal-input.',
      'Confirma que hay espacio libre suficiente en disco para el modelo local.',
      'Verifica que el dispositivo cumpla los requisitos minimos de hardware para IA on-device en Chrome.',
      'Abre chrome://on-device-internals para inspeccionar el estado del modelo en el navegador.',
    ],
  };

  return diagnostics[uiLanguage] || diagnostics['en-US'];
}

function getDiagnosticsTitle(uiLanguage) {
  const titles = {
    'pt-BR': 'Diagnostico rapido',
    'en-US': 'Quick diagnostics',
    'es-ES': 'Diagnostico rapido',
  };

  return titles[uiLanguage] || titles['en-US'];
}

function getErrorMessage(key, uiLanguage) {
  const messages = {
    unsupportedBrowser: {
      'pt-BR': 'Use Google Chrome ou Chrome Canary para testar a Prompt API.',
      'en-US': 'Use Google Chrome or Chrome Canary to test the Prompt API.',
      'es-ES': 'Usa Google Chrome o Chrome Canary para probar la Prompt API.',
    },
    promptApiDisabled: {
      'pt-BR': 'A Prompt API nao esta ativa. Habilite as flags necessarias do Chrome.',
      'en-US': 'Prompt API is not enabled. Turn on the required Chrome flags.',
      'es-ES': 'La Prompt API no esta activa. Habilita las flags necesarias de Chrome.',
    },
    speechUnavailable: {
      'pt-BR': 'SpeechRecognition nao esta disponivel neste navegador.',
      'en-US': 'SpeechRecognition is not available in this browser.',
      'es-ES': 'SpeechRecognition no esta disponible en este navegador.',
    },
    dictationActive: {
      'pt-BR': 'Microfone ativo para ditado do prompt.',
      'en-US': 'Microphone active for prompt dictation.',
      'es-ES': 'Microfono activo para dictado del prompt.',
    },
    copyFailed: {
      'pt-BR': 'Nao foi possivel copiar automaticamente. Copie manualmente.',
      'en-US': 'Automatic copy failed. Please copy it manually.',
      'es-ES': 'No fue posible copiar automaticamente. Copialo manualmente.',
    },
    audioRequired: {
      'pt-BR': 'Envie ou grave um audio antes de solicitar a transcricao.',
      'en-US': 'Upload or record an audio file before requesting transcription.',
      'es-ES': 'Sube o graba un audio antes de solicitar la transcripcion.',
    },
    imageRequired: {
      'pt-BR': 'Envie uma imagem antes de solicitar a extracao.',
      'en-US': 'Upload an image before requesting extraction.',
      'es-ES': 'Sube una imagen antes de solicitar la extraccion.',
    },
    promptRequired: {
      'pt-BR': 'Digite um prompt antes de enviar.',
      'en-US': 'Type a prompt before submitting.',
      'es-ES': 'Escribe un prompt antes de enviar.',
    },
    modelUnavailable: {
      'pt-BR': 'O modelo local nao esta disponivel neste dispositivo.',
      'en-US': 'The local model is not available on this device.',
      'es-ES': 'El modelo local no esta disponible en este dispositivo.',
    },
    preparingSession: {
      'pt-BR': 'Preparando sessao...',
      'en-US': 'Preparing session...',
      'es-ES': 'Preparando sesion...',
    },
    preparingModel: {
      'pt-BR': 'Baixando ou preparando o modelo local no Chrome...',
      'en-US': 'Downloading or preparing the local model in Chrome...',
      'es-ES': 'Descargando o preparando el modelo local en Chrome...',
    },
    copied: {
      'pt-BR': 'Copiado:',
      'en-US': 'Copied:',
      'es-ES': 'Copiado:',
    },
  };

  return messages[key]?.[uiLanguage] || messages[key]?.['en-US'] || key;
}

function getDiagnosticsSections(uiLanguage) {
  const sections = {
    'pt-BR': [
      {
        title: 'Ambiente',
        items: [
          'Use Chrome ou Chrome Canary atualizados.',
          'Abra a aplicacao em localhost e nao via file://.',
        ],
      },
      {
        title: 'Flags do Chrome',
        items: [
          'Ative optimization-guide-on-device-model.',
          'Ative prompt-api-for-gemini-nano-multimodal-input.',
        ],
      },
      {
        title: 'Dispositivo',
        items: [
          'Verifique espaco livre suficiente para o modelo local.',
          'Confirme que o hardware atende aos requisitos minimos para IA on-device no Chrome.',
        ],
      },
      {
        title: 'Inspecao',
        items: [
          'Abra chrome://on-device-internals para inspecionar o estado do modelo.',
        ],
      },
    ],
    'en-US': [
      {
        title: 'Environment',
        items: [
          'Use an up-to-date Chrome or Chrome Canary build.',
          'Open the app on localhost instead of file://.',
        ],
      },
      {
        title: 'Chrome flags',
        items: [
          'Enable optimization-guide-on-device-model.',
          'Enable prompt-api-for-gemini-nano-multimodal-input.',
        ],
      },
      {
        title: 'Device',
        items: [
          'Make sure there is enough free disk space for the local model.',
          'Confirm the hardware meets Chrome minimum on-device AI requirements.',
        ],
      },
      {
        title: 'Inspection',
        items: [
          'Open chrome://on-device-internals to inspect the model state.',
        ],
      },
    ],
    'es-ES': [
      {
        title: 'Entorno',
        items: [
          'Usa una version actualizada de Chrome o Chrome Canary.',
          'Abre la aplicacion en localhost y no por file://.',
        ],
      },
      {
        title: 'Flags de Chrome',
        items: [
          'Activa optimization-guide-on-device-model.',
          'Activa prompt-api-for-gemini-nano-multimodal-input.',
        ],
      },
      {
        title: 'Dispositivo',
        items: [
          'Asegura espacio libre suficiente para el modelo local.',
          'Confirma que el hardware cumple los requisitos minimos de IA on-device en Chrome.',
        ],
      },
      {
        title: 'Inspeccion',
        items: [
          'Abre chrome://on-device-internals para revisar el estado del modelo.',
        ],
      },
    ],
  };

  return sections[uiLanguage] || sections['en-US'];
}

function buildSystemPrompt(tab, language) {
  return taskInstructions[tab][language];
}

function formatFileSize(size) {
  if (!Number.isFinite(size)) {
    return 'unknown size';
  }

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function appendFiles(currentFiles, nextFiles) {
  return [...currentFiles, ...Array.from(nextFiles ?? [])];
}

function isTextLikeFile(file) {
  return (
    file.type.startsWith('text/') ||
    ['application/json', 'application/xml', 'text/csv'].includes(file.type) ||
    /\.(txt|md|json|csv|xml|log|js|ts|jsx|tsx|html|css|yml|yaml)$/i.test(file.name)
  );
}

async function buildGenericFileContext(file) {
  const metadata = [
    `Attached file name: ${file.name}`,
    `Type: ${file.type || 'unknown'}`,
    `Size: ${formatFileSize(file.size)}`,
  ].join('\n');

  if (!isTextLikeFile(file)) {
    return `${metadata}\nThe file is not natively supported as image/audio input here, so use the metadata as context.`;
  }

  try {
    const text = await file.text();
    const excerpt = text.slice(0, 12000);
    return `${metadata}\n\nFile content excerpt:\n${excerpt}`;
  } catch {
    return `${metadata}\nThe file could not be read as text, so use only the metadata as context.`;
  }
}

export default function App() {
  const { i18n } = useTranslation();
  const sessionRef = useRef(null);
  const abortControllerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingChunksRef = useRef([]);
  const speechRecognitionRef = useRef(null);
  const genericInputRef = useRef(null);
  const outputRef = useRef(null);

  const [tab, setTab] = useState('chat');
  const [uiLanguage, setUiLanguage] = useState('en-US');
  const [modelLanguage, setModelLanguage] = useState('en');
  const [speechLanguage, setSpeechLanguage] = useState('pt-BR');
  const [temperature, setTemperature] = useState(1);
  const [topK, setTopK] = useState(3);
  const [modelLimits, setModelLimits] = useState({
    maxTemperature: 2,
    maxTopK: 128,
  });
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState(resources['en-US'].translation.responsePlaceholder);
  const [status, setStatus] = useState({ kind: 'checking', message: getStatusMessage('checking', 'en-US') });
  const [fatalError, setFatalError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDictating, setIsDictating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [audioFiles, setAudioFiles] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [isPromptDragOver, setIsPromptDragOver] = useState(false);
  const [diagnostics, setDiagnostics] = useState([]);
  const [copiedLink, setCopiedLink] = useState('');
  const [runtimeMode, setRuntimeMode] = useState('browser');
  const [cookieConsent, setCookieConsent] = useState({
    visible: true,
    analytics: false,
  });
  const effectiveTab = imageFiles.length > 0 ? 'image' : audioFiles.length > 0 ? 'audio' : tab;
  const t = resources[uiLanguage]?.translation || resources['en-US'].translation;
  const diagnosticSections = getDiagnosticsSections(uiLanguage);
  const currentYear = new Date().getFullYear();
  const appVersion = packageJson.version;

  useEffect(() => {
    let active = true;

    async function boot() {
      try {
        if (!window.chrome) {
          throw new Error('Use Google Chrome ou Chrome Canary para testar a Prompt API.');
        }

        if (!('LanguageModel' in self)) {
          throw new Error('A Prompt API nao esta ativa. Habilite as flags necessarias do Chrome.');
        }

        const recognitionCtor = getSpeechRecognition();
        setSpeechSupported(Boolean(recognitionCtor));

        const params = await readModelParams();
        if (params && active) {
          setModelLimits({
            maxTemperature: params.maxTemperature,
            maxTopK: params.maxTopK,
          });
          setTemperature(params.defaultTemperature);
          setTopK(params.defaultTopK);
        }

        const availability = await LanguageModel.availability(getAvailabilityOptions(effectiveTab, modelLanguage));
        if (!active) {
          return;
        }

        const resolvedKind = resolveAvailabilityKind(availability);
        setRuntimeMode(availability === 'available' ? 'browser' : 'download');
        setStatus({
          kind: resolvedKind,
          message: getStatusMessage(resolvedKind, uiLanguage),
        });
        setDiagnostics(availability === 'unavailable' ? getUnavailableDiagnostics(uiLanguage) : []);
      } catch (error) {
        if (!active) {
          return;
        }

        setFatalError(error.message);
        setStatus({
          kind: 'error',
          message: error.message,
        });
        setDiagnostics([]);
        setOutput(`${t.errorPrefix} ${error.message}`);
      }
    }

    boot();

    return () => {
      active = false;
      abortControllerRef.current?.abort();
      sessionRef.current?.destroy?.();
      speechRecognitionRef.current?.stop?.();
      mediaRecorderRef.current?.stop?.();
    };
  }, [effectiveTab, modelLanguage, t.errorPrefix, uiLanguage]);

  useEffect(() => {
    setPrompt(samplePrompts[effectiveTab]);
  }, [effectiveTab]);

  useEffect(() => {
    i18n.changeLanguage(uiLanguage);
    document.documentElement.lang = uiLanguage;
  }, [i18n, uiLanguage]);

  useEffect(() => {
    const defaults = languageDefaultsByUiLanguage[uiLanguage];
    if (!defaults) {
      return;
    }

    setModelLanguage(defaults.modelLanguage);
    setSpeechLanguage(defaults.speechLanguage);
  }, [uiLanguage]);

  useEffect(() => {
    if (!output || Object.values(resources).some((copy) => copy.translation.responsePlaceholder === output)) {
      setOutput(t.responsePlaceholder);
    }
  }, [t.responsePlaceholder, uiLanguage]);

  useEffect(() => {
    if (!outputRef.current) {
      return;
    }

    outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [output]);

  useEffect(() => {
    const saved = window.localStorage.getItem('cmrdev-cookie-consent');
    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved);
      setCookieConsent({
        visible: false,
        analytics: Boolean(parsed.analytics),
      });
    } catch {
      window.localStorage.removeItem('cmrdev-cookie-consent');
    }
  }, []);

  async function createAudioRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    recordingChunksRef.current = [];
    mediaRecorderRef.current = recorder;

    recorder.addEventListener('dataavailable', (event) => {
      if (event.data.size > 0) {
        recordingChunksRef.current.push(event.data);
      }
    });

    recorder.addEventListener('stop', () => {
      const blob = new Blob(recordingChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
      const file = new File([blob], `recording-${Date.now()}.webm`, {
        type: blob.type || 'audio/webm',
      });

      setAudioFiles([file]);
      setIsRecording(false);
      stream.getTracks().forEach((track) => track.stop());
    });

    recorder.start();
    setIsRecording(true);
  }

  function stopAudioRecording() {
    mediaRecorderRef.current?.stop();
  }

  function toggleDictation() {
    const recognitionCtor = getSpeechRecognition();
    if (!recognitionCtor) {
        setStatus({
          kind: 'attention',
          message: getErrorMessage('speechUnavailable', uiLanguage),
        });
      return;
    }

    if (isDictating) {
      speechRecognitionRef.current?.stop();
      return;
    }

    const recognition = new recognitionCtor();
    speechRecognitionRef.current = recognition;
    recognition.lang = speechLanguage;
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsDictating(true);
      setStatus({
        kind: 'attention',
        message: getErrorMessage('dictationActive', uiLanguage),
      });
    };

    recognition.onresult = (event) => {
      let transcript = '';
      for (const result of event.results) {
        transcript += result[0].transcript;
      }

      setPrompt(transcript.trim());
    };

    recognition.onerror = (event) => {
      setIsDictating(false);
      setStatus({
        kind: 'attention',
        message: `${t.dictationFailed} ${event.error}`,
      });
    };

    recognition.onend = () => {
      setIsDictating(false);
      setStatus((current) => {
        if (current.kind === 'attention') {
          return current;
        }

        return {
          kind: 'ready',
          message: getStatusMessage('ready', uiLanguage),
        };
      });
    };

    recognition.start();
  }

  async function buildUserContent() {
    const content = [];

    if (prompt.trim()) {
      content.push({
        type: 'text',
        value: prompt.trim(),
      });
    }

    if (effectiveTab === 'audio') {
      if (audioFiles.length === 0) {
        throw new Error(getErrorMessage('audioRequired', uiLanguage));
      }

      for (const file of audioFiles) {
        if (file.type.startsWith('audio/')) {
          content.push({
            type: 'audio',
            value: file,
          });
        } else {
          content.push({
            type: 'text',
            value: await buildGenericFileContext(file),
          });
        }
      }
    }

    if (effectiveTab === 'image') {
      if (imageFiles.length === 0) {
        throw new Error(getErrorMessage('imageRequired', uiLanguage));
      }

      for (const file of imageFiles) {
        if (file.type.startsWith('image/')) {
          content.push({
            type: 'image',
            value: file,
          });
        } else {
          content.push({
            type: 'text',
            value: await buildGenericFileContext(file),
          });
        }
      }
    }

    if (effectiveTab === 'chat' && content.length === 0) {
      throw new Error(getErrorMessage('promptRequired', uiLanguage));
    }

    return content;
  }

  async function handlePromptFiles(fileList) {
    const files = Array.from(fileList ?? []);
    if (files.length === 0) {
      return;
    }

    const imageBatch = files.filter((file) => file.type.startsWith('image/'));
    const audioBatch = files.filter((file) => file.type.startsWith('audio/'));
    const genericBatch = files.filter(
      (file) => !file.type.startsWith('image/') && !file.type.startsWith('audio/')
    );

    if (imageBatch.length > 0) {
      setImageFiles((currentFiles) => appendFiles(currentFiles, imageBatch));
      setTab('image');
    }

    if (audioBatch.length > 0) {
      setAudioFiles((currentFiles) => appendFiles(currentFiles, audioBatch));
      setTab('audio');
    }

    const appendPromptContext = (value) => {
      setPrompt((currentPrompt) => {
        const trimmedPrompt = currentPrompt.trim();
        if (!trimmedPrompt) {
          return value;
        }

        return `${trimmedPrompt}\n\n---\n\n${value}`;
      });
    };

    for (const file of genericBatch) {
      if (isTextLikeFile(file)) {
        try {
          const text = await file.text();
          appendPromptContext(text.slice(0, 12000));
          continue;
        } catch {
          appendPromptContext(await buildGenericFileContext(file));
          continue;
        }
      }

      appendPromptContext(await buildGenericFileContext(file));
    }
  }

  async function handlePromptDrop(event) {
    event.preventDefault();
    setIsPromptDragOver(false);

    await handlePromptFiles(event.dataTransfer.files);
  }

  function renderGenericDropZone() {
    const activeFiles = effectiveTab === 'image' ? imageFiles : effectiveTab === 'audio' ? audioFiles : [...imageFiles, ...audioFiles];

    return (
      <Box
        role="button"
        tabIndex={0}
        aria-label={t.dropFile}
        onClick={() => genericInputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            genericInputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsPromptDragOver(true);
        }}
        onDragLeave={() => setIsPromptDragOver(false)}
        onDrop={handlePromptDrop}
        sx={{
          p: 2,
          borderRadius: 1,
          border: '2px dashed',
          borderColor: isPromptDragOver ? 'secondary.main' : 'divider',
          backgroundColor: isPromptDragOver ? 'rgba(33,92,115,0.08)' : 'rgba(255,255,255,0.48)',
          cursor: 'pointer',
          transition: 'all 160ms ease',
          '&:focus-visible': {
            outline: 'none',
            borderColor: 'primary.main',
            boxShadow: '0 0 0 3px rgba(143,61,31,0.14)',
          },
        }}
      >
        <Stack spacing={0.75}>
          <Typography fontWeight={700}>{t.uploadFile}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t.dropFile}
          </Typography>
          {activeFiles.length > 0 && (
            <Typography variant="body2" color="secondary.main" sx={{ fontWeight: 700 }}>
              {t.selectedFile}: {activeFiles.length} files
            </Typography>
          )}
        </Stack>
        <input
          ref={genericInputRef}
          hidden
          type="file"
          multiple
          accept="*"
          onChange={async (event) => {
            await handlePromptFiles(event.target.files);
            event.target.value = '';
          }}
        />
      </Box>
    );
  }

  async function copyText(value) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedLink(value);
      window.setTimeout(() => setCopiedLink(''), 1600);
    } catch {
      setStatus({
        kind: 'attention',
        message: getErrorMessage('copyFailed', uiLanguage),
      });
    }
  }

  function persistCookieConsent(analytics) {
    window.localStorage.setItem(
      'cmrdev-cookie-consent',
      JSON.stringify({
        analytics,
        acceptedAt: new Date().toISOString(),
      })
    );

    setCookieConsent({
      visible: false,
      analytics,
    });
  }

  function clearPromptInputs() {
    setPrompt('');
    setTab('chat');
    setAudioFiles([]);
    setImageFiles([]);
    setIsPromptDragOver(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isGenerating) {
      abortControllerRef.current?.abort();
      setIsGenerating(false);
      setStatus({
        kind: 'stopped',
        message: getStatusMessage('stopped', uiLanguage),
      });
      return;
    }

    try {
      const availability = await LanguageModel.availability(getAvailabilityOptions(effectiveTab, modelLanguage));
      const resolvedKind = resolveAvailabilityKind(availability);
      const sessionOptions = getAvailabilityOptions(effectiveTab, modelLanguage);

      setStatus({
        kind: resolvedKind,
        message: getStatusMessage(resolvedKind, uiLanguage),
      });
      setDiagnostics(availability === 'unavailable' ? getUnavailableDiagnostics(uiLanguage) : []);

      setIsGenerating(true);
      setOutput(getErrorMessage('preparingSession', uiLanguage));

      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      sessionRef.current?.destroy?.();

      const userContent = await buildUserContent();

      setRuntimeMode(availability === 'available' ? 'browser' : 'download');

      sessionRef.current = await LanguageModel.create({
        expectedInputs: sessionOptions.expectedInputs,
        expectedOutputs: sessionOptions.expectedOutputs,
        temperature,
        topK,
        initialPrompts: [
          {
            role: 'system',
            content: [
              {
                type: 'text',
                value: buildSystemPrompt(effectiveTab, modelLanguage),
              },
            ],
          },
        ],
        monitor(monitor) {
          monitor.addEventListener('downloadprogress', (progress) => {
            const percent = toPercent(progress);
            setStatus({
              kind: 'downloading',
              message: `Preparando modelo local: ${percent}%`,
            });
            setOutput(getErrorMessage('preparingModel', uiLanguage));
          });
        },
      });

      setRuntimeMode('browser');

      const params = await readModelParams();
      if (params) {
        setModelLimits({
          maxTemperature: params.maxTemperature,
          maxTopK: params.maxTopK,
        });
      }

      const stream = await sessionRef.current.promptStreaming(
        [
          {
            role: 'user',
            content: userContent,
          },
        ],
        {
          signal: abortControllerRef.current.signal,
        }
      );

      setStatus({
        kind: 'generating',
        message: getStatusMessage('generating', uiLanguage),
      });
      setOutput('');

      let fullText = '';
      for await (const chunk of stream) {
        if (abortControllerRef.current.signal.aborted) {
          break;
        }

        fullText += chunk;
        setOutput(fullText);
      }

      if (!abortControllerRef.current.signal.aborted) {
        setStatus({
          kind: 'complete',
          message: getStatusMessage('complete', uiLanguage),
        });
      }
    } catch (error) {
      setOutput(`${t.errorPrefix} ${error.message}`);
      setStatus({
        kind: 'attention',
        message: error.message,
      });
      if (String(error.message).includes(getErrorMessage('modelUnavailable', uiLanguage))) {
        setDiagnostics(getUnavailableDiagnostics(uiLanguage));
      }
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(143,61,31,0.16), transparent 28%), radial-gradient(circle at bottom right, rgba(33,92,115,0.18), transparent 28%), linear-gradient(180deg, #f5eee5 0%, #ede0d0 100%)',
        py: { xs: 2.5, md: 4 },
      }}
    >
      <Container maxWidth="xl" sx={{ pb: cookieConsent.visible ? { xs: 14, md: 10 } : 0 }}>
        <Stack spacing={2}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.25, md: 3 },
              border: '1px solid rgba(47,34,24,0.08)',
              background: 'linear-gradient(135deg, rgba(255,250,246,0.96), rgba(255,243,236,0.9))',
              boxShadow: '0 14px 34px rgba(76, 48, 24, 0.08)',
              overflow: 'hidden',
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid size={{ xs: 12, lg: 7.5 }}>
                <Stack spacing={1.6}>
                  <Chip
                    icon={<PsychologyAltRounded />}
                    label={t.heroTag}
                    color="secondary"
                    variant="outlined"
                    sx={{ alignSelf: 'flex-start' }}
                  />
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: '2rem', md: '3rem' },
                      letterSpacing: '-0.05em',
                      lineHeight: 0.96,
                    }}
                  >
                    {t.heroTitle}
                  </Typography>
                  <Typography sx={{ maxWidth: 700, color: 'text.secondary', fontSize: { xs: '0.95rem', md: '1rem' }, lineHeight: 1.7 }}>
                    {t.heroBody}
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
                    <Button variant="contained" color="primary" onClick={() => setTab('chat')}>
                      Explore demo
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={() => setTab('audio')}>
                      Multimodal workflow
                    </Button>
                  </Stack>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, lg: 4.5 }}>
                <Stack spacing={1.25}>
                  <Paper
                    variant="outlined"
                    sx={{
                      ...HERO_COMPACT_CARD_SX,
                    }}
                  >
                    <Stack spacing={0.75}>
                      <Typography variant="overline" color="primary">
                        {t.runtimeMode}
                      </Typography>
                      <Typography sx={{ fontWeight: 700, lineHeight: 1.3, fontSize: '0.95rem' }}>
                        {runtimeMode === 'browser' ? t.browserMode : t.runtimeUnavailable}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                        {runtimeMode === 'browser' ? t.remoteConfigured : t.browserUnavailableCta}
                      </Typography>
                    </Stack>
                  </Paper>

                  <Grid container spacing={1.25}>
                    {t.portfolioHighlights.map((item) => (
                      <Grid key={item.label} size={{ xs: 12 }}>
                        <Paper
                          variant="outlined"
                          sx={{
                            ...HERO_COMPACT_CARD_SX,
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="center">
                            <Typography variant="overline" color="primary">
                              {item.label}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 700,
                                lineHeight: 1.35,
                                fontSize: '0.82rem',
                                textAlign: 'right',
                              }}
                            >
                              {item.value}
                            </Typography>
                          </Stack>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          <Alert
            severity={getStatusTone(status.kind)}
            variant="filled"
            sx={{
              borderRadius: 1,
              boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
              '& .MuiAlert-message': {
                fontWeight: 600,
              },
            }}
          >
            <strong>{status.kind.toUpperCase()}</strong>
            {' - '}
            {status.message}
          </Alert>

          {diagnostics.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                border: '1px solid rgba(47,34,24,0.08)',
                background: 'rgba(255, 250, 246, 0.92)',
                boxShadow: '0 12px 26px rgba(76, 48, 24, 0.06)',
              }}
            >
              <Stack spacing={2}>
                <Typography variant="overline" color="primary">
                  {getDiagnosticsTitle(uiLanguage)}
                </Typography>
                <Grid container spacing={1.5}>
                  {diagnosticSections.map((section) => (
                    <Grid key={section.title} size={{ xs: 12, md: 6, xl: 3 }}>
                      <Card
                        variant="outlined"
                        sx={{
                          height: '100%',
                          ...BALLOON_SURFACE_SX,
                        }}
                      >
                        <CardContent sx={{ p: 2, pb: '16px !important' }}>
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                            {section.title}
                          </Typography>
                          <Stack spacing={0.75}>
                            {section.items.map((item) => (
                              <Typography key={item} variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                {'- '}
                                {item}
                              </Typography>
                            ))}
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                <Stack
                  direction={{ xs: 'column', lg: 'row' }}
                  spacing={1}
                  alignItems={{ xs: 'stretch', lg: 'center' }}
                  useFlexGap
                  sx={{ flexWrap: 'wrap' }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => copyText('chrome://flags/#optimization-guide-on-device-model')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    chrome://flags/#optimization-guide-on-device-model
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => copyText('chrome://flags/#prompt-api-for-gemini-nano-multimodal-input')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    chrome://flags/#prompt-api-for-gemini-nano-multimodal-input
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => copyText('chrome://on-device-internals')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    chrome://on-device-internals
                  </Button>
                </Stack>
                {copiedLink && (
                  <Typography variant="body2" color="secondary.main">
                    {getErrorMessage('copied', uiLanguage)} {copiedLink}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  {diagnostics[0]}
                  {' '}
                  <Link
                    href="https://developer.chrome.com/docs/ai/prompt-api"
                    target="_blank"
                    rel="noreferrer"
                    underline="hover"
                  >
                    Prompt API docs
                  </Link>
                </Typography>
              </Stack>
            </Paper>
          )}

          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Grid container spacing={2}>
                {t.portfolioUseCases.map((item) => (
                  <Grid key={item} size={{ xs: 12, md: 4 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.6,
                        ...BALLOON_SURFACE_SX,
                        boxShadow: '0 10px 22px rgba(76, 48, 24, 0.05)',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Typography variant="body2" sx={{ fontSize: '0.92rem', color: 'text.secondary', lineHeight: 1.55 }}>
                        {item}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <Stack spacing={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.25,
                    border: '1px solid rgba(47,34,24,0.08)',
                    boxShadow: '0 14px 30px rgba(76, 48, 24, 0.06)',
                    background: 'rgba(255, 250, 244, 0.9)',
                  }}
                >
                  <Stack component="form" spacing={3} onSubmit={handleSubmit}>
                    <Box>
                      <Typography variant="overline" color="primary">
                        {t.workspace}
                      </Typography>
                      <Typography variant="h5">{t.multimodalInput}</Typography>
                    </Box>

                    <FormControl fullWidth>
                      <InputLabel id="ui-language-label">{t.interfaceLanguage}</InputLabel>
                      <Select
                        labelId="ui-language-label"
                        value={uiLanguage}
                        label={t.interfaceLanguage}
                        onChange={(event) => setUiLanguage(event.target.value)}
                        inputProps={{
                          'aria-label': t.interfaceLanguage,
                          'aria-describedby': 'ui-language-help',
                        }}
                      >
                        <MenuItem value="pt-BR">Portugues (Brasil)</MenuItem>
                        <MenuItem value="en-US">English</MenuItem>
                        <MenuItem value="es-ES">Espanol</MenuItem>
                      </Select>
                      <FormHelperText id="ui-language-help">{t.interfaceLanguageHelp}</FormHelperText>
                    </FormControl>

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Stack spacing={1}>
                          <Typography variant="body2" fontWeight={700}>
                            {t.temperature}: {temperature}
                          </Typography>
                          <Slider
                            value={temperature}
                            min={0}
                            max={modelLimits.maxTemperature}
                            step={0.1}
                            valueLabelDisplay="auto"
                            onChange={(_, value) => {
                              setTemperature(Array.isArray(value) ? value[0] : value);
                            }}
                          />
                        </Stack>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Stack spacing={1}>
                          <Typography variant="body2" fontWeight={700}>
                            {t.topK}: {topK}
                          </Typography>
                          <Slider
                            value={topK}
                            min={1}
                            max={modelLimits.maxTopK}
                            step={1}
                            valueLabelDisplay="auto"
                            onChange={(_, value) => {
                              setTopK(Array.isArray(value) ? value[0] : value);
                            }}
                          />
                        </Stack>
                      </Grid>
                    </Grid>

                    <Box
                      sx={{
                        ...BALLOON_SURFACE_SX,
                        p: 2,
                        borderRadius: 0.5,
                      }}
                    >
                      <Typography variant="overline" color="primary" sx={{ display: 'block', mb: 1 }}>
                        {t.prompt}
                      </Typography>
                      <TextField
                        multiline
                        minRows={5}
                        fullWidth
                        value={prompt}
                        onChange={(event) => setPrompt(event.target.value)}
                        placeholder={t.promptPlaceholder}
                        variant="standard"
                        InputProps={{
                          disableUnderline: true,
                        }}
                        sx={{
                          '& .MuiInputBase-root': {
                            alignItems: 'flex-start',
                          },
                          '& .MuiInputBase-input': {
                            p: 0,
                            fontSize: '1rem',
                            lineHeight: 1.6,
                          },
                        }}
                        inputProps={{
                          'aria-label': t.prompt,
                        }}
                      />
                      <Divider sx={{ my: 1.5, opacity: 0.6 }} />
                    </Box>

                    {renderGenericDropZone()}

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                      <Button
                        type="button"
                        variant={isDictating ? 'contained' : 'outlined'}
                        color="secondary"
                        startIcon={isDictating ? <StopCircleRounded /> : <MicRounded />}
                        onClick={toggleDictation}
                        disabled={!speechSupported || !!fatalError}
                      >
                        {isDictating ? t.stopDictation : t.useMicrophone}
                      </Button>

                      <Button
                        type="button"
                        variant={isRecording ? 'contained' : 'outlined'}
                        color="secondary"
                        startIcon={isRecording ? <StopCircleRounded /> : <GraphicEqRounded />}
                        onClick={isRecording ? stopAudioRecording : createAudioRecording}
                        disabled={effectiveTab !== 'audio' || !!fatalError}
                      >
                        {isRecording ? t.stopRecording : t.recordAudio}
                      </Button>
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={isGenerating ? <StopCircleRounded /> : <AutoAwesomeRounded />}
                        disabled={!!fatalError}
                        sx={{ flex: 1, py: 1.35 }}
                      >
                        {isGenerating ? t.stop : t.runTask}
                      </Button>

                      <Button
                        type="button"
                        variant="outlined"
                        color="secondary"
                        onClick={clearPromptInputs}
                      >
                        {t.clearPrompt}
                      </Button>

                      <Button
                        type="button"
                        variant="outlined"
                        color="secondary"
                        onClick={() => setOutput(t.responsePlaceholder)}
                      >
                        {t.clearOutput}
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    border: '1px solid rgba(47,34,24,0.08)',
                    backgroundColor: 'rgba(255, 249, 243, 0.82)',
                    boxShadow: '0 10px 24px rgba(76, 48, 24, 0.05)',
                  }}
                >
                  <Typography variant="overline" color="primary">
                    {t.practicalNotes}
                  </Typography>
                  <Stack spacing={1.2} sx={{ mt: 1.5 }}>
                    {t.practicalNotesItems.map((item) => (
                      <Typography key={item} variant="body2" color="text.secondary">
                        {item}
                      </Typography>
                    ))}
                  </Stack>
                </Paper>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, lg: 8 }}>
              <Stack spacing={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    border: '1px solid rgba(47,34,24,0.08)',
                    boxShadow: '0 14px 30px rgba(76, 48, 24, 0.06)',
                    background: 'rgba(255, 250, 244, 0.9)',
                  }}
                >
                  <Typography variant="overline" color="primary">
                    {t.ideas}
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    {t.ideaCards.map((idea) => (
                      <Grid key={idea} size={{ xs: 12, md: 6 }}>
                        <Card
                          variant="outlined"
                          sx={{
                            height: '100%',
                            ...BALLOON_SURFACE_SX,
                          }}
                        >
                          <CardContent>
                            <Typography variant="body2" sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
                              {idea}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    minHeight: 380,
                    border: '1px solid rgba(47,34,24,0.08)',
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,248,240,0.96))',
                    boxShadow: '0 14px 30px rgba(76, 48, 24, 0.06)',
                  }}
                >
                  <Stack spacing={1.25}>
                    <Box>
                      <Typography variant="overline" color="primary">
                        {t.output}
                      </Typography>
                      <Typography variant="h5">{t.llmResult}</Typography>
                    </Box>
                    <Divider />
                    <Typography
                      ref={outputRef}
                      component="pre"
                      sx={{
                        m: 0,
                        maxHeight: { xs: 320, md: 420 },
                        overflowY: 'auto',
                        pr: 1,
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'anywhere',
                        fontFamily: '"Segoe UI", sans-serif',
                        fontSize: '0.93rem',
                        lineHeight: 1.8,
                        color: 'text.primary',
                      }}
                    >
                      {output || t.responsePlaceholder}
                    </Typography>
                  </Stack>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    border: '1px solid rgba(47,34,24,0.08)',
                    background: 'linear-gradient(135deg, rgba(143,61,31,0.08), rgba(33,92,115,0.08))',
                  }}
                >
                  <Stack spacing={2}>
                    <Typography variant="overline" color="primary">
                      Portfolio note
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {t.portfolioNote}
                    </Typography>
                  </Stack>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    border: '1px solid rgba(47,34,24,0.08)',
                    background: 'rgba(255, 249, 243, 0.82)',
                  }}
                >
                  <Stack spacing={0.75}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {t.authorNote}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'none !important' }}>
                      {t.copyrightLabel} © {currentYear} Carlos Moura Ramos
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t.copyrightLabel} (c) {currentYear} Carlos Moura Ramos
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t.versionLabel} {appVersion}
                    </Typography>
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>

          {cookieConsent.visible && (
            <Paper
              elevation={0}
              sx={{
                position: 'fixed',
                right: { xs: 12, md: 20 },
                bottom: { xs: 12, md: 20 },
                width: { xs: 'calc(100vw - 24px)', sm: 360, md: 380 },
                maxWidth: '100%',
                p: 2.25,
                border: '1px solid rgba(47,34,24,0.08)',
                background: 'rgba(255, 250, 246, 0.96)',
                boxShadow: '0 20px 44px rgba(76, 48, 24, 0.14)',
                zIndex: 30,
                borderRadius: 0.5,
              }}
            >
              <Stack spacing={1.75}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {t.cookieTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t.cookieBody}
                  </Typography>
                </Box>

                <Stack direction="column" spacing={1.25}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Switch checked disabled inputProps={{ 'aria-label': t.cookieNecessary }} />
                    <Typography variant="body2">{t.cookieNecessary}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Switch
                      checked={cookieConsent.analytics}
                      onChange={(event) =>
                        setCookieConsent((current) => ({
                          ...current,
                          analytics: event.target.checked,
                        }))
                      }
                      inputProps={{ 'aria-label': t.cookieAnalytics }}
                    />
                    <Typography variant="body2">{t.cookieAnalytics}</Typography>
                  </Stack>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
                  <Button variant="contained" onClick={() => persistCookieConsent(true)}>
                    {t.acceptCookies}
                  </Button>
                  <Button variant="outlined" onClick={() => persistCookieConsent(cookieConsent.analytics)}>
                    {t.savePreferences}
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
