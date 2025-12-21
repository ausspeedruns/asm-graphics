
namespace Alert {
	type Name =
		| "ImportConfirm"
		| "ReturnToStartConfirm"
		| "RemoveAllRunsConfirm"
		| "RemoveRunConfirm"
		| "TwitchLogoutConfirm"
		| "NoTwitchGame";

	export interface Dialog extends Window {
		openDialog: (opts: { name: Name; data?: { idk?: string }; func?: (confirm: boolean) => void }) => void;
	}
}

/**
 * Check if a dialog is "loaded" or not (due to NodeCG v2.2.2 changes with lazy iframes).
 * If it's not, will quickly open and close it to load it.
 * @param name Name of dialog.
 */
function checkDialog(name: string): Promise<void> {
	return new Promise<void>((res) => {
		const dialog = nodecg.getDialog(name);
		const iframe = dialog?.querySelector("iframe");
		if (iframe && dialog) {
			// We check if it's loaded or not if our custom "openDialog" function exists.
			const openDialog = (iframe.contentWindow as Alert.Dialog | null)?.openDialog;
			if (openDialog) {
				res();
			} else {
				iframe.addEventListener(
					"load",
					() => {
						dialog.close();
						res();
					},
					{ once: true },
				);
				dialog.open();
			}
		} else {
			res();
		}
	});
}

/**
 * Gets dialog's contentWindow based on name, if possible.
 * @param name Name of dialog.
 */
function getDialog(name: string): Window | null {
	try {
		const dialog = nodecg.getDialog(name);
		const iframe = dialog?.querySelector("iframe")?.contentWindow || null;
		if (!iframe) {
			throw new Error("Could not find the iFrame");
		}
		return iframe;
	} catch (err) {
		nodecg.log.error(`getDialog could not successfully find dialog "${name}":`, err);

		window.alert(
			`Attempted to open the NodeCG "${name}" dialog but failed (if you are using a standalone version of a dashboard panel, this is not yet supported).`,
		);
	}
	return null;
}

export async function checkAndGetDialog(name: string): Promise<Window | null> {
	await checkDialog(name);
	const dialog = getDialog(name);
	return dialog;
}
