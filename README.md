# Chrome Multimodal Prompt Studio

Aplicacao em React com Material UI para explorar uma LLM executada no navegador por meio da Prompt API do Chrome, com entradas multimodais de texto, audio e imagem.

Feito por Carlos Moura Ramos. Copyright © 2026 Carlos Moura Ramos.

Versao atual: `1.0.0`

## O que este projeto demonstra

Este projeto mostra como construir uma interface web que conversa com uma LLM on-device, ou seja, um modelo de linguagem executado localmente no navegador quando o Chrome expoe a Prompt API.

Na pratica, isso significa que a aplicacao:

- usa uma LLM acessivel diretamente no navegador
- combina diferentes modalidades de entrada, como texto, audio e imagem
- permite controlar parametros de geracao como `temperature` e `topK`
- processa casos de uso multimodais sem depender de uma API remota tradicional no fluxo principal

O foco aqui e demonstrar como uma web app moderna pode usar recursos nativos de IA do navegador para criar experiencias multimodais com cara de produto.

## O que e uma Web API multimodal

Uma Web API multimodal e uma interface exposta pelo navegador que permite enviar e combinar diferentes tipos de entrada na mesma interacao, como texto, audio e imagem, recebendo uma saida estruturada ou textual a partir desse conjunto de sinais.

Neste projeto, a Web API multimodal usada e a Prompt API do Chrome, configurada para trabalhar com:

- texto
- audio
- imagem

Isso permite cenarios como:

- transcrever um audio e extrair itens de acao
- analisar uma imagem e capturar o texto visivel
- combinar um prompt textual com uma imagem ou audio para orientar a resposta do modelo

## LLM no navegador

Neste projeto, a LLM nao e consumida como um endpoint HTTP externo comum. Em vez disso, a aplicacao usa a Prompt API do Chrome para acessar capacidades de IA disponibilizadas pelo proprio navegador.

Esse modelo de execucao e relevante porque:

- reduz a dependencia de chamadas diretas para um backend de inferencia em cenarios suportados
- permite experimentar IA on-device dentro da propria interface web
- ajuda a prototipar fluxos multimodais com latencia local e integracao nativa com APIs do navegador

Como a Prompt API ainda e experimental, o comportamento exato, os idiomas suportados e os formatos aceitos podem variar conforme a versao do Chrome e as flags habilitadas.

## O que o projeto faz

- Permite ajustar `temperature` e `topK`.
- Permite escolher o idioma da interface para melhorar a navegacao e a demonstracao do produto.
- Executa tarefas de chat, transcricao de audio e extracao de texto e informacoes de imagens.
- Aceita upload de arquivos de audio e imagem.
- Permite enviar arquivos de audio e imagem por drag and drop.
- Permite gravar audio do microfone para enviar como entrada multimodal.
- Usa o microfone para ditado do prompt com Web Speech API, quando o navegador expoe `SpeechRecognition`.
- Exibe o resultado em streaming e mostra o progresso de preparo do modelo local quando disponivel.
- Inclui melhorias de acessibilidade com rotulos claros, ajuda textual e atributos para leitores de tela.
- Inclui banner de cookies para preferencias locais e futuras analytics.
- Inclui uma area com ideias de evolucao do produto.

## Stack

- React
- Vite
- Material UI
- Chrome Prompt API para acesso a LLM no navegador
- Web Speech API
- MediaRecorder API

## Como executar

```bash
npm install
npm start
```

ou

```bash
npm run dev
```

Abra a URL local exibida pelo Vite no Google Chrome ou Chrome Canary.

## Build de producao

```bash
npm run build
```

Os arquivos finais serao gerados em `dist/`.

## Versionamento

O projeto usa a versao definida em `package.json`, que tambem e exibida na interface do portfolio.

Antes de publicar uma nova entrega, atualize o campo `version` em `package.json`.

## Deploy por FTP

O projeto inclui um script de deploy por FTP pensado para hospedagem tradicional.

```bash
FTP_HOST=ftp.cmrdev.lat \
FTP_USER=seu_usuario \
FTP_PASSWORD=sua_senha \
FTP_REMOTE_DIR=/ \
npm run deploy:ftp
```

Se o servidor exigir FTPS:

```bash
FTP_SECURE=true
```

## Interface e acessibilidade

- Interface desenvolvida com Material UI.
- Seletor de idioma da interface com opcoes para portugues, ingles e espanhol.
- Campos principais com `label`, `helper text` e atributos de acessibilidade para melhorar a navegacao por teclado e leitor de tela.
- Estrutura pensada para demonstracao de uma LLM multimodal em ambiente web com foco em clareza visual.
- Rodape de portfolio com autoria e copyright.

## Requisitos do navegador

- Chrome com suporte as APIs de IA on-device.
- Prompt API habilitada nas flags experimentais do Chrome.
- Permissao de microfone para usar ditado e gravacao.

Consulte a documentacao oficial para verificar o estado atual das APIs:

- https://developer.chrome.com/docs/ai/prompt-api

## Limitacoes importantes

- O suporte oficial de idiomas para texto na Prompt API pode nao incluir `pt-BR`.
- O reconhecimento de voz depende da disponibilidade de `SpeechRecognition` no navegador.
- A qualidade de OCR, transcricao e extracao depende do modelo local e das capacidades expostas pela versao atual do Chrome.
- O idioma da interface pode ser alterado livremente, mas os idiomas aceitos pelo modelo dependem das capacidades reais da Prompt API no Chrome em uso.
- O banner de cookies atual cobre preferencias locais e deixa a base pronta para futura instrumentacao de analytics.

## Ideias de evolucao

- Exportar JSON estruturado com entidades, datas, itens de acao e resumo.
- Adicionar templates por caso de uso: reuniao, recibo, contrato, print de erro, checklist de campo.
- Persistir historico local com IndexedDB.
- Integrar traducao de entrada e saida quando a Prompt API e o idioma desejado nao coincidirem.
- Criar modo de comparacao de respostas alterando `temperature` e `topK`.
