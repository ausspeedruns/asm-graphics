import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import {
	TextField,
	Button,
	Stack,
	ThemeProvider,
	FormControl,
	InputLabel,
	Select,
	SelectChangeEvent,
	Box,
	Chip,
	MenuItem,
	OutlinedInput,
} from "@mui/material";
import { useReplicant } from "@nodecg/react-hooks";
import { ConnectionStatus } from "@asm-graphics/types/Connections";
import { darkTheme } from "./theme";
import {
	type BoardCell,
	type BoardState,
	type RoomJoinParameters,
	type CellColour,
} from "../extensions/util/bingosync";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

const CellColours = [
	"blank",
	"orange",
	"red",
	"blue",
	"green",
	"purple",
	"navy",
	"teal",
	"brown",
	"pink",
	"yellow",
] as const;

const BingoDashboardContainer = styled.div``;

const StatusBox = styled.div`
	height: 2rem;
	color: white;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1rem;
	margin-bottom: 1rem;
`;

function connectionStatusStyle(status: ConnectionStatus | boolean): { text: string; colour: string } {
	switch (status) {
		case "disconnected":
			return { text: "Disconnected", colour: "#757575" };
		case "connected":
			return { text: "Connected", colour: "#4CAF50" };
		case "error":
			return { text: "Error", colour: "#D32F2F" };
		case "warning":
			return { text: "Missed Heartbeat", colour: "#FF9800" };
		case true:
			return { text: "READY", colour: "#4CAF50" };
		case false:
			return { text: "NOT READY", colour: "#D32F2F" };
		default:
			return { text: status, colour: "#ff008c" };
	}
}

export function BingoDashboard() {
	const [bingoSyncStatusRep] = useReplicant<ConnectionStatus>("bingosync:status");
	const [bingoSyncBoardStateRep] = useReplicant<BoardState>("bingosync:boardState");
	const [bingoSyncBoardStateOverrideRep] = useReplicant<BoardState>("bingosync:boardStateOverride");
	const [bingoSyncRoomDetailsRep] = useReplicant<RoomJoinParameters>("bingosync:roomDetails");
	const [roomCode, setRoomCode] = useState(bingoSyncRoomDetailsRep?.room ?? "");
	const [password, setPassword] = useState(bingoSyncRoomDetailsRep?.password ?? "");

	const [selectedCell, setSelectedCell] = useState<BoardCell | undefined>(undefined);

	const bingoStatusInfo = connectionStatusStyle(bingoSyncStatusRep ?? "disconnected");

	useEffect(() => {
		if (bingoSyncRoomDetailsRep) {
			setRoomCode(bingoSyncRoomDetailsRep.room);
			setPassword(bingoSyncRoomDetailsRep.password);
		}
	}, [bingoSyncRoomDetailsRep]);

	function handleJoinRoom() {
		nodecg.sendMessage("bingosync:joinRoom", {
			room: roomCode,
			nickname: "AusSpeedruns",
			password: password,
		});
	}

	function handleLeaveRoom() {
		nodecg.sendMessage("bingosync:leaveRoom");
	}

	const clonedBingoSyncBoardStateRep = [...(bingoSyncBoardStateRep?.cells ?? [])];
	const sortedCells = clonedBingoSyncBoardStateRep.sort((a, b) => {
		const numA = parseInt(a.slot.replace(/\D/g, ""), 10);
		const numB = parseInt(b.slot.replace(/\D/g, ""), 10);
		return numA - numB;
	});

	console.log(bingoSyncBoardStateOverrideRep, bingoSyncBoardStateRep);

	return (
		<ThemeProvider theme={darkTheme}>
			<BingoDashboardContainer>
				<StatusBox style={{ backgroundColor: bingoStatusInfo.colour }}>{bingoStatusInfo.text}</StatusBox>
				<Stack spacing={2} direction="column">
					<TextField
						label="Room Code"
						value={roomCode}
						onChange={(e) => setRoomCode(e.target.value)}
						variant="outlined"
						size="small"
					/>
					<TextField
						label="Password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						variant="outlined"
						size="small"
					/>
					<Stack direction="row" spacing={1}>
						<Button
							variant="contained"
							color="success"
							onClick={handleJoinRoom}
							fullWidth
							disabled={bingoSyncStatusRep === "connected"}>
							Join Room
						</Button>
						<Button
							variant="outlined"
							color="error"
							onClick={handleLeaveRoom}
							fullWidth
							disabled={bingoSyncStatusRep === "disconnected"}>
							Leave Room
						</Button>
					</Stack>
				</Stack>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(5, 77px)",
						justifyContent: "start",
						marginTop: "1rem",
					}}>
					{sortedCells.map((cell) => (
						<Cell
							key={cell.slot}
							cell={cell}
							onClick={setSelectedCell}
							overriddenCell={bingoSyncBoardStateOverrideRep?.cells.find(
								(overrideCell) => overrideCell.slot === cell.slot,
							)}
						/>
					))}
				</div>
			</BingoDashboardContainer>
			<OverrideDialog
				open={Boolean(selectedCell)}
				onClose={() => setSelectedCell(undefined)}
				originalCell={selectedCell}
				overriddenCell={bingoSyncBoardStateOverrideRep?.cells.find((cell) => cell.slot === selectedCell?.slot)}
			/>
		</ThemeProvider>
	);
}

const CellContainer = styled.div`
	display: flex;
	align-items: center;
	height: 77px;
	width: 77px;

	border: 1px solid #ccc;

	transition: background-color 0.1s ease-in-out;

	&:hover {
		background-color: rgba(240, 240, 240, 0.21);
		cursor: pointer;
	}
`;

const CellText = styled.span`
	font-size: 75%;
	text-align: center;
	width: 100%;
	padding: 0 2px;
	text-wrap: balance;
`;

function backgroundGradientGenerator(colours: CellColour[]): string {
	if (colours.length === 0 || colours[0] === "blank") {
		return "";
	}

	let currentPercentage = 0;
	const adder = 100 / colours.length;

	const allColours: string[] = [];

	colours.forEach((colour) => {
		allColours.push(`${colour} ${currentPercentage}%, ${colour} ${currentPercentage + adder}%`);
		currentPercentage += adder;
	});

	const linearGradient = `linear-gradient(90deg, ${allColours.join(", ")})`;

	return linearGradient;
}

interface CellProps {
	cell: BoardCell;
	overriddenCell?: BoardCell;
	onClick?: (cell: BoardCell) => void;
}

function Cell(props: CellProps) {
	return (
		<CellContainer
			onClick={() => props.onClick?.(props.cell)}
			style={{
				background: backgroundGradientGenerator(props.overriddenCell?.colors ?? props.cell.colors),
				fontWeight: props.overriddenCell ? "bold" : "normal",
			}}>
			<CellText>{props.overriddenCell?.name ?? props.cell.name}</CellText>
		</CellContainer>
	);
}

interface OverrideDialogProps {
	originalCell?: BoardCell;
	overriddenCell?: BoardCell;
	onClose: () => void;
	open: boolean;
}

function OverrideDialog(props: OverrideDialogProps) {
	const [name, setName] = useState(props.overriddenCell?.name ?? props.originalCell?.name ?? "");
	const [colours, setColours] = useState<CellColour[]>(
		props.overriddenCell?.colors ?? props.originalCell?.colors ?? [],
	);

	useEffect(() => {
		setName(props.overriddenCell?.name ?? props.originalCell?.name ?? "");
		setColours(props.overriddenCell?.colors ?? props.originalCell?.colors ?? []);
	}, [props.originalCell, props.overriddenCell]);

	function handleSave() {
		if (!props.originalCell) {
			console.error("No original cell provided for override.");
			return;
		}

		if (name === props.originalCell.name && colours === props.originalCell.colors) {
			nodecg.sendMessage("bingosync:overrideCell", {
				cellSlot: props.originalCell.slot,
				cellData: undefined, // Reset the override
			});
			props.onClose();
			return;
		}

		nodecg.sendMessage("bingosync:overrideCell", {
			cellSlot: props.originalCell.slot,
			cellData: {
				slot: props.originalCell.slot,
				name: name,
				colors: colours,
			},
		});

		props.onClose();
	}

	function handleReset() {
		if (!props.originalCell) {
			console.error("No original cell provided for reset.");
			return;
		}

		setName(props.originalCell.name);
		setColours(props.originalCell.colors);
	}

	function handleClose() {
		props.onClose();
	}

	const handleChange = (event: SelectChangeEvent<typeof colours>) => {
		const {
			target: { value },
		} = event;
		setColours(
			// On autofill we get a stringified value.
			typeof value === "string" ? (value.split(",") as CellColour[]) : value,
		);
	};

	return (
		<Dialog open={props.open} onClose={props.onClose}>
			<DialogTitle>Edit Cell</DialogTitle>
			<DialogContent>
				<Stack spacing={2} sx={{ mt: 1 }}>
					<TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />

					<FormControl sx={{ m: 1, width: 300 }}>
						<InputLabel>Colours</InputLabel>
						<Select
							multiple
							value={colours}
							onChange={handleChange}
							input={<OutlinedInput label="Colours" />}
							renderValue={(selected) => (
								<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
									{selected.map((value) => (
										<Chip key={value} label={value} />
									))}
								</Box>
							)}>
							{CellColours.map((colour) => (
								<MenuItem key={colour} value={colour}>
									{colour}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={handleReset} color="error">
					Reset
				</Button>
				<Button variant="contained" onClick={handleSave} color="success">
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}

createRoot(document.getElementById("root")!).render(<BingoDashboard />);
