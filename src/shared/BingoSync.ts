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