import { get as nodecgGet } from "./nodecg-api-context";
import { Bingosync, BoardCell, RoomJoinParameters } from "./util/bingosync";
import { bingosyncRoomDetailsRep, bingosyncStatusRep, bingosyncBoardStateRep, bingosyncBoardStateOverrideRep } from "./replicants";
import { clone } from "underscore";

const nodecg = nodecgGet();

const log = new nodecg.Logger("Bingosync");

const bingosync = new Bingosync();

// Join rooms
nodecg.listenFor("bingosync:joinRoom", async (params) => {
	await joinRoomHandler(params);
});

// Leave rooms
nodecg.listenFor("bingosync:leaveRoom", () => {
	log.info("Leaving Bingosync room");
	bingosyncStatusRep.value = "disconnected";
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


	bingosyncBoardStateRep.value = mutableBoardState;
});

// Update new overrides on board state
nodecg.listenFor("bingosync:overrideCell", (cellData) => {
	log.info(`Overriding cell ${cellData.cellSlot} with new data`, cellData.cellData);
	let found = false;
	let newOverrides: BoardCell[] = bingosyncBoardStateOverrideRep.value.cells.map((cell) => {
		console.log("Checking cell:", cell, "against slot:", cellData.cellSlot);
		if (cell.slot === cellData.cellSlot) {
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

	bingosyncBoardStateOverrideRep.value = {
		cells: [...newOverrides],
	};
});

async function joinRoomHandler(roomDetails: RoomJoinParameters) {
	bingosyncRoomDetailsRep.value = roomDetails;
	bingosyncStatusRep.value = "disconnected";
	log.info(`Joining Bingosync room: ${roomDetails.room} as ${roomDetails.nickname}`);

	const error = false;
	await bingosync.joinRoom(roomDetails).catch((error) => {
		error = true;
		bingosyncStatusRep.value = "error";
		log.error("Failed to join Bingosync room:", error);
	});

	if (error) return;

	bingosyncStatusRep.value = "connected";
	log.info(`Successfully joined Bingosync room: ${roomDetails.room} as ${roomDetails.nickname}`);
}

if (bingosyncBoardStateRep.value.cells.length > 0) {
	log.info("Bingosync board state already exists which means we might be recovering from a crash, automatically joining again.");
	joinRoomHandler(bingosyncRoomDetailsRep.value);
}
