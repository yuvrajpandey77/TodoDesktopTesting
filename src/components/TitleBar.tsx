import React, { useEffect, useState, useCallback } from 'react';

declare global {
	interface Window {
		desktop?: {
			isElectron?: boolean;
			window?: {
				minimize: () => void;
				toggleMaximize: () => Promise<boolean>;
				toggleFullScreen: () => Promise<boolean>;
				close: () => void;
				getState: () => Promise<{ isMaximized: boolean; isFullScreen: boolean; isFocused: boolean }>;
				subscribeState: (cb: (s: { isMaximized: boolean; isFullScreen: boolean; isFocused: boolean }) => void) => () => void;
			};
		};
	}
}

const dragStyle: React.CSSProperties = { } as any;
(dragStyle as any)["-webkit-app-region"] = 'drag';
const noDragStyle: React.CSSProperties = { } as any;
(noDragStyle as any)["-webkit-app-region"] = 'no-drag';

export const TitleBar: React.FC = () => {
	const isElectron = !!window.desktop?.isElectron;
	if (!isElectron) return null;

	const [isFullScreen, setIsFullScreen] = useState(false);

	useEffect(() => {
		let unsubscribe: (() => void) | undefined;
		window.desktop?.window?.getState?.().then(s => {
			setIsFullScreen(s.isFullScreen);
		});
		unsubscribe = window.desktop?.window?.subscribeState?.((s) => {
			setIsFullScreen(s.isFullScreen);
		});
		return () => { unsubscribe && unsubscribe(); };
	}, []);

	const handleMin = useCallback(() => window.desktop?.window?.minimize(), []);
	const handleFull = useCallback(async () => {
		const full = await window.desktop?.window?.toggleFullScreen?.();
		if (typeof full === 'boolean') setIsFullScreen(full);
	}, []);
	const handleClose = useCallback(() => window.desktop?.window?.close(), []);

	const onTitlebarDoubleClick = useCallback(() => { window.desktop?.window?.toggleMaximize?.(); }, []);

	return (
		<div className="select-none flex items-center justify-between h-10 px-3 bg-gray-800 text-gray-200 border-b border-gray-700"
			style={dragStyle}
			onDoubleClick={onTitlebarDoubleClick}
		>
			<div className="flex items-center gap-2 text-sm opacity-80">
				<img src="/icons/icon.png" alt="App Logo" className="w-4 h-4" draggable={false} />
				<span>Sakura Todo</span>
			</div>
			<div className="flex gap-2" style={noDragStyle}>
				<button onClick={handleMin} className="w-8 h-6 grid place-items-center rounded hover:bg-gray-700" title="Minimize" aria-label="Minimize">—</button>
				<button onClick={handleFull} className="w-8 h-6 grid place-items-center rounded hover:bg-gray-700" title={isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'} aria-label="Fullscreen">⤢</button>
				<button onClick={handleClose} className="w-8 h-6 grid place-items-center rounded hover:bg-red-600" title="Close" aria-label="Close">×</button>
			</div>
		</div>
	);
};
