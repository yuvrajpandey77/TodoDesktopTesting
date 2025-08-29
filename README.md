## Desktop (Electron) + Vite React TypeScript

This project is a Vite + React + TypeScript web app extended to run as a desktop app via Electron. The Electron runtime loads the Vite dev server in development and the built static files in production.

### What we added
- `electron/main.ts`: Electron main process
  - Frameless window with dark chrome (`frame: false`) and custom title bar
  - IPC handlers for window controls (minimize/maximize/fullscreen/close)
  - View menu + global shortcuts for zoom and fullscreen
  - Opens external links in the system browser
- `electron/preload.ts`: Secure bridge exposed to the renderer via `contextBridge`
  - Exposes `window.desktop.window` controls and state subscription helpers
- `src/components/TitleBar.tsx`: Custom dark title bar UI with native-like controls
  - Minimize, Fullscreen (⤢), Close
  - Titlebar double‑click toggles maximize
  - Draggable area using `-webkit-app-region`
- `electron/tsconfig.json`: Electron-specific TypeScript config (CommonJS output to `electron/dist`)
- `electron/package.json`: Marks the `electron/` subtree as CommonJS
- `electron-builder.yml`: Packaging config for `electron-builder`
- `package.json` updates:
  - `main`: `electron/dist/main.js`
  - Scripts for dev, build, packaging
  - Dev deps: `electron`, `electron-builder`, `concurrently`, `wait-on`, `@types/node`

### How it works
- Development
  - Vite runs at `http://localhost:5173`
  - TypeScript compiles Electron files into `electron/dist` (watch)
  - Electron launches after both Vite and compiled outputs are ready
  - Custom TitleBar is rendered by React; window is frameless
- Production
  - `vite build` emits static files in `dist/`
  - Electron main (`electron/dist/main.js`) loads `dist/index.html`
  - `electron-builder` packages the app per OS

### Window controls and behaviors
- Title bar (renderer):
  - Minimize — minimizes (exits fullscreen first if needed)
  - Fullscreen (⤢) — toggle fullscreen edge‑to‑edge
  - Close — closes the app
  - Double‑click title bar — toggle maximize/restore
- Keyboard shortcuts:
  - Zoom in: Ctrl/Cmd + (also Shift + =, numpad +)
  - Zoom out: Ctrl/Cmd -
  - Reset zoom: Ctrl/Cmd 0
  - Toggle fullscreen: F11 (and TitleBar button)
- Implementation:
  - App menu includes zoom roles and fullscreen
  - Global shortcuts registered to catch zoom keys regardless of focus
  - Visual zoom limits set to 1–3; default zoom factor is 1

### Project scripts
- `npm run dev` — runs Vite, compiles Electron in watch mode, launches Electron
- `npm run dev:web` — Vite dev server only
- `npm run dev:electron` — Electron watcher + launcher (waits for Vite & `electron/dist`)
- `npm run build` — builds Vite and compiles Electron once
- `npm run dist` — packages the app with `electron-builder`
- `npm run start:electron` — launch Electron from compiled output (after `build`)

### File structure (added/changed files)
```
./electron/
  main.ts             # Electron main process; frameless window, IPC, menu, shortcuts
  preload.ts          # Preload script exposing safe desktop bridge
  tsconfig.json       # TS config for Electron, outputs to electron/dist (CJS)
  package.json        # Local CJS override so Electron can require() compiled files
./src/components/TitleBar.tsx # Custom dark title bar with window controls
./electron-builder.yml         # Packaging configuration
```

### Development
1) Install dependencies
```bash
npm install
```
2) Start development (Vite + Electron):
```bash
npm run dev
```
- Vite: `http://localhost:5173`
- Electron: frameless window with custom TitleBar

Alternatively, run separately:
```bash
npm run dev:web
npm run dev:electron
```

### Build & Package
1) Build the app
```bash
npm run build
```
2) Create an installer
```bash
npm run dist
```
Outputs are in `dist/` (web assets) and installer artifacts under `dist/` (e.g., `.AppImage`, `.exe`, `.dmg` depending on platform).

### Security
- `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`
- Minimal API exposed via preload; no direct Node access in renderer
- External links opened in system browser via `setWindowOpenHandler`

### WSL2 / Linux notes
If you see missing system libraries (e.g. `libnss3.so`):
```bash
sudo apt-get update
sudo apt-get install -y \
  libnss3 libatk-bridge2.0-0t64 libgtk-3-0t64 libxss1 libasound2t64 libgbm1 \
  libdrm2 libxdamage1 libxfixes3 libxrandr2 libxcomposite1 libxcursor1 \
  libxi6 libxtst6 libcups2t64 libxkbcommon0 libcairo2 libpango-1.0-0 libpangocairo-1.0-0 \
  libxcb-dri3-0
```
- On Windows 11 with WSLg, GUI apps should display automatically
- On older setups, run an X server (e.g., VcXsrv) and export:
```bash
export DISPLAY=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2}'):0
export LIBGL_ALWAYS_INDIRECT=1
```

### Troubleshooting
- Zoom shortcuts not working:
  - Ensure app is restarted after changes
  - Try both Ctrl + and Ctrl Shift = (keyboard layouts may differ)
  - Numpad + is supported
- Fullscreen gaps on Linux/WSL:
  - Some compositors/X servers can leave margins with frameless windows. Use Maximize (double‑click title bar) or run under WSLg/native
- "Cannot find module electron/dist/main.js":
  - Use `npm run dev` so Electron TS is compiled (watch)
- ESM vs CJS error in Electron main:
  - `electron/package.json` sets `"type": "commonjs"` for the Electron subtree

### Desktop bridge API
In `preload.ts` (exposed on `window.desktop.window`):
- `minimize(): void`
- `toggleMaximize(): Promise<boolean>`
- `toggleFullScreen(): Promise<boolean>`
- `close(): void`
- `getState(): Promise<{ isMaximized: boolean; isFullScreen: boolean; isFocused: boolean }>`
- `subscribeState((state) => void): () => void`

Usage in React (see `src/components/TitleBar.tsx`).

### Publishing (GitHub Releases)
- Configure `electron-builder.yml` with your repo:
  ```yaml
  publish:
    provider: github
    owner: YOUR_GITHUB_USERNAME
    repo: YOUR_REPO_NAME
    releaseType: draft
  ```
- Local publish (creates a draft release with installers):
  ```bash
  export GH_TOKEN=your_github_personal_access_token
  npm run release
  ```
- CI auto-publish:
  - Push a tag like `v1.0.0` to GitHub. The workflow `.github/workflows/release.yml` builds on Windows/macOS/Linux and publishes assets to the tagged GitHub Release.
  - Installers appear on the release page for download.

### Sharing installers manually
- Run `npm run dist` on each OS to generate native installers in `dist/`.
- Share `.exe` (Windows), `.dmg` (macOS), `.AppImage` (Linux) directly or upload to cloud storage.
