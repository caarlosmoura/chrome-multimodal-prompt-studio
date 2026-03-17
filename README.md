# Chrome Multimodal Prompt Studio

React + Material UI portfolio project that showcases a multimodal LLM running directly in the browser through the Chrome Prompt API, with text, audio, image, and generic file inputs.

Made by Carlos Moura Ramos. Copyright (c) 2026 Carlos Moura Ramos.

Current version: `1.0.0`

## What this project demonstrates

This project shows how to build a web interface that talks to an on-device LLM, meaning a language model executed locally in the browser when Chrome exposes the Prompt API.

In practice, that means the application:

- uses an LLM directly from the browser
- combines multiple input modalities such as text, audio, image, and attached files
- allows generation controls such as `temperature` and `topK`
- supports multimodal workflows without depending on a traditional remote inference API in the main flow

The goal is to demonstrate how a modern web app can use native browser AI capabilities to create product-oriented multimodal experiences.

## What is a multimodal Web API

A multimodal Web API is a browser-exposed interface that allows an application to send and combine different kinds of input in the same interaction, such as text, audio, and image, and receive a textual or structured response from that combined context.

In this project, the multimodal Web API is Chrome Prompt API, configured to work with:

- text
- audio
- image

That enables scenarios such as:

- transcribing an audio recording and extracting action items
- analyzing an image and extracting visible text
- combining a text prompt with an image or audio input to guide the model response

## LLM in the browser

This project does not use the LLM as a standard external HTTP endpoint. Instead, the application relies on Chrome Prompt API to access AI capabilities exposed by the browser itself.

This execution model matters because it:

- reduces reliance on direct backend inference calls in supported scenarios
- enables on-device AI experimentation directly inside the web UI
- helps prototype multimodal flows with local latency and native browser integration

Because Prompt API is still experimental, exact behavior, supported languages, and accepted formats may vary depending on the Chrome version and enabled flags.

## Features

- Adjustable `temperature` and `topK`
- Interface language selector for product demos and usability
- Chat, audio transcription, and image text extraction flows
- Unified file upload and drag-and-drop for text, audio, image, and generic files
- Microphone recording for multimodal audio input
- Prompt dictation through Web Speech API when `SpeechRecognition` is available
- Streaming output rendering
- Auto-scrolling output panel during streaming
- Download/preparation status feedback for the local model
- Accessibility improvements with labels, helper text, keyboard-friendly controls, and screen-reader-oriented attributes
- Cookie banner for local preferences and future analytics readiness
- Portfolio-oriented presentation with authorship, copyright, and visible versioning

## Stack

- React
- Vite
- Material UI
- react-i18next
- Chrome Prompt API for browser-based LLM access
- Web Speech API

## Run locally

```bash
npm install
npm start
```

or:

```bash
npm run dev
```

Open the local URL shown by Vite in Google Chrome or Chrome Canary.

## Production build

```bash
npm run build
```

The production files will be generated in `dist/`.

## Versioning

The project version is defined in `package.json` and is also displayed inside the portfolio UI.

Before publishing a new release, update the `version` field in `package.json`.

## FTP deployment

The project includes an FTP deployment script designed for traditional hosting environments.

```bash
FTP_HOST=ftp.cmrdev.lat \
FTP_USER=your_user \
FTP_PASSWORD=your_password \
FTP_REMOTE_DIR=/ \
npm run deploy:ftp
```

If the server requires FTPS:

```bash
FTP_SECURE=true
```

## Interface and accessibility

- Built with Material UI
- Interface language selector with Portuguese, English, and Spanish options
- Main fields include labels, helper text, and accessibility attributes for keyboard navigation and screen readers
- The persistent drag-and-drop zone can also be activated by click or keyboard
- Portfolio footer includes authorship, copyright, and version information

## Browser requirements

- Chrome or Chrome Canary with on-device AI support
- Prompt API enabled in experimental Chrome flags
- Microphone permission for dictation and recording flows

Check the official documentation for the current API state:

- https://developer.chrome.com/docs/ai/prompt-api

## Important limitations

- Official Prompt API text language support may not include `pt-BR`
- Speech recognition depends on `SpeechRecognition` availability in the browser
- OCR, transcription, and extraction quality depend on the local model and the capabilities exposed by the current Chrome version
- The UI language can be changed freely, but the actual model and dictation languages are inferred from the selected interface language and still depend on the Prompt API capabilities available in the running browser
- The current cookie banner covers local preferences and keeps the project ready for future analytics instrumentation

## Future ideas

- Export structured JSON with entities, dates, action items, and summaries
- Add templates for use cases such as meetings, receipts, contracts, error screenshots, and field checklists
- Persist local history with IndexedDB
- Add translation between input and output when Prompt API language support does not match the desired language
- Add response comparison mode using different `temperature` and `topK` values
