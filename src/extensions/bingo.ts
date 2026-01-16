import { get as nodecgGet } from "./nodecg-api-context.js";
import { Bingosync } from "./util/bingosync.js";
import type { BoardCell, RoomJoinParameters } from "@asm-graphics/shared/BingoSync.js";
import { getReplicant } from "./replicants.js";
import { clone } from "underscore";
import type { ConnectionStatus } from "@asm-graphics/shared/replicants.js";

const nodecg = nodecgGet();

const log = new nodecg.Logger("Bingosync");

const bingosyncRoomDetailsRep = getReplicant("bingosync:roomDetails");
const bingosyncStatusRep = getReplicant("bingosync:status");
const bingosyncBoardStateRep = getReplicant("bingosync:boardState");
const bingosyncBoardStateOverrideRep = getReplicant("bingosync:boardStateOverride");

const bingosync = new Bingosync();

// Join rooms
nodecg.listenFor("bingosync:joinRoom", async (params) => {
	await joinRoomHandler(params);
});

// Leave rooms
nodecg.listenFor("bingosync:leaveRoom", () => {
	log.info("Leaving Bingosync room");
	updateBingosyncStatus("disconnected", "Left room");
	bingosyncBoardStateRep.value = { cells: [] };
	bingosyncBoardStateOverrideRep.value = { cells: [] };
	bingosync.disconnect();
});

// Update replicant on board state w/ overrides
bingosync.on("boardStateUpdate", (boardState) => {
	log.info("Received board state update from Bingosync");
	const mutableBoardState = clone(boardState);
	console.log("Updated board state with overrides:", mutableBoardState);

	// Apply overrides to the board state
	bingosyncBoardStateOverrideRep.value.cells.forEach((overrideCell) => {
		const index = mutableBoardState.cells.findIndex((cell) => cell.slot === overrideCell.slot);
		if (index !== -1) {
			mutableBoardState.cells[index] = { ...mutableBoardState.cells[index], ...clone(overrideCell) };
		}
	});

	// Got too many duplicate object replicant errors, we cloning the long way now
	bingosyncBoardStateRep.value = JSON.parse(JSON.stringify(mutableBoardState));
});

// Update new overrides on board state
nodecg.listenFor("bingosync:overrideCell", (cellData) => {
	log.info(`Overriding cell ${cellData.cellSlot} with new data`, cellData.cellData);
	let found = false;
	let newOverrides: BoardCell[] = bingosyncBoardStateOverrideRep.value.cells.map((cell) => {
		console.log("Checking cell:", cell, "against slot:", cellData.cellSlot);
		if (cell.slot === cellData.cellSlot && cellData.cellData) {
			console.log("Found matching cell for override:", cell);
			found = true;
			return cellData.cellData;
		}

		return cell;
	});

	if (!found && cellData.cellData) {
		newOverrides.push(cellData.cellData);
	}

	// Remove any cells that are undefined
	newOverrides = newOverrides.filter((cell) => cell !== undefined);

	// Got too many duplicate object replicant errors, we cloning the long way now
	bingosyncBoardStateOverrideRep.value = JSON.parse(
		JSON.stringify({
			cells: [...newOverrides],
		}),
	);
});

async function joinRoomHandler(roomDetails: RoomJoinParameters) {
	bingosyncRoomDetailsRep.value = roomDetails;
	updateBingosyncStatus("connecting", `Joining room: ${roomDetails.room}...`);
	log.info(`Joining Bingosync room: ${roomDetails.room} as ${roomDetails.nickname}`);

	await bingosync.joinRoom(roomDetails).catch((error) => {
		updateBingosyncStatus("error", `Failed to join room: ${roomDetails.room}`);
		log.error("Failed to join Bingosync room:", error);
	});

	updateBingosyncStatus("connected", `Successfully joined room: ${roomDetails.room}`);
	log.info(`Successfully joined Bingosync room: ${roomDetails.room} as ${roomDetails.nickname}`);
}

if (bingosyncBoardStateRep.value.cells.length > 0) {
	log.info(
		"Bingosync board state already exists which means we might be recovering from a crash, automatically joining again.",
	);
	void joinRoomHandler(bingosyncRoomDetailsRep.value);
}

function updateBingosyncStatus(status: ConnectionStatus['status'], message: string) {
	bingosyncStatusRep.value = {
		status,
		timestamp: Date.now(),
		message,
	};
}
