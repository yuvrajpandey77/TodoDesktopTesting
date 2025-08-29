import { app, BrowserWindow, shell, ipcMain, Menu, globalShortcut } from 'electron';
import path from 'node:path';

const isDev = !app.isPackaged;
let mainWindow: BrowserWindow | null = null;

// Optional: mitigate GPU issues under WSL/older drivers
app.disableHardwareAcceleration();

function zoomBy(delta: number) {
	if (!mainWindow) return;
	const wc = mainWindow.webContents;
	const current = wc.getZoomFactor();
	const next = Math.min(3, Math.max(0.5, parseFloat((current + delta).toFixed(2))));
	wc.setZoomFactor(next);
}
function resetZoom() {
	if (!mainWindow) return;
	mainWindow.webContents.setZoomFactor(1);
}

function setupAppMenu() {
	const menu = Menu.buildFromTemplate([
		{
			label: 'View',
			submenu: [
				{ label: 'Zoom In', accelerator: 'CmdOrCtrl+=', click: () => zoomBy(0.1) },
				{ label: 'Zoom In (Plus)', accelerator: 'CmdOrCtrl++', click: () => zoomBy(0.1) },
				{ label: 'Zoom In (Numpad)', accelerator: 'CmdOrCtrl+numadd', click: () => zoomBy(0.1) },
				{ label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', click: () => zoomBy(-0.1) },
				{ label: 'Reset Zoom', accelerator: 'CmdOrCtrl+0', click: () => resetZoom() },
				{ type: 'separator' },
				{ role: 'togglefullscreen' },
			],
		},
	]);
	Menu.setApplicationMenu(menu);
}

function registerGlobalShortcuts() {
	const regs: Array<[string, () => void]> = [
		['CommandOrControl+=', () => zoomBy(0.1)],
		['CommandOrControl++', () => zoomBy(0.1)],
		['CommandOrControl+numadd', () => zoomBy(0.1)],
		['CommandOrControl+-', () => zoomBy(-0.1)],
		['CommandOrControl+0', () => resetZoom()],
	];
	regs.forEach(([acc, fn]) => {
		try { globalShortcut.register(acc, fn); } catch { /* ignore */ }
	});
}

async function createWindow() {
    const getAssetPath = (...paths: string[]) => {
        if (app.isPackaged) {
            return path.join(process.resourcesPath, ...paths);
        }
        return path.join(process.cwd(), ...paths);
    };
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		show: false,
		backgroundColor: '#111827',
		frame: false,
		titleBarStyle: 'hidden',
		autoHideMenuBar: true,
		fullscreenable: true,
        icon: getAssetPath('icons', 'icon.png'),
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: true,
		},
	});

	// Ensure accelerators and shortcuts work regardless of focus/menu visibility
	setupAppMenu();
	registerGlobalShortcuts();

	// Allow visual zoom (pinch) range and establish baseline zoom factor
	mainWindow.webContents.setVisualZoomLevelLimits(1, 3).catch(() => {});
	mainWindow.webContents.setZoomFactor(1);

	// Forward window state to renderer
	const sendState = () => {
		if (!mainWindow) return;
		mainWindow.webContents.send('window-state', {
			isMaximized: mainWindow.isMaximized(),
			isFullScreen: mainWindow.isFullScreen(),
			isFocused: mainWindow.isFocused(),
		});
	};
	mainWindow.on('maximize', sendState);
	mainWindow.on('unmaximize', sendState);
	mainWindow.on('enter-full-screen', sendState);
	mainWindow.on('leave-full-screen', sendState);
	mainWindow.on('focus', sendState);
	mainWindow.on('blur', sendState);

	mainWindow.once('ready-to-show', () => {
		mainWindow?.show();
		sendState();
	});

	if (isDev) {
		await mainWindow.loadURL('http://localhost:5173');
		mainWindow.webContents.openDevTools({ mode: 'detach' });
	} else {
		await mainWindow.loadFile(path.join(process.cwd(), 'dist', 'index.html'));
	}

	mainWindow.webContents.setWindowOpenHandler(({ url }) => {
		shell.openExternal(url);
		return { action: 'deny' };
	});
}

// IPC: window controls
ipcMain.handle('window:minimize', () => {
	if (!mainWindow) return;
	if (mainWindow.isFullScreen()) mainWindow.setFullScreen(false);
	mainWindow.minimize();
});
ipcMain.handle('window:toggle-maximize', () => {
	if (!mainWindow) return false;
	if (mainWindow.isFullScreen()) mainWindow.setFullScreen(false);
	if (mainWindow.isMaximized()) mainWindow.unmaximize();
	else mainWindow.maximize();
	return mainWindow.isMaximized();
});
ipcMain.handle('window:toggle-fullscreen', () => {
	if (!mainWindow) return false;
	const next = !mainWindow.isFullScreen();
	mainWindow.setFullScreen(next);
	return mainWindow.isFullScreen();
});
ipcMain.handle('window:close', () => {
	mainWindow?.close();
});
ipcMain.handle('window:get-state', () => {
	return {
		isMaximized: mainWindow?.isMaximized() ?? false,
		isFullScreen: mainWindow?.isFullScreen() ?? false,
		isFocused: mainWindow?.isFocused() ?? false,
	};
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('will-quit', () => {
	globalShortcut.unregisterAll();
});
