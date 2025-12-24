export interface RaceData {
	racers: Runner[];
}

export interface Runner {
	uid: string;
	name: string;
	time: number;
	forfeit: boolean;
}
