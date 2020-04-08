import aw1 from '@mmstudio/aw000001';

enum MessageType {
	webready,
	web2native,
	native2web
}

interface IMsg {
	id: string;
	type: MessageType;
	action: string; // a001
	content: unknown;
}

interface Window {
	ReactNativeWebView: {
		postMessage(data: string): void;
	};
	mmrn(data: string): void;
}

declare const window: Window;

/**
 * 向原生发送ready事件
 */
export default function ready(mm: aw1) {
	if (!window.ReactNativeWebView) {
		// console.error('Make sure you are in App');
		throw new Error('Make sure you are in App');
	} else {
		const fun = window.mmrn;
		window.mmrn = async (data: string) => {
			if (fun) {
				fun(data);
			}
			const msg = JSON.parse(data) as IMsg;
			const content = await mm.emit(msg.action, msg.content);
			window.ReactNativeWebView.postMessage(JSON.stringify({
				content,
				id: msg.id,
				type: MessageType.native2web
			}));
		};
		window.ReactNativeWebView.postMessage(JSON.stringify({
			type: MessageType.webready
		}));
	}
}
