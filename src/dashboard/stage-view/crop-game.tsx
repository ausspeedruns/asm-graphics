import { useCallback, useEffect, useRef, useState } from "react";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import z from "zod";
import type { CropSettings } from "@asm-graphics/shared/obs-types";

const BASE_WIDTH = 1920;
const BASE_HEIGHT = 1080;
const ImageReturnZod = z.object({
	imageData: z.string(),
});

interface CropGameDialogProps {
	open: boolean;
	videoSourceName?: string;
	onClose: () => void;
	onCrop: (settings: CropSettings) => void;
}

type DragHandle =
	| "top"
	| "bottom"
	| "left"
	| "right"
	| "top-left"
	| "top-right"
	| "bottom-left"
	| "bottom-right"
	| "move"
	| null;

export function CropGameDialog(props: CropGameDialogProps) {
	const [image, setImage] = useState<string | null>(null);
	const [loadingImage, setLoadingImage] = useState(false);
	const [cropSettings, setCropSettings] = useState<CropSettings>({
		left: 0,
		top: 0,
		right: 0,
		bottom: 0,
	});

	const previewRef = useRef<HTMLDivElement>(null);
	const dragRef = useRef<{ handle: DragHandle; startX: number; startY: number; startCrop: CropSettings } | null>(
		null,
	);

	useEffect(() => {
		if (!props.open) return;

		getSourceImage();
	}, [props.videoSourceName, props.open]);

	function getSourceImage() {
		if (!props.videoSourceName) return;

		setLoadingImage(true);
		nodecg.sendMessage("obs:getVideoFeed", { feedName: props.videoSourceName }, (err, imageData) => {
			if (err) {
				console.error("Error fetching video feed:", err);
				return;
			}

			const parsed = ImageReturnZod.safeParse(imageData);

			if (!parsed.success) {
				console.error("Invalid image data received:", parsed.error);
				return;
			}

			setImage(parsed.data.imageData);
			setLoadingImage(false);
		});
	}

	// Convert crop settings to display coordinates (percentage of preview area)
	const cropToPercent = useCallback((crop: CropSettings) => {
		return {
			left: (crop.left / BASE_WIDTH) * 100,
			top: (crop.top / BASE_HEIGHT) * 100,
			right: (crop.right / BASE_WIDTH) * 100,
			bottom: (crop.bottom / BASE_HEIGHT) * 100,
		};
	}, []);

	const percentCrop = cropToPercent(cropSettings);

	function handleInputChange(field: keyof CropSettings) {
		return (event: React.ChangeEvent<HTMLInputElement>) => {
			const maxValue = field === "left" || field === "right" ? BASE_WIDTH : BASE_HEIGHT;
			const value = Math.max(0, Math.min(maxValue, Number(event.target.value) || 0));
			setCropSettings((prev) => ({ ...prev, [field]: value }));
		};
	}

	function handleMouseDown(handle: DragHandle) {
		return (e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			dragRef.current = {
				handle,
				startX: e.clientX,
				startY: e.clientY,
				startCrop: { ...cropSettings },
			};
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		};
	}

	const handleMouseMove = useCallback((e: MouseEvent) => {
		if (!dragRef.current || !previewRef.current) return;

		const previewRect = previewRef.current.getBoundingClientRect();
		const scaleX = BASE_WIDTH / previewRect.width;
		const scaleY = BASE_HEIGHT / previewRect.height;

		const deltaX = Math.round((e.clientX - dragRef.current.startX) * scaleX);
		const deltaY = Math.round((e.clientY - dragRef.current.startY) * scaleY);

		const { handle, startCrop } = dragRef.current;

		setCropSettings((prev) => {
			const newCrop = { ...prev };

			if (handle === "move") {
				// Move the entire crop region
				const currentWidth = BASE_WIDTH - startCrop.left - startCrop.right;
				const currentHeight = BASE_HEIGHT - startCrop.top - startCrop.bottom;

				let newLeft = startCrop.left + deltaX;
				let newTop = startCrop.top + deltaY;

				// Clamp to bounds
				newLeft = Math.max(0, Math.min(BASE_WIDTH - currentWidth, newLeft));
				newTop = Math.max(0, Math.min(BASE_HEIGHT - currentHeight, newTop));

				newCrop.left = newLeft;
				newCrop.top = newTop;
				newCrop.right = BASE_WIDTH - newLeft - currentWidth;
				newCrop.bottom = BASE_HEIGHT - newTop - currentHeight;
			} else {
				// Resize handles
				if (handle?.includes("left")) {
					newCrop.left = Math.max(0, Math.min(BASE_WIDTH - startCrop.right - 10, startCrop.left + deltaX));
				}
				if (handle?.includes("right")) {
					newCrop.right = Math.max(0, Math.min(BASE_WIDTH - startCrop.left - 10, startCrop.right - deltaX));
				}
				if (handle?.includes("top") && handle !== "top-left" && handle !== "top-right") {
					newCrop.top = Math.max(0, Math.min(BASE_HEIGHT - startCrop.bottom - 10, startCrop.top + deltaY));
				} else if (handle?.includes("top")) {
					newCrop.top = Math.max(0, Math.min(BASE_HEIGHT - startCrop.bottom - 10, startCrop.top + deltaY));
				}
				if (handle?.includes("bottom") && handle !== "bottom-left" && handle !== "bottom-right") {
					newCrop.bottom = Math.max(0, Math.min(BASE_HEIGHT - startCrop.top - 10, startCrop.bottom - deltaY));
				} else if (handle?.includes("bottom")) {
					newCrop.bottom = Math.max(0, Math.min(BASE_HEIGHT - startCrop.top - 10, startCrop.bottom - deltaY));
				}
				if (handle === "top") {
					newCrop.top = Math.max(0, Math.min(BASE_HEIGHT - startCrop.bottom - 10, startCrop.top + deltaY));
				}
				if (handle === "bottom") {
					newCrop.bottom = Math.max(0, Math.min(BASE_HEIGHT - startCrop.top - 10, startCrop.bottom - deltaY));
				}
			}

			return newCrop;
		});
	}, []);

	const handleMouseUp = useCallback(() => {
		dragRef.current = null;
		document.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("mouseup", handleMouseUp);
	}, [handleMouseMove]);

	function handleCrop() {
		props.onCrop(cropSettings);
	}

	const handleStyles = {
		position: "absolute" as const,
		backgroundColor: "#4caf50",
		border: "2px solid #fff",
		borderRadius: "2px",
		zIndex: 10,
	};

	const cornerHandleSize = 12;
	const edgeHandleSize = 10;

	// Calculate visible region dimensions
	const visibleWidth = BASE_WIDTH - cropSettings.left - cropSettings.right;
	const visibleHeight = BASE_HEIGHT - cropSettings.top - cropSettings.bottom;

	return (
		<Dialog open={props.open} onClose={props.onClose} maxWidth="lg" fullWidth>
			<DialogTitle>Crop Game Feed</DialogTitle>
			<DialogContent>
				<Stack spacing={3} sx={{ mt: 1 }}>
					{/* Main Preview Area */}
					<Box
						ref={previewRef}
						sx={{
							width: "100%",
							aspectRatio: "16/9",
							backgroundColor: "#1a1a1a",
							border: "1px solid #444",
							borderRadius: 1,
							position: "relative",
							overflow: "hidden",
							userSelect: "none",
						}}
					>
						{/* Dimmed overlay for cropped areas */}
						<Box
							sx={{
								position: "absolute",
								inset: 0,
								backgroundColor: "rgba(0, 0, 0, 0.6)",
								clipPath: `polygon(
									0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%,
									${percentCrop.left}% ${percentCrop.top}%,
									${percentCrop.left}% ${100 - percentCrop.bottom}%,
									${100 - percentCrop.right}% ${100 - percentCrop.bottom}%,
									${100 - percentCrop.right}% ${percentCrop.top}%,
									${percentCrop.left}% ${percentCrop.top}%
								)`,
								pointerEvents: "none",
							}}
						/>

						{/* Crop Region */}
						<Box
							onMouseDown={handleMouseDown("move")}
							sx={{
								position: "absolute",
								left: `${percentCrop.left}%`,
								top: `${percentCrop.top}%`,
								right: `${percentCrop.right}%`,
								bottom: `${percentCrop.bottom}%`,
								border: "2px solid #4caf50",
								cursor: "move",
								boxSizing: "border-box",
							}}
						>
							{/* Corner Handles */}
							{/* Top-Left */}
							<Box
								onMouseDown={handleMouseDown("top-left")}
								sx={{
									...handleStyles,
									top: -cornerHandleSize / 2,
									left: -cornerHandleSize / 2,
									width: cornerHandleSize,
									height: cornerHandleSize,
									cursor: "nwse-resize",
								}}
							/>
							{/* Top-Right */}
							<Box
								onMouseDown={handleMouseDown("top-right")}
								sx={{
									...handleStyles,
									top: -cornerHandleSize / 2,
									right: -cornerHandleSize / 2,
									width: cornerHandleSize,
									height: cornerHandleSize,
									cursor: "nesw-resize",
								}}
							/>
							{/* Bottom-Left */}
							<Box
								onMouseDown={handleMouseDown("bottom-left")}
								sx={{
									...handleStyles,
									bottom: -cornerHandleSize / 2,
									left: -cornerHandleSize / 2,
									width: cornerHandleSize,
									height: cornerHandleSize,
									cursor: "nesw-resize",
								}}
							/>
							{/* Bottom-Right */}
							<Box
								onMouseDown={handleMouseDown("bottom-right")}
								sx={{
									...handleStyles,
									bottom: -cornerHandleSize / 2,
									right: -cornerHandleSize / 2,
									width: cornerHandleSize,
									height: cornerHandleSize,
									cursor: "nwse-resize",
								}}
							/>

							{/* Edge Handles */}
							{/* Top */}
							<Box
								onMouseDown={handleMouseDown("top")}
								sx={{
									...handleStyles,
									top: -edgeHandleSize / 2,
									left: "50%",
									transform: "translateX(-50%)",
									width: 30,
									height: edgeHandleSize,
									cursor: "ns-resize",
								}}
							/>
							{/* Bottom */}
							<Box
								onMouseDown={handleMouseDown("bottom")}
								sx={{
									...handleStyles,
									bottom: -edgeHandleSize / 2,
									left: "50%",
									transform: "translateX(-50%)",
									width: 30,
									height: edgeHandleSize,
									cursor: "ns-resize",
								}}
							/>
							{/* Left */}
							<Box
								onMouseDown={handleMouseDown("left")}
								sx={{
									...handleStyles,
									left: -edgeHandleSize / 2,
									top: "50%",
									transform: "translateY(-50%)",
									width: edgeHandleSize,
									height: 30,
									cursor: "ew-resize",
								}}
							/>
							{/* Right */}
							<Box
								onMouseDown={handleMouseDown("right")}
								sx={{
									...handleStyles,
									right: -edgeHandleSize / 2,
									top: "50%",
									transform: "translateY(-50%)",
									width: edgeHandleSize,
									height: 30,
									cursor: "ew-resize",
								}}
							/>
						</Box>

						{/* Video placeholder text */}
						{image ? (
							<img src={image} alt="Preview" style={{ height: "100%", width: "100%" }} />
						) : (
							<Typography
								variant="caption"
								sx={{
									position: "absolute",
									top: "50%",
									left: "50%",
									transform: "translate(-50%, -50%)",
									color: "#666",
									pointerEvents: "none",
								}}
							>
								No Preview
							</Typography>
						)}
					</Box>

					{/* Edge Preview Windows */}
					<Typography variant="subtitle2">Edge Previews (for pixel-perfect alignment)</Typography>
					<Stack direction="row" spacing={2} justifyContent="space-between">
						{/* Left Edge Preview */}
						<EdgePreview
							label="Left Edge"
							value={cropSettings.left}
							axis="vertical"
							side="left"
							crop={cropSettings}
						/>
						{/* Top Edge Preview */}
						<EdgePreview
							label="Top Edge"
							value={cropSettings.top}
							axis="horizontal"
							side="top"
							crop={cropSettings}
						/>
						{/* Right Edge Preview */}
						<EdgePreview
							label="Right Edge"
							value={cropSettings.right}
							axis="vertical"
							side="right"
							crop={cropSettings}
						/>
						{/* Bottom Edge Preview */}
						<EdgePreview
							label="Bottom Edge"
							value={cropSettings.bottom}
							axis="horizontal"
							side="bottom"
							crop={cropSettings}
						/>
					</Stack>

					{/* Pixel Input Controls */}
					<Typography variant="subtitle2">Crop Values (pixels)</Typography>
					<Stack direction="row" spacing={2}>
						<TextField
							label="Left"
							type="number"
							size="small"
							value={cropSettings.left}
							onChange={handleInputChange("left")}
							inputProps={{ min: 0, max: BASE_WIDTH }}
							sx={{ flex: 1 }}
						/>
						<TextField
							label="Top"
							type="number"
							size="small"
							value={cropSettings.top}
							onChange={handleInputChange("top")}
							inputProps={{ min: 0, max: BASE_HEIGHT }}
							sx={{ flex: 1 }}
						/>
						<TextField
							label="Right"
							type="number"
							size="small"
							value={cropSettings.right}
							onChange={handleInputChange("right")}
							inputProps={{ min: 0, max: BASE_WIDTH }}
							sx={{ flex: 1 }}
						/>
						<TextField
							label="Bottom"
							type="number"
							size="small"
							value={cropSettings.bottom}
							onChange={handleInputChange("bottom")}
							inputProps={{ min: 0, max: BASE_HEIGHT }}
							sx={{ flex: 1 }}
						/>
					</Stack>

					{/* Info Display */}
					<Stack direction="row" spacing={4}>
						<Typography variant="body2" color="text.secondary">
							Visible Region: {visibleWidth} × {visibleHeight} px
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Base Resolution: {BASE_WIDTH} × {BASE_HEIGHT} px
						</Typography>
					</Stack>
				</Stack>
			</DialogContent>
			<DialogActions>
				<div style={{ flexGrow: 1 }}>
					<Button onClick={() => setCropSettings({ left: 0, top: 0, right: 0, bottom: 0 })}>Reset</Button>
					<Button onClick={props.onClose}>Cancel</Button>
				</div>
				<Button onClick={getSourceImage} loading={loadingImage}>Refresh</Button>
				<Button variant="contained" color="primary" onClick={handleCrop}>
					Apply Crop
				</Button>
			</DialogActions>
		</Dialog>
	);
}

interface EdgePreviewProps {
	label: string;
	value: number;
	axis: "horizontal" | "vertical";
	side: "left" | "right" | "top" | "bottom";
	crop: CropSettings;
}

function EdgePreview({ label, value, axis, side, crop }: EdgePreviewProps) {
	const previewSize = 80;
	const zoomFactor = 2;

	// Calculate where the crop line should appear in the preview
	// The preview shows a zoomed area around the crop edge
	const getEdgeIndicatorPosition = () => {
		if (axis === "vertical") {
			// Left/Right edges - show vertical line
			return { type: "vertical" as const, position: previewSize / 2 };
		} else {
			// Top/Bottom edges - show horizontal line
			return { type: "horizontal" as const, position: previewSize / 2 };
		}
	};

	const indicator = getEdgeIndicatorPosition();

	// Calculate what part of the source would be shown
	const getSourceInfo = () => {
		switch (side) {
			case "left":
				return `${value}px from left`;
			case "right":
				return `${value}px from right`;
			case "top":
				return `${value}px from top`;
			case "bottom":
				return `${value}px from bottom`;
		}
	};

	return (
		<Stack spacing={0.5} alignItems="center" sx={{ flex: 1 }}>
			<Typography variant="caption" color="text.secondary">
				{label}
			</Typography>
			<Box
				sx={{
					width: previewSize,
					height: previewSize,
					backgroundColor: "#2a2a2a",
					border: "1px solid #444",
					borderRadius: 1,
					position: "relative",
					overflow: "hidden",
				}}
			>
				{/* Simulated zoomed content */}
				<Box
					sx={{
						position: "absolute",
						inset: 0,
						background: `repeating-linear-gradient(
							45deg,
							#333,
							#333 10px,
							#3a3a3a 10px,
							#3a3a3a 20px
						)`,
					}}
				/>

				{/* Crop edge indicator line */}
				{indicator.type === "vertical" ? (
					<Box
						sx={{
							position: "absolute",
							left: indicator.position,
							top: 0,
							bottom: 0,
							width: 2,
							backgroundColor: "#4caf50",
							boxShadow: "0 0 4px #4caf50",
						}}
					/>
				) : (
					<Box
						sx={{
							position: "absolute",
							top: indicator.position,
							left: 0,
							right: 0,
							height: 2,
							backgroundColor: "#4caf50",
							boxShadow: "0 0 4px #4caf50",
						}}
					/>
				)}

				{/* Cropped region indicator (dimmed area) */}
				<Box
					sx={{
						position: "absolute",
						...(side === "left" && { left: 0, top: 0, bottom: 0, width: "50%" }),
						...(side === "right" && { right: 0, top: 0, bottom: 0, width: "50%" }),
						...(side === "top" && { top: 0, left: 0, right: 0, height: "50%" }),
						...(side === "bottom" && { bottom: 0, left: 0, right: 0, height: "50%" }),
						backgroundColor: "rgba(0, 0, 0, 0.5)",
					}}
				/>
			</Box>
			<Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
				{getSourceInfo()}
			</Typography>
		</Stack>
	);
}
