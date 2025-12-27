import { Button } from "@mui/material";

export function EventUpload() {
	return (
		<div>
			<h3>Event Upload (NOT IMPLEMENTED)</h3>
			<p>
				Upload a ZIP file containing all event assets and configuration. The event will be set up automatically.
			</p>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					const form = e.target as HTMLFormElement;
					const fileInput = form.elements.namedItem("eventZip") as HTMLInputElement;
					if (!fileInput.files?.[0]) return;
					const file = fileInput.files[0];
					const data = new FormData();
					data.append("eventZip", file);
					// await nodecg.sendMessage("event:upload", data);
					fileInput.value = "";
				}}
			>
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
				<Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
					Upload Event ZIP
				</Button>
			</form>
		</div>
	);
}
