export class Colour {
	private _r: number;
	private _g: number;
	private _b: number;
	private _a: number;

	constructor(hex: string) {
		const rgba = this.hexToRgba(hex);
		this._r = rgba.r;
		this._g = rgba.g;
		this._b = rgba.b;
		this._a = rgba.a;
	}

	private hexToRgba(hex: string): { r: number; g: number; b: number; a: number } {
		let r = 1;
		let g = 1;
		let b = 1;
		let a = 1;

		if (hex.startsWith("#")) {
			hex = hex.slice(1);
		}

		if (hex.length === 3) {
			// Can non-null assert here because we check the length of the string before accessing the characters
			r = parseInt(hex[0]! + hex[0], 16);
			g = parseInt(hex[1]! + hex[1], 16);
			b = parseInt(hex[2]! + hex[2], 16);
		} else if (hex.length === 6) {
			r = parseInt(hex.slice(0, 2), 16);
			g = parseInt(hex.slice(2, 4), 16);
			b = parseInt(hex.slice(4, 6), 16);
		} else if (hex.length === 8) {
			r = parseInt(hex.slice(0, 2), 16);
			g = parseInt(hex.slice(2, 4), 16);
			b = parseInt(hex.slice(4, 6), 16);
			a = parseInt(hex.slice(6, 8), 16) / 255;
		} else {
			throw new Error("Invalid hex color format");
		}
		return { r, g, b, a };
	}

	private toHex(r: number, g: number, b: number, a: number): string {
		const rHex = r.toString(16).padStart(2, "0");
		const gHex = g.toString(16).padStart(2, "0");
		const bHex = b.toString(16).padStart(2, "0");
		const aHex = Math.round(a * 255).toString(16).padStart(2, "0");
		return `#${rHex}${gHex}${bHex}${aHex}`;
	}

	get hex(): string {
		return this.toHex(this._r, this._g, this._b, this._a);
	}

	get rgba(): string {
		return `rgba(${this._r}, ${this._g}, ${this._b}, ${this._a})`;
	}

	lerp(target: Colour, t: number): Colour {
		const r = Math.round(this._r + (target._r - this._r) * t);
		const g = Math.round(this._g + (target._g - this._g) * t);
		const b = Math.round(this._b + (target._b - this._b) * t);
		const a = this._a + (target._a - this._a) * t;
		return new Colour(this.toHex(r, g, b, a));
	}
}
