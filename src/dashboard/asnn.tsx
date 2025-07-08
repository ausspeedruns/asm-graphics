import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { Button, TextField, ThemeProvider } from "@mui/material";
import { darkTheme } from "./theme";
import { useReplicant } from "@nodecg/react-hooks";
import { GreenButton, RedButton } from "./elements/styled-ui";
import { Delete, DragIndicator } from "@mui/icons-material";
import { useLocalStorage } from "@uidotdev/usehooks";
import {
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	UniqueIdentifier,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

const ASNNDashContainer = styled.div``;

const Row = styled.div`
	display: flex;
	gap: 8px;
	margin: 8px 0;
	align-items: center;
`;

const TickerListContainer = styled.div`
	padding: 0 16px;
	margin-bottom: 12px;
`;

const TickerItem = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	border-radius: 10px;
	border: 2px solid rgba(255, 255, 255, 0.278);
	padding: 8px;
	margin: 4px 0;
	overflow-wrap: anywhere;
	background: #32425a;
`;

interface Ticker {
	id: UniqueIdentifier;
	text: string;
}

interface TickerProps {
	ticker: Ticker;
	removeFunc: () => void;
}

function Ticker(props: TickerProps) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.ticker.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<TickerItem ref={setNodeRef} style={style}>
			<DragIndicator {...attributes} {...listeners} />
			<p style={{ flexGrow: 1 }}>{props.ticker.text}</p>
			<RedButton variant="contained" onClick={props.removeFunc}>
				<Delete />
			</RedButton>
		</TickerItem>
	);
}

interface HeadlineItemProps {
	headline: Headline;
	removeFunc: () => void;
	showFunc: () => void;
	showing: boolean;
}

function HeadlineItem(props: HeadlineItemProps) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.headline.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div ref={setNodeRef} style={style}>
			<TickerItem>
				<DragIndicator {...attributes} {...listeners} />
				<p style={{ flexGrow: 1, fontWeight: props.showing ? "bold" : "normal" }}>{props.headline.text}</p>
				<RedButton variant="contained" onClick={props.removeFunc} disabled={props.showing}>
					<Delete />
				</RedButton>

				<GreenButton fullWidth variant="contained" onClick={props.showFunc} disabled={props.showing}>
					Show
				</GreenButton>
			</TickerItem>
		</div>
	);
}

interface Headline {
	id: UniqueIdentifier;
	text: string;
}

export const ASNNDash = () => {
	const [asnnHeadline, setAsnnHeadline] = useReplicant<string>("asnn:headline");
	const [asnnTicker, setAsnnTicker] = useReplicant<string[]>("asnn:ticker");
	const [headlineTextBox, setHeadlineTextBox] = useState("");
	const [headlineItems, setHeadlineItems] = useLocalStorage<Headline[]>("asnnHeadlines", []);
	const [tickerTextBox, setTickerTextBox] = useState("");
	const [ticker, setTicker] = useState<Ticker[]>([]);
	const [name, setName] = useState("");
	const [subtitle, setSubtitle] = useState("");

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	useEffect(() => {
		if (asnnHeadline && !headlineItems.find((item) => item.text === asnnHeadline)) {
			setHeadlineItems([{ id: crypto.randomUUID(), text: asnnHeadline }, ...headlineItems]);
		}
	}, [asnnHeadline, headlineItems, setHeadlineItems]);

	useEffect(() => {
		if (typeof asnnTicker === "undefined") return;

		const existingTickers = ticker.filter((t) => asnnTicker.includes(t.text));
		const newTickers = asnnTicker
			.filter((text) => !existingTickers.some((t) => t.text === text))
			.map((text) => ({ id: crypto.randomUUID(), text }));

		setTicker((prev) => [...prev, ...newTickers]);
	}, [asnnTicker]);

	function addNewHeadline() {
		if (!headlineTextBox || headlineTextBox.trim() === "") {
			return;
		}

		setHeadlineItems([...headlineItems, { id: crypto.randomUUID(), text: headlineTextBox }]);
		setHeadlineTextBox("");
	}

	function onDragEndTicker(event: DragEndEvent) {
		const getIndex = (id: UniqueIdentifier) => ticker.findIndex((item) => item.id === id);
		const { active, over } = event;

		if (over) {
			const overIndex = getIndex(over.id);
			const activeIndex = getIndex(active.id);
			if (activeIndex !== overIndex) {
				setTicker((items) => arrayMove(items, activeIndex, overIndex));
			}
		}
	}

	function onDragEndHeadlines(event: DragEndEvent) {
		const getIndex = (id: UniqueIdentifier) => headlineItems.findIndex((item) => item.id === id);
		const { active, over } = event;

		if (over) {
			const overIndex = getIndex(over.id);
			const activeIndex = getIndex(active.id);
			if (activeIndex !== overIndex) {
				setHeadlineItems((items) => arrayMove(items, activeIndex, overIndex));
			}
		}
	}
	const isTickerElementsAndRealTickerEqual =
		asnnTicker?.length === ticker.length && asnnTicker?.every((t, idx) => ticker[idx]?.text === t);

	return (
		<ThemeProvider theme={darkTheme}>
			<ASNNDashContainer>
				<Row>
					<TextField fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} />
					<TextField
						fullWidth
						label="Subtitle"
						value={subtitle}
						onChange={(e) => setSubtitle(e.target.value)}
					/>
				</Row>
				<Row>
					<GreenButton
						variant="contained"
						fullWidth
						onClick={() => nodecg.sendMessage("asnn:showName", { name: name, subtitle: subtitle })}>
						Show Name
					</GreenButton>
					<RedButton variant="contained" fullWidth onClick={() => nodecg.sendMessage("asnn:hideName")}>
						Hide Name
					</RedButton>
				</Row>
				<hr style={{ margin: "24px 0" }} />
				<Row>
					<TextField
						fullWidth
						label="Headline"
						value={headlineTextBox}
						onChange={(e) => setHeadlineTextBox(e.target.value)}
					/>
					<GreenButton variant="contained" onClick={addNewHeadline} disabled={!headlineTextBox}>
						Add
					</GreenButton>
				</Row>

				<TickerListContainer>
					<DndContext onDragEnd={onDragEndHeadlines} sensors={sensors} modifiers={[restrictToVerticalAxis]}>
						<SortableContext items={headlineItems} strategy={verticalListSortingStrategy}>
							{headlineItems.map((item) => (
								<HeadlineItem
									key={item.id}
									headline={item}
									showFunc={() => setAsnnHeadline(item.text)}
									removeFunc={() => setHeadlineItems(headlineItems.filter((i) => i.id !== item.id))}
									showing={asnnHeadline === item.text}
								/>
							))}
						</SortableContext>
					</DndContext>
				</TickerListContainer>
				<hr style={{ margin: "24px 0" }} />
				<Row>
					<TextField
						fullWidth
						label="Ticker"
						value={tickerTextBox}
						onChange={(e) => setTickerTextBox(e.target.value)}
					/>
					<Button
						variant="contained"
						onClick={() => {
							setTicker([...ticker, { id: crypto.randomUUID(), text: tickerTextBox }]);
							setTickerTextBox("");
						}}
						disabled={!tickerTextBox}>
						Add
					</Button>
				</Row>

				<TickerListContainer>
					<DndContext onDragEnd={onDragEndTicker} sensors={sensors} modifiers={[restrictToVerticalAxis]}>
						<SortableContext items={ticker} strategy={verticalListSortingStrategy}>
							{ticker.map((item) => (
								<Ticker
									key={item.id}
									ticker={item}
									removeFunc={() => setTicker(ticker.filter((i) => i.id !== item.id))}
								/>
							))}
						</SortableContext>
					</DndContext>
				</TickerListContainer>
				<GreenButton
					fullWidth
					variant="contained"
					onClick={() => setAsnnTicker(ticker.map((i) => i.text))}
					disabled={isTickerElementsAndRealTickerEqual}>
					Update Ticker
				</GreenButton>
			</ASNNDashContainer>
		</ThemeProvider>
	);
};

createRoot(document.getElementById("root")!).render(<ASNNDash />);
