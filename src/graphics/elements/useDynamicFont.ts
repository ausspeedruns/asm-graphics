import { useState } from "react";

export function useDynamicFont() {
	const [loadedFonts, setLoadedFonts] = useState<string[]>([]);

	const loadFont = async (fontName: string, apiUrl: string) => {
		if (loadedFonts.includes(fontName)) return true;

		try {
			// Define the FontFace using the API source URL
			const font = new FontFace(fontName, `url(${apiUrl})`);

			// Wait for the browser to fetch and load the font file
			const loadedFont = await font.load();

			// Add it to the document's font set
			document.fonts.add(loadedFont);

			setLoadedFonts((prev) => [...prev, fontName]);
			return true;
		} catch (error) {
			console.error(`Failed to load font: ${fontName}`, error);
			return false;
		}
	};

	return { loadFont, loadedFonts };
}
