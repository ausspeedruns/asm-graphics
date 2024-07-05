import seamlessWidths from './letter-widths/Seamless-Regular.json';
import russoOneWidths from './letter-widths/Russo One-Regular.json';
import notoSansWidths from './letter-widths/Noto Sans-Regular.json';
import notoSansBoldWidths from './letter-widths/Noto Sans-Bold.json';

interface Widths {
	[key: number]: number;
}

const seamlessScaleFactor = 0.0007;
const russoOneScaleFactor = 0.0007;
const notoSansScaleFactor = 0.00033;

export function seamless(character: string) {
	let width = (seamlessWidths as Widths)[character.charCodeAt(0)];

	if (width === undefined) {
		width = 500;
	}

	return width * seamlessScaleFactor;
}

export function russoOne(character: string) {
	let width = (russoOneWidths as Widths)[character.charCodeAt(0)];

	if (width === undefined) {
		width = 500;
	}

	return width * russoOneScaleFactor;
}

export function notoSansRegular(character: string) {
	let width = (notoSansWidths as Widths)[character.charCodeAt(0)];

	if (width === undefined) {
		width = 500;
	}

	return width * notoSansScaleFactor;
}

export function notoSansBold(character: string) {
	let width = (notoSansBoldWidths as Widths)[character.charCodeAt(0)];

	if (width === undefined) {
		width = 500;
	}

	return width * notoSansScaleFactor;
}
