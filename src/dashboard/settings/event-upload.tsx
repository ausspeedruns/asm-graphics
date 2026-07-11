import { Alert, Button } from "@mui/material";
import { useState } from "react";

export function EventUpload() {
	const [status, setStatus] = useState<{ severity: "success" | "error"; message: string } | null>(null);
	const [isUploading, setIsUploading] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = e.currentTarget;
		const fileInput = form.elements.namedItem("eventZip") as HTMLInputElement;
		const file = fileInput.files?.[0];
		if (!file) {
			return;
		}

		setIsUploading(true);
		setStatus(null);

		try {
			const response = await fetch(`/bundles/${nodecg.bundleName}/event-upload`, {
				method: "POST",
				headers: {
					"content-type": "application/zip",
					"x-file-name": encodeURIComponent(file.name),
				},
				body: file,
			});

			if (!response.ok) {
				throw new Error((await response.text()) || "Upload failed");
			}

			setStatus({ severity: "success", message: `Uploaded ${file.name} successfully.` });
			fileInput.value = "";
		} catch (error) {
			setStatus({
				severity: "error",
				message: error instanceof Error ? error.message : "Upload failed.",
			});
		} finally {
			setIsUploading(false);
		}
	}

	return (
		<div>
			<h3>Event Upload</h3>
			<p>
				Upload a ZIP file containing all event assets and configuration. The event will be set up automatically.
			</p>
			<form onSubmit={handleSubmit}>
				<label
					htmlFor="eventZip"
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						border: "2px dashed #888",
						borderRadius: 8,
						padding: "32px 0",
						cursor: "pointer",
						background: "#222",
						color: "#ccc",
						marginBottom: 16,
						transition: "border-color 0.2s",
					}}
					onDragOver={(e) => {
						e.preventDefault();
						e.currentTarget.style.borderColor = "#1976d2";
					}}
					onDragLeave={(e) => {
						e.preventDefault();
						e.currentTarget.style.borderColor = "#888";
					}}
					onDrop={(e) => {
						e.preventDefault();
						e.currentTarget.style.borderColor = "#888";
						const fileInput = document.getElementById("eventZip") as HTMLInputElement;
						if (e.dataTransfer.files.length > 0 && fileInput) {
							fileInput.files = e.dataTransfer.files;
						}
					}}
				>
					<input
						type="file"
						id="eventZip"
						name="eventZip"
						accept=".zip"
						required
						style={{ display: "none" }}
					/>
					<span style={{ fontSize: 24, marginBottom: 8 }}>📦</span>
					<span style={{ fontWeight: 500 }}>Click or drag ZIP file here to upload</span>
					<span style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>.zip only</span>
				</label>
				<Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }} disabled={isUploading}>
					{isUploading ? "Uploading Event ZIP..." : "Upload Event ZIP"}
				</Button>
				{status ? <Alert severity={status.severity} sx={{ marginTop: 2 }}>{status.message}</Alert> : null}
			</form>
		</div>
	);
}
