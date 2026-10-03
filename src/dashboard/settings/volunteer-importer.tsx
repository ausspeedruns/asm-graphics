import { useState } from "react";
import { Alert, Button, TextField } from "@mui/material";

const roles = ["TECH", "STAGE HAND", "FRONT DESK", "HOST", "RUNNERS"] as const;
const TIME_PATTERN = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i;

type VolunteerRole = (typeof roles)[number];
interface VolunteerShift {
	day: string;
	start: string;
	end: string;
	color: string | null;
}
interface VolunteerEntry {
	name: string;
	shifts: VolunteerShift[];
}
type VolunteerLists = Record<VolunteerRole, VolunteerEntry[]>;
/** A spreadsheet cell. Merged cells are repeated across every grid position they cover. */
interface Cell {
	text: string;
	color: string | null;
}
type Grid = (Cell | undefined)[][];

export function VolunteerImporter() {
	const [volunteerData, setVolunteerData] = useState("");
	const [clipboardHtml, setClipboardHtml] = useState<string | null>(null);
	const [volunteers, setVolunteers] = useState<VolunteerLists | null>(null);
	const [error, setError] = useState<string | null>(null);

	function handlePaste(event: React.ClipboardEvent<HTMLDivElement>) {
		const html = event.clipboardData.getData("text/html");
		if (!html) return;

		event.preventDefault();
		setClipboardHtml(html);
		setVolunteerData(event.clipboardData.getData("text/plain"));
	}

	function handleImport() {
		try {
			const grid = clipboardHtml ? htmlToGrid(clipboardHtml) : tsvToGrid(volunteerData);
			const parsedVolunteers = parseSchedule(grid);
			setVolunteers(parsedVolunteers);
			setError(null);

			nodecg.sendMessage("volunteers:update", parsedVolunteers);
		} catch (importError) {
			setVolunteers(null);
			setError(importError instanceof Error ? importError.message : "Unable to import volunteer data.");
		}
	}

	return (
		<div>
			<h1>Volunteer Importer</h1>
			<TextField
				label="Volunteer Data"
				multiline
				minRows={8}
				fullWidth
				value={volunteerData}
				onPaste={handlePaste}
				onChange={(event) => {
					setClipboardHtml(null);
					setVolunteerData(event.target.value);
				}}
			/>
			<Button onClick={handleImport} variant="contained" sx={{ mt: 2 }}>
				Import
			</Button>
			{error && (
				<Alert severity="error" sx={{ mt: 2 }}>
					{error}
				</Alert>
			)}
			{volunteers &&
				roles.map((role) => (
					<section key={role}>
						<h2>{role}</h2>
						{volunteers[role].length ? (
							<ul>
								{volunteers[role].map((volunteer) => (
									<li key={volunteer.name}>
										<strong>{volunteer.name}</strong>:{" "}
										{volunteer.shifts.map((shift) => (
											<ShiftLabel key={`${shift.day}-${shift.start}`} shift={shift} />
										))}
									</li>
								))}
							</ul>
						) : (
							<p>None</p>
						)}
					</section>
				))}
		</div>
	);
}

function ShiftLabel({ shift }: { shift: VolunteerShift }) {
	return (
		<span style={{ display: "inline-block", margin: "2px 4px", whiteSpace: "nowrap" }}>
			{shift.color && (
				<span
					aria-label={`Cell color ${shift.color}`}
					style={{
						display: "inline-block",
						width: 12,
						height: 12,
						marginRight: 4,
						border: "1px solid #888",
						backgroundColor: shift.color,
						verticalAlign: "-2px",
					}}
				/>
			)}
			{shift.day} {shift.start} – {shift.end}
		</span>
	);
}

/** Reads the volunteer roster out of a grid of cells, regardless of where it came from. */
function parseSchedule(grid: Grid): VolunteerLists {
	const headerIndex = grid.findIndex((row) => roles.every((role) => row.some((cell) => normalize(cell) === role)));
	const header = grid[headerIndex] ?? [];
	const dayColumn = header.findIndex((cell) => normalize(cell) === "DAY");
	const timeColumn = header.findIndex((cell) => normalize(cell) === "TIME");

	if (headerIndex === -1 || dayColumn === -1 || timeColumn === -1) {
		throw new Error("Could not find the DAY, TIME, TECH, STAGE HAND, FRONT DESK, HOST and RUNNERS headers.");
	}

	// A role owns its header column plus any blank header columns after it (e.g. the two HOST columns).
	const roleColumns: Array<[column: number, role: VolunteerRole]> = [];
	let currentRole: VolunteerRole | undefined;
	for (let column = 0; column < header.length; column++) {
		const text = normalize(header[column]);
		if (text) currentRole = roles.find((role) => role === text);
		if (currentRole) roleColumns.push([column, currentRole]);
	}

	const byRole = Object.fromEntries(roles.map((role) => [role, new Map<string, VolunteerEntry>()])) as Record<
		VolunteerRole,
		Map<string, VolunteerEntry>
	>;
	let day = "";

	for (const row of grid.slice(headerIndex + 1)) {
		day = row[dayColumn]?.text || day;
		const start = row[timeColumn]?.text ?? "";
		const end = addHour(start);
		if (!day || !end) continue;

		for (const [column, role] of roleColumns) {
			const cell = row[column];
			for (const rawName of cell?.text.split(/[,\n]/) ?? []) {
				const name = rawName.replace(/☆/g, "").trim();
				if (!name) continue;

				const key = name.toLowerCase();
				const volunteer = byRole[role].get(key) ?? { name, shifts: [] };
				byRole[role].set(key, volunteer);

				// Rows are hourly slots in order, so a shift only ever needs to extend the volunteer's latest one.
				const last = volunteer.shifts.at(-1);
				if (last?.day === day && last.end === end) continue; // Already counted (e.g. second HOST column).
				if (last?.day === day && last.end === start) {
					last.end = end;
				} else {
					volunteer.shifts.push({ day, start, end, color: cell?.color ?? null });
				}
			}
		}
	}

	return Object.fromEntries(
		roles.map((role) => [
			role,
			[...byRole[role].values()].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" })),
		]),
	) as VolunteerLists;
}

/** "11:00 AM" -> "12:00 PM". Returns null if the text isn't a time. */
function addHour(time: string): string | null {
	const match = TIME_PATTERN.exec(time);
	if (!match) return null;

	const [, hour = "", minutes = "", period = ""] = match;
	const hour24 = ((Number(hour) % 12) + (period.toUpperCase() === "PM" ? 12 : 0) + 1) % 24;
	return `${hour24 % 12 || 12}:${minutes} ${hour24 < 12 ? "AM" : "PM"}`;
}

function normalize(cell: Cell | undefined) {
	return cell?.text.toUpperCase() ?? "";
}

function tsvToGrid(data: string): Grid {
	return data.split(/\r?\n/).map((line) => line.split("\t").map((text) => ({ text: text.trim(), color: null })));
}

/** Converts Excel clipboard HTML into a grid, expanding rowspan/colspan so every row lines up with the header. */
function htmlToGrid(html: string): Grid {
	const document = new DOMParser().parseFromString(html, "text/html");
	const table = document.querySelector("table");
	if (!table) {
		throw new Error("Could not find a spreadsheet table in the pasted HTML.");
	}

	const classColors = getClassColors(document);
	const grid: Grid = [];

	Array.from(table.rows).forEach((tableRow, rowIndex) => {
		const row = (grid[rowIndex] ??= []);
		let column = 0;

		for (const tableCell of Array.from(tableRow.cells)) {
			while (row[column]) column++; // Skip positions filled by a rowspan from above.

			// Excel encodes in-cell line breaks as <br>, which textContent would drop.
			tableCell.querySelectorAll("br").forEach((br) => br.replaceWith("\n"));
			const cell: Cell = {
				text: tableCell.textContent?.trim() ?? "",
				color: tableCell.style.backgroundColor || findClassColor(tableCell, classColors),
			};

			for (let rowOffset = 0; rowOffset < tableCell.rowSpan; rowOffset++) {
				const spannedRow = (grid[rowIndex + rowOffset] ??= []);
				for (let colOffset = 0; colOffset < tableCell.colSpan; colOffset++) {
					spannedRow[column + colOffset] = cell;
				}
			}
			column += tableCell.colSpan;
		}
	});

	return grid;
}

/** Excel puts most cell colours in `.xlNN` classes inside a <style> block, so map class name -> background colour. */
function getClassColors(document: Document): Map<string, string> {
	const stylesheet = new CSSStyleSheet();
	try {
		stylesheet.replaceSync(Array.from(document.querySelectorAll("style"), (style) => style.textContent).join("\n"));
	} catch {
		return new Map();
	}

	const colors = new Map<string, string>();
	for (const rule of Array.from(stylesheet.cssRules)) {
		if (!(rule instanceof CSSStyleRule)) continue;
		const className = /^\.([\w-]+)$/.exec(rule.selectorText)?.[1];
		if (className && rule.style.backgroundColor) {
			colors.set(className, rule.style.backgroundColor);
		}
	}
	return colors;
}

function findClassColor(cell: HTMLTableCellElement, classColors: Map<string, string>): string | null {
	for (const className of Array.from(cell.classList)) {
		const color = classColors.get(className);
		if (color) return color;
	}
	return null;
}
