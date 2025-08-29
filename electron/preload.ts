import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('desktop', {
	isElectron: true,
	window: {
		minimize: () => ipcRenderer.invoke('window:minimize'),
		toggleMaximize: () => ipcRenderer.invoke('window:toggle-maximize'),
		toggleFullScreen: () => ipcRenderer.invoke('window:toggle-fullscreen'),
		close: () => ipcRenderer.invoke('window:close'),
		getState: () => ipcRenderer.invoke('window:get-state') as Promise<{ isMaximized: boolean; isFullScreen: boolean; isFocused: boolean }>,
		subscribeState: (cb: (s: { isMaximized: boolean; isFullScreen: boolean; isFocused: boolean }) => void) => {
			const listener = (_: unknown, state: { isMaximized: boolean; isFullScreen: boolean; isFocused: boolean }) => cb(state);
			ipcRenderer.on('window-state', listener);
			return () => ipcRenderer.removeListener('window-state', listener);
		},
	},
});
