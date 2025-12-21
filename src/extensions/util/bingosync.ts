import EventEmitter from "node:events";
import { WebSocket as NodeWebSocket } from "ws";

export interface RoomJoinParameters {
	room: string;
	nickname: string;
	password: string;
}

export const CellColours = [
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

export type CellColour = (typeof CellColours)[number];

export interface BoardCell {
	slot: string;
	colors: CellColour[];
	name: string;
}

export interface BoardState {
	cells: BoardCell[];
}

interface WebSocketMessage {
	type: "goal" | "connected" | (string & {});
	player: {
		uuid: string;
		name: string;
		color: CellColour;
		is_spectator: boolean;
	};
	square: RawBoardState[number];
	player_color: CellColour;
	remove: boolean;
	timestamp: string;
	room: string;
}

type RawBoardState = {
	colors: string;
	slot: string;
	name: string;
}[];

type ConnectionState = "disconnected" | "connecting" | "connected";

interface BingosyncEvents {
	boardStateUpdate: [BoardState];
}

export class Bingosync extends EventEmitter<BingosyncEvents> {
	private readonly bingosyncUrl = "https://bingosync.com/";
	private readonly wsUrl = "wss://sockets.bingosync.com";
	private _state: ConnectionState = "disconnected";
	private _room: string | null = null;
	private key: string | null = null;
	private sessionId: string | null = null;
	private webSocket: NodeWebSocket | null = null;
	private boardState: BoardState | null = null;

	private static readonly apiPath = "api/";

	public get state(): ConnectionState {
		return this._state;
	}

	private set state(value: ConnectionState) {
		this._state = value;
	}

	public get room(): string | null {
		return this._room;
	}

	private set room(value: string | null) {
		this._room = value;
	}

	async joinRoom(roomDetails: RoomJoinParameters): Promise<void> {
		if (this.state !== "disconnected") {
			throw new Error("Already connected to a room. Please disconnect first.");
		}

		this.state = "connecting";

		const { room, nickname, password } = roomDetails;
		if (!room || !nickname) {
			throw new Error("Room and nickname are required to join a room.");
		}

		this.room = room;

		const joinRoomResponse = await fetch(this.getUrl("api/join-room"), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({
				room,
				nickname,
				password,
				is_specator: true, // They have misspelled "spectator" in *THEIR* API https://github.com/kbuzsaki/bingosync/blob/8f7925ccfe57263000d15e0fdf9630b8e717cbbd/bingosync-app/bingosync/views.py#L284
			}),
			redirect: "manual",
		});

		if (joinRoomResponse.status !== 302) {
			console.log("Join room response:", joinRoomResponse);
			console.log("Join room response body:", await joinRoomResponse.text());
			throw new Error(
				"Bingosync should be redirecting at this stage. It has not which means that Bingosync has changed their API.",
			);
		}

		const cookies = joinRoomResponse.headers.get("Set-Cookie");
		const sessionIdMatch = cookies?.match(/sessionid=([^;]+)/);
		if (!sessionIdMatch) {
			throw new Error("Session ID not found in redirect location.");
		}

		this.sessionId = sessionIdMatch[1];

		// Now we need to fetch the socket key using the session ID
		const socketKeyResponse = await fetch(this.getUrl(`api/get-socket-key/${room}`), {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Cookie: `sessionid=${this.sessionId}`,
			},
		});

		if (!socketKeyResponse.ok) {
			console.log("Socket key response", socketKeyResponse);
			console.log("Socket key response body:", await socketKeyResponse.text());
			throw new Error(`Failed to get socket key: ${socketKeyResponse.statusText}`);
		}

		const socketKeyData = await socketKeyResponse.json();

		this.key = socketKeyData.socket_key;

		this.state = "connected";

		this.createWebSocket();

		this.boardState = await this.getBoard();

		this.emit("boardStateUpdate", this.boardState);
	}

	disconnect(): void {
		// Implement disconnection logic here
		if (this.state !== "connected") {
			throw new Error("Not connected to any room.");
		}

		this.state = "disconnected";
		this.key = null;
	}

	async getBoard() {
		if (this.state !== "connected") {
			throw new Error("Not connected to any room.");
		}

		const url = this.getUrl(`room/${this.room}/board`);

		const boardResponse = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Cookie: `sessionid=${this.sessionId}`,
			},
		});

		if (!boardResponse.ok) {
			throw new Error(`Failed to fetch board: ${boardResponse.statusText}`);
		}

		const rawBoard: RawBoardState = await boardResponse.json();

		const parsedBoard = Bingosync.parseBoardState(rawBoard);

		return parsedBoard;
	}

	private getUrl(path: string): string {
		if (path.startsWith("/")) {
			path = path.slice(1);
		}
		return `${this.bingosyncUrl}${path}`;
	}

	private createWebSocket() {
		if (this.webSocket) {
			this.webSocket.close();
		}

		this.webSocket = new NodeWebSocket(`${this.wsUrl}/broadcast`);

		this.webSocket.onopen = () => {
			this.webSocket?.send(
				JSON.stringify({
					socket_key: this.key,
				}),
			);
		};

		this.webSocket.onmessage = (event) => {
			const rawData = typeof event.data === "string" ? event.data : JSON.stringify(event.data);
			const data = JSON.parse(rawData);
			this.handleWebSocketMessage(data);
		};

		this.webSocket.onclose = () => {
			this.webSocket = null;
		};

		this.webSocket.onerror = (error) => {
			console.error("WebSocket error:", error);
		};
	}

	private handleWebSocketMessage(data: WebSocketMessage) {
		if (data.type === "goal") {
			void this.handleGoalMessage(data);
		}
	}

	private async handleGoalMessage(data: WebSocketMessage) {
		const { player, square, timestamp } = data;
		console.log(`Goal scored by ${player.name} (${player.uuid}) at ${timestamp}`);

		// Update the board state with the new goal
		if (!this.boardState) {
			this.boardState = await this.getBoard();

			if (!this.boardState) {
				console.error("Failed to fetch initial board state.");
				return;
			}
			return;
		}

		const cellIndex = this.boardState.cells.findIndex((cell) => cell.slot === square.slot);

		if (cellIndex === -1) {
			console.warn(`Cell with slot ${square.slot} not found in board state.`);
			return;
		}

		this.boardState.cells[cellIndex] = Bingosync.parseCell(square);

		this.emit("boardStateUpdate", this.boardState);
	}

	private static parseBoardState(rawBoard: RawBoardState): BoardState {
		const cells: BoardCell[] = rawBoard.map((cell) => ({
			slot: cell.slot,
			colors: cell.colors.split(" ") as CellColour[],
			name: cell.name,
		}));

		return { cells };
	}

	private static parseCell(cell: RawBoardState[number]): BoardCell {
		return {
			slot: cell.slot,
			colors: cell.colors.split(" ") as CellColour[],
			name: cell.name,
		};
	}
}
