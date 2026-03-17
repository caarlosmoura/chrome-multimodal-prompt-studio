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
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import AutoAwesomeRounded from '@mui/icons-material/AutoAwesomeRounded';
import GraphicEqRounded from '@mui/icons-material/GraphicEqRounded';
import ImageSearchRounded from '@mui/icons-material/ImageSearchRounded';
import MicRounded from '@mui/icons-material/MicRounded';
import PsychologyAltRounded from '@mui/icons-material/PsychologyAltRounded';
import StopCircleRounded from '@mui/icons-material/StopCircleRounded';
import UploadFileRounded from '@mui/icons-material/UploadFileRounded';
import packageJson from '../package.json';

const availabilityOptions = {
  expectedInputs: [
    { type: 'text', languages: ['en', 'es', 'ja'] },
    { type: 'image' },
    { type: 'audio' },
  ],
  expectedOutputs: [{ type: 'text', languages: ['en', 'es', 'ja'] }],
};

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

const ideaCards = [
  'Resumo automatico de reunioes com lista de decisoes e proximos passos.',
  'Leitura de comprovantes, notas fiscais e cards com extracao de campos-chave.',
  'Pipeline de analise de screenshots para suporte tecnico interno.',
  'Briefing de visitas de campo a partir de fotos e notas de voz.',
  'Classificacao de chamados por imagem, audio e texto em uma unica interface.',
  'Matriz de risco operacional extraida de evidencias multimodais.',
];

const portfolioHighlights = [
  { label: 'Entradas', value: 'Texto, audio e imagem' },
  { label: 'Controle', value: 'Temperature e Top K' },
  { label: 'UX', value: 'Material UI acessivel' },
  { label: 'Execucao', value: 'LLM no navegador' },
];

const portfolioUseCases = [
  'Transcricao de reunioes com extracao de decisoes e prazos.',
  'Leitura de comprovantes, telas e documentos por imagem.',
  'Assistente multimodal para suporte interno e analise operacional.',
];

const uiCopy = {
  'pt-BR': {
    heroTag: 'Chrome Prompt API + Multimodal',
    heroTitle: 'Chrome Multimodal Prompt Studio',
    heroBody:
      'Playground em Material UI para chat, transcricao de audio, extracao de texto e dados de imagens, ditado por microfone e exploracao pratica da Prompt API do Chrome.',
    workspace: 'Workspace',
    multimodalInput: 'Entrada multimodal',
    interfaceLanguage: 'Idioma da interface',
    interfaceLanguageHelp: 'Altera os textos visiveis da interface para facilitar a navegacao.',
    modelLanguage: 'Idioma do modelo',
    modelLanguageHelp: 'Define o idioma esperado para entrada e saida textual da sessao.',
    microphoneLanguage: 'Idioma do microfone',
    microphoneLanguageHelp: 'Define o idioma usado pelo reconhecimento de voz no navegador.',
    temperature: 'Temperature',
    topK: 'Top K',
    prompt: 'Prompt',
    promptPlaceholder: 'Digite o prompt ou use o microfone para ditar.',
    chat: 'Chat',
    audio: 'Audio',
    image: 'Imagem',
    useMicrophone: 'Usar microfone',
    stopDictation: 'Parar ditado',
    recordAudio: 'Gravar audio',
    stopRecording: 'Parar gravacao',
    uploadAudio: 'Enviar audio',
    uploadImage: 'Enviar imagem',
    dropAudio: 'Arraste e solte um audio aqui ou clique para selecionar.',
    dropImage: 'Arraste e solte uma imagem aqui ou clique para selecionar.',
    selectedFile: 'Arquivo selecionado',
    runTask: 'Executar tarefa',
    stop: 'Interromper',
    clearOutput: 'Limpar output',
    practicalNotes: 'Observacoes praticas',
    output: 'Output',
    llmResult: 'Resultado da LLM',
    ideas: 'Ideias para evoluir',
    responsePlaceholder: 'A resposta vai aparecer aqui.',
    authorNote: 'Feito por Carlos Moura Ramos.',
    copyrightLabel: 'Copyright',
    cookieTitle: 'Cookies',
    cookieBody: 'Este portfolio pode usar cookies locais para preferencias de interface e futuras analytics.',
    cookieNecessary: 'Cookies essenciais',
    cookieAnalytics: 'Cookies de analytics',
    acceptCookies: 'Aceitar',
    savePreferences: 'Salvar preferencias',
    portfolioNote: 'Projeto pensado para demonstrar uso real de LLM on-device no navegador com interface multimodal, foco em acessibilidade e valor de produto.',
    versionLabel: 'Versao',
  },
  'en-US': {
    heroTag: 'Chrome Prompt API + Multimodal',
    heroTitle: 'Chrome Multimodal Prompt Studio',
    heroBody:
      'Material UI playground for chat, audio transcription, text extraction from images, microphone dictation, and hands-on exploration of Chrome Prompt API.',
    workspace: 'Workspace',
    multimodalInput: 'Multimodal input',
    interfaceLanguage: 'Interface language',
    interfaceLanguageHelp: 'Changes the visible UI text to improve navigation and readability.',
    modelLanguage: 'Model language',
    modelLanguageHelp: 'Defines the expected text input and output language for the session.',
    microphoneLanguage: 'Microphone language',
    microphoneLanguageHelp: 'Defines the language used by browser speech recognition.',
    temperature: 'Temperature',
    topK: 'Top K',
    prompt: 'Prompt',
    promptPlaceholder: 'Type a prompt or use the microphone for dictation.',
    chat: 'Chat',
    audio: 'Audio',
    image: 'Image',
    useMicrophone: 'Use microphone',
    stopDictation: 'Stop dictation',
    recordAudio: 'Record audio',
    stopRecording: 'Stop recording',
    uploadAudio: 'Upload audio',
    uploadImage: 'Upload image',
    dropAudio: 'Drag and drop an audio file here or click to select.',
    dropImage: 'Drag and drop an image file here or click to select.',
    selectedFile: 'Selected file',
    runTask: 'Run task',
    stop: 'Stop',
    clearOutput: 'Clear output',
    practicalNotes: 'Practical notes',
    output: 'Output',
    llmResult: 'LLM result',
    ideas: 'Ideas to explore',
    responsePlaceholder: 'The response will appear here.',
    authorNote: 'Made by Carlos Moura Ramos.',
    copyrightLabel: 'Copyright',
    cookieTitle: 'Cookies',
    cookieBody: 'This portfolio may use local cookies for interface preferences and future analytics.',
    cookieNecessary: 'Essential cookies',
    cookieAnalytics: 'Analytics cookies',
    acceptCookies: 'Accept',
    savePreferences: 'Save preferences',
    portfolioNote: 'Project designed to demonstrate practical on-device LLM usage in the browser with a multimodal interface, accessibility, and product-oriented thinking.',
    versionLabel: 'Version',
  },
  'es-ES': {
    heroTag: 'Chrome Prompt API + Multimodal',
    heroTitle: 'Chrome Multimodal Prompt Studio',
    heroBody:
      'Playground en Material UI para chat, transcripcion de audio, extraccion de texto desde imagenes, dictado por microfono y exploracion practica de Chrome Prompt API.',
    workspace: 'Workspace',
    multimodalInput: 'Entrada multimodal',
    interfaceLanguage: 'Idioma de la interfaz',
    interfaceLanguageHelp: 'Cambia los textos visibles de la interfaz para mejorar la navegacion.',
    modelLanguage: 'Idioma del modelo',
    modelLanguageHelp: 'Define el idioma esperado para la entrada y salida de texto de la sesion.',
    microphoneLanguage: 'Idioma del microfono',
    microphoneLanguageHelp: 'Define el idioma usado por el reconocimiento de voz del navegador.',
    temperature: 'Temperature',
    topK: 'Top K',
    prompt: 'Prompt',
    promptPlaceholder: 'Escribe un prompt o usa el microfono para dictado.',
    chat: 'Chat',
    audio: 'Audio',
    image: 'Imagen',
    useMicrophone: 'Usar microfono',
    stopDictation: 'Detener dictado',
    recordAudio: 'Grabar audio',
    stopRecording: 'Detener grabacion',
    uploadAudio: 'Subir audio',
    uploadImage: 'Subir imagen',
    dropAudio: 'Arrastra y suelta un audio aqui o haz clic para seleccionarlo.',
    dropImage: 'Arrastra y suelta una imagen aqui o haz clic para seleccionarla.',
    selectedFile: 'Archivo seleccionado',
    runTask: 'Ejecutar tarea',
    stop: 'Detener',
    clearOutput: 'Limpiar salida',
    practicalNotes: 'Notas practicas',
    output: 'Salida',
    llmResult: 'Resultado de la LLM',
    ideas: 'Ideas para evolucionar',
    responsePlaceholder: 'La respuesta aparecera aqui.',
    authorNote: 'Hecho por Carlos Moura Ramos.',
    copyrightLabel: 'Copyright',
    cookieTitle: 'Cookies',
    cookieBody: 'Este portafolio puede usar cookies locales para preferencias de interfaz y futuras analytics.',
    cookieNecessary: 'Cookies esenciales',
    cookieAnalytics: 'Cookies de analitica',
    acceptCookies: 'Aceptar',
    savePreferences: 'Guardar preferencias',
    portfolioNote: 'Proyecto pensado para demostrar uso real de LLM on-device en el navegador con interfaz multimodal, accesibilidad y enfoque de producto.',
    versionLabel: 'Version',
  },
};

function normalizeTopK(value, maxTopK) {
  return Math.min(maxTopK, Math.max(1, Number.parseInt(value, 10) || 1));
}

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

function getStatusMessage(kind) {
  const messages = {
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
  };

  return messages[kind] || 'Status desconhecido.';
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

export default function App() {
  const sessionRef = useRef(null);
  const abortControllerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingChunksRef = useRef([]);
  const speechRecognitionRef = useRef(null);
  const audioInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const [tab, setTab] = useState('chat');
  const [params, setParams] = useState(null);
  const [uiLanguage, setUiLanguage] = useState('en-US');
  const [modelLanguage, setModelLanguage] = useState('en');
  const [speechLanguage, setSpeechLanguage] = useState('pt-BR');
  const [temperature, setTemperature] = useState(1);
  const [topK, setTopK] = useState(3);
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('A resposta vai aparecer aqui.');
  const [status, setStatus] = useState({ kind: 'checking', message: getStatusMessage('checking') });
  const [fatalError, setFatalError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDictating, setIsDictating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isAudioDragOver, setIsAudioDragOver] = useState(false);
  const [isImageDragOver, setIsImageDragOver] = useState(false);
  const [diagnostics, setDiagnostics] = useState([]);
  const [copiedLink, setCopiedLink] = useState('');
  const [cookieConsent, setCookieConsent] = useState({
    visible: true,
    analytics: false,
  });
  const t = uiCopy[uiLanguage];
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

        const modelParams = await LanguageModel.params();
        if (!active) {
          return;
        }

        setParams(modelParams);
        setTemperature(modelParams.defaultTemperature);
        setTopK(normalizeTopK(modelParams.defaultTopK, modelParams.maxTopK));

        const availability = await LanguageModel.availability(availabilityOptions);
        if (!active) {
          return;
        }

        const resolvedKind = availability === 'available' ? 'ready' : availability;
        setStatus({
          kind: resolvedKind,
          message: getStatusMessage(resolvedKind),
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
        setOutput(`Erro: ${error.message}`);
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
  }, []);

  useEffect(() => {
    setPrompt(samplePrompts[tab]);
  }, [tab]);

  useEffect(() => {
    document.documentElement.lang = uiLanguage;
  }, [uiLanguage]);

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

      setAudioFile(file);
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
        message: 'SpeechRecognition nao esta disponivel neste navegador.',
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
        message: 'Microfone ativo para ditado do prompt.',
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
        message: `Falha no ditado: ${event.error}`,
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
          message: getStatusMessage('ready'),
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

    if (tab === 'audio') {
      if (!audioFile) {
        throw new Error('Envie ou grave um audio antes de solicitar a transcricao.');
      }

      content.push({
        type: 'audio',
        value: audioFile,
      });
    }

    if (tab === 'image') {
      if (!imageFile) {
        throw new Error('Envie uma imagem antes de solicitar a extracao.');
      }

      content.push({
        type: 'image',
        value: imageFile,
      });
    }

    if (tab === 'chat' && content.length === 0) {
      throw new Error('Digite um prompt antes de enviar.');
    }

    return content;
  }

  function handleDroppedFile(fileType, file) {
    if (!file) {
      return;
    }

    if (fileType === 'audio') {
      setAudioFile(file);
      return;
    }

    if (fileType === 'image') {
      setImageFile(file);
    }
  }

  function handleDrop(event, fileType) {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];
    handleDroppedFile(fileType, file);

    if (fileType === 'audio') {
      setIsAudioDragOver(false);
      return;
    }

    setIsImageDragOver(false);
  }

  function renderDropZone(fileType) {
    const isAudio = fileType === 'audio';
    const isDragOver = isAudio ? isAudioDragOver : isImageDragOver;
    const file = isAudio ? audioFile : imageFile;
    const inputRef = isAudio ? audioInputRef : imageInputRef;
    const accept = isAudio ? 'audio/*' : 'image/*';
    const helperText = isAudio ? t.dropAudio : t.dropImage;

    return (
      <Box
        role="button"
        tabIndex={0}
        aria-label={helperText}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (isAudio) {
            setIsAudioDragOver(true);
          } else {
            setIsImageDragOver(true);
          }
        }}
        onDragLeave={() => {
          if (isAudio) {
            setIsAudioDragOver(false);
          } else {
            setIsImageDragOver(false);
          }
        }}
        onDrop={(event) => handleDrop(event, fileType)}
        sx={{
          p: 2,
          borderRadius: 4,
          border: '2px dashed',
          borderColor: isDragOver ? 'secondary.main' : 'divider',
          backgroundColor: isDragOver ? 'rgba(33,92,115,0.08)' : 'rgba(255,255,255,0.48)',
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
          <Typography fontWeight={700}>{isAudio ? t.uploadAudio : t.uploadImage}</Typography>
          <Typography variant="body2" color="text.secondary">
            {helperText}
          </Typography>
          {file && (
            <Chip
              size="small"
              color="secondary"
              variant="outlined"
              sx={{ alignSelf: 'flex-start', mt: 0.5 }}
              label={`${t.selectedFile}: ${file.name}`}
            />
          )}
        </Stack>
        <input
          ref={inputRef}
          hidden
          type="file"
          accept={accept}
          onChange={(event) => handleDroppedFile(fileType, event.target.files?.[0] ?? null)}
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
        message: 'Nao foi possivel copiar automaticamente. Copie manualmente.',
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

  async function handleSubmit(event) {
    event.preventDefault();

    if (!params) {
      return;
    }

    if (isGenerating) {
      abortControllerRef.current?.abort();
      setIsGenerating(false);
      setStatus({
        kind: 'stopped',
        message: getStatusMessage('stopped'),
      });
      return;
    }

    try {
      const availability = await LanguageModel.availability(availabilityOptions);
      const resolvedKind = availability === 'available' ? 'ready' : availability;

      setStatus({
        kind: resolvedKind,
        message: getStatusMessage(resolvedKind),
      });
      setDiagnostics(availability === 'unavailable' ? getUnavailableDiagnostics(uiLanguage) : []);

      if (availability === 'unavailable') {
        throw new Error('O modelo local nao esta disponivel neste dispositivo.');
      }

      setIsGenerating(true);
      setOutput('Preparando sessao...');

      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      sessionRef.current?.destroy?.();

      const safeTopK = normalizeTopK(topK, params.maxTopK);
      setTopK(safeTopK);

      const userContent = await buildUserContent();

      sessionRef.current = await LanguageModel.create({
        expectedInputs: [
          { type: 'text', languages: [modelLanguage] },
          { type: 'audio' },
          { type: 'image' },
        ],
        expectedOutputs: [{ type: 'text', languages: [modelLanguage] }],
        temperature,
        topK: safeTopK,
        initialPrompts: [
          {
            role: 'system',
            content: [
              {
                type: 'text',
                value: buildSystemPrompt(tab, modelLanguage),
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
            setOutput('Baixando ou preparando o modelo local no Chrome...');
          });
        },
      });

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
        message: getStatusMessage('generating'),
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
          message: getStatusMessage('complete'),
        });
      }
    } catch (error) {
      setOutput(`Erro: ${error.message}`);
      setStatus({
        kind: 'attention',
        message: error.message,
      });
      if (String(error.message).includes('nao esta disponivel')) {
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
        py: { xs: 3, md: 5 },
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={2.5}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3.5 },
              border: '1px solid rgba(47,34,24,0.08)',
              background: 'linear-gradient(135deg, rgba(255,250,246,0.94), rgba(255,241,231,0.88))',
              boxShadow: '0 22px 50px rgba(76, 48, 24, 0.09)',
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid size={{ xs: 12, lg: 8 }}>
                <Stack spacing={2}>
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
                      fontSize: { xs: '1.8rem', md: '3.2rem' },
                      whiteSpace: { md: 'nowrap' },
                    }}
                  >
                    {t.heroTitle}
                  </Typography>
                  <Typography sx={{ maxWidth: 780, color: 'text.secondary', fontSize: { xs: '0.92rem', md: '1rem' }, lineHeight: 1.75 }}>
                    {t.heroBody}
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
                    <Button variant="contained" color="primary" onClick={() => setTab('chat')}>
                      Explorar demo
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={() => setTab('audio')}>
                      Ver fluxo multimodal
                    </Button>
                  </Stack>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, lg: 4 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 5,
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.72), rgba(255,245,238,0.94))',
                  }}
                >
                  <Stack spacing={1.25}>
                    <Typography variant="overline" color="primary">
                      Snapshot
                    </Typography>
                    {portfolioHighlights.map((item) => (
                      <Stack key={item.label} direction="row" justifyContent="space-between" spacing={2}>
                        <Typography variant="body2" color="text.secondary">
                          {item.label}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, textAlign: 'right' }}>
                          {item.value}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Paper>

          <Alert severity={getStatusTone(status.kind)} variant="filled">
            <strong>{status.kind.toUpperCase()}</strong>
            {' - '}
            {status.message}
          </Alert>

          {diagnostics.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 2.25,
                border: '1px solid rgba(47,34,24,0.08)',
                background: 'rgba(255, 249, 243, 0.88)',
              }}
            >
              <Stack spacing={2}>
                <Typography variant="overline" color="primary">
                  {getDiagnosticsTitle(uiLanguage)}
                </Typography>
                <Grid container spacing={1.5}>
                  {diagnosticSections.map((section) => (
                    <Grid key={section.title} size={{ xs: 12, md: 6, xl: 3 }}>
                      <Card variant="outlined" sx={{ height: '100%', backgroundColor: 'rgba(255,255,255,0.62)' }}>
                        <CardContent sx={{ pb: '16px !important' }}>
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                            {section.title}
                          </Typography>
                          <Stack spacing={0.75}>
                            {section.items.map((item) => (
                              <Typography key={item} variant="body2" color="text.secondary">
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
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25} alignItems={{ xs: 'stretch', md: 'center' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => copyText('chrome://flags/#optimization-guide-on-device-model')}
                  >
                    chrome://flags/#optimization-guide-on-device-model
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => copyText('chrome://flags/#prompt-api-for-gemini-nano-multimodal-input')}
                  >
                    chrome://flags/#prompt-api-for-gemini-nano-multimodal-input
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => copyText('chrome://on-device-internals')}
                  >
                    chrome://on-device-internals
                  </Button>
                </Stack>
                {copiedLink && (
                  <Typography variant="body2" color="secondary.main">
                    Copiado: {copiedLink}
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
                {portfolioUseCases.map((item) => (
                  <Grid key={item} size={{ xs: 12, md: 4 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        border: '1px solid rgba(47,34,24,0.08)',
                        background: 'rgba(255, 250, 245, 0.84)',
                        boxShadow: '0 14px 30px rgba(76, 48, 24, 0.05)',
                        height: '100%',
                      }}
                    >
                      <Typography variant="body2" sx={{ fontSize: '0.92rem', color: 'text.secondary' }}>
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
                    p: 2.5,
                    border: '1px solid rgba(47,34,24,0.08)',
                    boxShadow: '0 18px 40px rgba(76, 48, 24, 0.08)',
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

                    <Tabs
                      value={tab}
                      onChange={(_, value) => setTab(value)}
                      variant="fullWidth"
                      aria-label={t.multimodalInput}
                      sx={{
                        minHeight: 42,
                        '& .MuiTab-root': {
                          minHeight: 42,
                          fontSize: '0.82rem',
                          fontWeight: 700,
                        },
                      }}
                    >
                      <Tab icon={<AutoAwesomeRounded />} iconPosition="start" label={t.chat} value="chat" />
                      <Tab icon={<GraphicEqRounded />} iconPosition="start" label={t.audio} value="audio" />
                      <Tab icon={<ImageSearchRounded />} iconPosition="start" label={t.image} value="image" />
                    </Tabs>

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                          <InputLabel id="language-label">{t.modelLanguage}</InputLabel>
                          <Select
                            labelId="language-label"
                            value={modelLanguage}
                            label={t.modelLanguage}
                            onChange={(event) => setModelLanguage(event.target.value)}
                            inputProps={{
                              'aria-label': t.modelLanguage,
                              'aria-describedby': 'model-language-help',
                            }}
                          >
                            <MenuItem value="en">English</MenuItem>
                            <MenuItem value="es">Espanol</MenuItem>
                            <MenuItem value="ja">Japanese</MenuItem>
                          </Select>
                          <FormHelperText id="model-language-help">{t.modelLanguageHelp}</FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                          <InputLabel id="speech-language-label">{t.microphoneLanguage}</InputLabel>
                          <Select
                            labelId="speech-language-label"
                            value={speechLanguage}
                            label={t.microphoneLanguage}
                            onChange={(event) => setSpeechLanguage(event.target.value)}
                            inputProps={{
                              'aria-label': t.microphoneLanguage,
                              'aria-describedby': 'speech-language-help',
                            }}
                          >
                            <MenuItem value="pt-BR">pt-BR</MenuItem>
                            <MenuItem value="en-US">en-US</MenuItem>
                            <MenuItem value="es-ES">es-ES</MenuItem>
                          </Select>
                          <FormHelperText id="speech-language-help">{t.microphoneLanguageHelp}</FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.62)' }}>
                      <Stack spacing={1.5}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography fontWeight={700}>{t.temperature}</Typography>
                          <Chip size="small" label={temperature.toFixed(1)} />
                        </Stack>
                        <Slider
                          value={temperature}
                          min={0}
                          max={params?.maxTemperature ?? 2}
                          step={0.1}
                          valueLabelDisplay="auto"
                          onChange={(_, value) => setTemperature(value)}
                        />
                      </Stack>
                    </Paper>

                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.62)' }}>
                      <Stack spacing={1.5}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography fontWeight={700}>{t.topK}</Typography>
                          <Chip size="small" label={String(topK)} />
                        </Stack>
                        <TextField
                          type="number"
                          value={topK}
                          onChange={(event) => setTopK(event.target.value)}
                          inputProps={{
                            min: 1,
                            max: params?.maxTopK ?? 128,
                          }}
                        />
                      </Stack>
                    </Paper>

                    <TextField
                      label={t.prompt}
                      multiline
                      minRows={7}
                      value={prompt}
                      onChange={(event) => setPrompt(event.target.value)}
                      placeholder={t.promptPlaceholder}
                      inputProps={{
                        'aria-label': t.prompt,
                      }}
                    />

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
                        disabled={tab !== 'audio' || !!fatalError}
                      >
                        {isRecording ? t.stopRecording : t.recordAudio}
                      </Button>
                    </Stack>

                    {tab === 'audio' && (
                      <Stack spacing={1.25}>
                        {renderDropZone('audio')}
                        <Button
                          component="label"
                          variant="outlined"
                          startIcon={<UploadFileRounded />}
                        >
                          {audioFile ? `Audio: ${audioFile.name}` : t.uploadAudio}
                          <input
                            hidden
                            type="file"
                            accept="audio/*"
                            onChange={(event) => setAudioFile(event.target.files?.[0] ?? null)}
                          />
                        </Button>
                      </Stack>
                    )}

                    {tab === 'image' && (
                      <Stack spacing={1.25}>
                        {renderDropZone('image')}
                        <Button
                          component="label"
                          variant="outlined"
                          startIcon={<UploadFileRounded />}
                        >
                          {imageFile ? `Imagem: ${imageFile.name}` : t.uploadImage}
                          <input
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                          />
                        </Button>
                      </Stack>
                    )}

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={isGenerating ? <StopCircleRounded /> : <AutoAwesomeRounded />}
                        disabled={!params || !!fatalError}
                        sx={{ flex: 1, py: 1.35 }}
                      >
                        {isGenerating ? t.stop : t.runTask}
                      </Button>

                      <Button
                        type="button"
                        variant="text"
                        color="secondary"
                        onClick={() => setOutput('A resposta vai aparecer aqui.')}
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
                  }}
                >
                  <Typography variant="overline" color="primary">
                    {t.practicalNotes}
                  </Typography>
                  <Stack spacing={1.2} sx={{ mt: 1.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      O suporte oficial de idioma do texto na Prompt API pode nao incluir portugues.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      O ditado do microfone usa Web Speech API quando o navegador expoe `SpeechRecognition`.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Para audio e imagem, o modelo recebe o arquivo junto com o prompt e responde em texto.
                    </Typography>
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
                    minHeight: 380,
                    border: '1px solid rgba(47,34,24,0.08)',
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,248,240,0.96))',
                    boxShadow: '0 18px 40px rgba(76, 48, 24, 0.08)',
                  }}
                >
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="overline" color="primary">
                        {t.output}
                      </Typography>
                      <Typography variant="h5">{t.llmResult}</Typography>
                    </Box>
                    <Divider />
                    <Typography
                      component="pre"
                      sx={{
                        m: 0,
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
                    boxShadow: '0 18px 40px rgba(76, 48, 24, 0.08)',
                  }}
                >
                  <Typography variant="overline" color="primary">
                    {t.ideas}
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    {ideaCards.map((idea) => (
                      <Grid key={idea} size={{ xs: 12, md: 6 }}>
                        <Card
                          variant="outlined"
                          sx={{
                            height: '100%',
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.72), rgba(255,246,238,0.92))',
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
                    border: '1px solid rgba(47,34,24,0.08)',
                    background: 'linear-gradient(135deg, rgba(143,61,31,0.08), rgba(33,92,115,0.08))',
                  }}
                >
                  <Stack spacing={1}>
                    <Typography variant="overline" color="primary">
                      Portfolio note
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
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
                    <Typography variant="body2" color="text.secondary">
                      {t.copyrightLabel} © {currentYear} Carlos Moura Ramos
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
                position: 'sticky',
                bottom: 12,
                p: 2.5,
                border: '1px solid rgba(47,34,24,0.08)',
                background: 'rgba(255, 250, 246, 0.96)',
                boxShadow: '0 18px 40px rgba(76, 48, 24, 0.08)',
                zIndex: 20,
              }}
            >
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {t.cookieTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t.cookieBody}
                  </Typography>
                </Box>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
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
