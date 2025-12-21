import * as nodecgApiContext from "./nodecg-api-context";
import ffprobe from "@ffprobe-installer/ffprobe";

import { intermissionVideosRep } from "./replicants";

import type { NodeCG } from "nodecg/out/types/nodecg";
import { spawn } from "node:child_process";

export interface IntermissionVideo {
	asset: string; // Serves as PK
	volume: number;
	displayName: string;
	videoInfo?: VideoInformation;
	enabled: boolean;
	loading: boolean; // Not saved in replicant
}

const nodecg = nodecgApiContext.get();

const intermissionVideoAssetsRep = nodecg.Replicant<NodeCG.AssetFile[]>("assets:intermissionVideos", {
	persistent: false,
});

intermissionVideoAssetsRep.on("change", (newVal) => {
	if (!newVal) {
		intermissionVideosRep.value = [];
		return;
	}

	const newVideos: IntermissionVideo[] = newVal
		.filter((asset) => {
			return !intermissionVideosRep.value.find((video) => video.asset === asset.name);
		})
		.map((asset) => {
			return {
				asset: asset.url,
				volume: 0.8,
				displayName: asset.name.replace(/\.[^/.]+$/, ""), // Remove file extension
				videoInfo: undefined,
				enabled: true,
				loading: true,
			};
		});

	const removedVideos = intermissionVideosRep.value.filter((video) => {
		return !newVal.find((asset) => asset.url === video.asset);
	});

	const newIntermissionVideosRep = intermissionVideosRep.value.filter((video) => {
		return !removedVideos.find((removed) => removed.asset === video.asset);
	});

	intermissionVideosRep.value = [...newIntermissionVideosRep, ...newVideos];

	// For each new video, get its information
	void Promise.all(
		newVideos.map(async (video) => {
			try {
				video.videoInfo = await getVideoInformation(video.asset);
			} catch (e) {
				nodecg.log.error(`Failed to get video information for ${video.asset}:`, e);
				video.videoInfo = undefined;
			}
			video.loading = false;

			intermissionVideosUpdate(video);
		})
	);
});

nodecg.listenFor("intermission-videos:update", (data: IntermissionVideo) => {
	intermissionVideosUpdate(data);
});

nodecg.listenFor("intermission-videos:refreshInfo", async (asset: string) => {
	const video = intermissionVideosRep.value.find((v) => v.asset === asset);

	if (video) {
		try {
			video.videoInfo = await getVideoInformation(video.asset);
		} catch (e) {
			nodecg.log.error(`Failed to get video information for ${video.asset}:`, e);
			video.videoInfo = undefined;
		}

		intermissionVideosUpdate(video);
	}
});

function intermissionVideosUpdate(data: IntermissionVideo) {
	const newData = intermissionVideosRep.value.map((video) => {
		if (video.asset === data.asset) {
			return data;
		}

		return video;
	});

	intermissionVideosRep.value = newData;
}

interface VideoInformation {
	duration: number; // in seconds
	verticalResolution: number;
	horizontalResolution: number;
	aspectRatio: string; // e.g. "16:9"
}

async function getVideoInformation(filePath: string): Promise<VideoInformation | undefined> {
	return new Promise((resolve, reject) => {
		const ffprobeProcess = spawn(ffprobe.path, [
			"-v",
			"error",
			"-select_streams",
			"v:0",
			"-show_entries",
			"stream=width,height,duration",
			"-of",
			"default=noprint_wrappers=1:nokey=1",
			`.${filePath}`, // filePath is like /assets/..., need to make it relative to pwd
		]);

		let output = "";
		let errorOutput = "";

		ffprobeProcess.stdout.on("data", (data) => {
			output += data.toString();
		});

		ffprobeProcess.stderr.on("data", (data) => {
			errorOutput += data.toString();
		});

		ffprobeProcess.on("exit", () => {
			if (errorOutput) {
				reject(new Error(errorOutput));
			} else {
				const [width, height, duration] = output.split("\n").map(Number);

				if (isNaN(width) || isNaN(height) || isNaN(duration)) {
					reject(
						new Error(
							`Failed to parse ffprobe output. Width: ${width}, Height: ${height}, Duration: ${duration}`,
						),
					);
					return;
				}

				const aspectRatioValues = reduceRatio(width, height);

				resolve({
					duration,
					verticalResolution: height,
					horizontalResolution: width,
					aspectRatio: `${aspectRatioValues.width}:${aspectRatioValues.height}`,
				});
			}
		});
	});
}

function gcd(a: number, b: number): number {
	return b === 0 ? a : gcd(b, a % b);
}

function reduceRatio(width: number, height: number) {
	const divisor = gcd(width, height);
	return {
		width: width / divisor,
		height: height / divisor,
	};
}
