import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import styled from 'styled-components';
import { Button, TextField, ThemeProvider } from '@mui/material';
import { darkTheme } from './theme';
import { useReplicant } from 'use-nodecg';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { GreenButton, RedButton } from './elements/styled-ui';
import { DragIndicator } from '@mui/icons-material';
import { useLocalStorage } from './useLocalStorage';

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

function Reorder<T>(list: Iterable<T> | ArrayLike<T>, startIndex: number, endIndex: number) {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
}

function Ticker({ text, index, removeFunc }: { text: string; index: number; removeFunc: () => void }) {
	return (
		<Draggable draggableId={text} index={index}>
			{(provided) => (
				<TickerItem ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
					<DragIndicator />
					<p style={{ flexGrow: 1 }}>{text}</p>
					<RedButton variant="contained" onClick={removeFunc}>
						–
					</RedButton>
				</TickerItem>
			)}
		</Draggable>
	);
}

function TickerList({
	texts,
	setState,
}: {
	texts: string[];
	setState: React.Dispatch<React.SetStateAction<string[]>>;
}) {
	return texts.map((text, index) => (
		<Ticker text={text} index={index} key={text} removeFunc={() => setState(texts.filter((el) => el !== text))} />
	));
}

function HeadlineItem({
	text,
	index,
	removeFunc,
	showFunc,
	showing,
}: {
	text: string;
	index: number;
	removeFunc: () => void;
	showFunc: () => void;
	showing: boolean;
}) {
	return (
		<Draggable draggableId={text} index={index}>
			{(provided) => (
				<TickerItem ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
					<DragIndicator />
					<p style={{ flexGrow: 1, fontWeight: showing ? 'bold' : 'normal' }}>{text}</p>
					<RedButton variant="contained" onClick={removeFunc} disabled={showing}>
						–
					</RedButton>

					<GreenButton fullWidth variant="contained" onClick={showFunc} disabled={showing}>
						Show
					</GreenButton>
				</TickerItem>
			)}
		</Draggable>
	);
}

function HeadlineList({
	texts,
	setState,
	showFunc,
	currentState,
}: {
	texts: string[];
	setState: (newValue: string[]) => void;
	showFunc: (newValue: string) => void;
	currentState: string;
}) {
	return texts.map((text, index) => (
		<HeadlineItem
			text={text}
			index={index}
			key={text}
			removeFunc={() => setState(texts.filter((el) => el !== text))}
			showFunc={() => showFunc(text)}
			showing={currentState == text}
		/>
	));
}

export const ASNNDash = () => {
	const [asnnHeadline, setAsnnHeadline] = useReplicant<string>('asnn:headline', '');
	const [asnnTicker, setAsnnTicker] = useReplicant<string[]>('asnn:ticker', []);
	const [headlineTextBox, setHeadlineTextBox] = useState('');
	const [headlineItems, setHeadlineItems] = useLocalStorage<string[]>('asnnHeadlines', []);
	const [tickerTextBox, setTickerTextBox] = useState('');
	const [ticker, setTicker] = useState<string[]>([]);
	const [name, setName] = useState('');
	const [subtitle, setSubtitle] = useState('');

	useEffect(() => {
		if (asnnHeadline && !headlineItems.includes(asnnHeadline)) {
			setHeadlineItems([asnnHeadline, ...headlineItems]);
		}
	}, [asnnHeadline, headlineItems]);

	useEffect(() => {
		setTicker(asnnTicker);
	}, [asnnTicker]);

	function onDragEndTicker(result: DropResult) {
		if (!result.destination) {
			return;
		}

		if (result.destination.index === result.source.index) {
			return;
		}

		const newTicker = Reorder(ticker, result.source.index, result.destination.index);

		setTicker(newTicker);
	}

	function onDragEndHeadlines(result: DropResult) {
		if (!result.destination) {
			return;
		}

		if (result.destination.index === result.source.index) {
			return;
		}

		const newHeadlineItems = Reorder(headlineItems, result.source.index, result.destination.index);

		setHeadlineItems(newHeadlineItems);
	}

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
						onClick={() => nodecg.sendMessage('asnn:showName', { name: name, subtitle: subtitle })}>
						Show Name
					</GreenButton>
					<RedButton variant="contained" fullWidth onClick={() => nodecg.sendMessage('asnn:hideName')}>
						Hide Name
					</RedButton>
				</Row>
				<hr style={{ margin: '24px 0' }} />
				<Row>
					<TextField
						fullWidth
						label="Headline"
						value={headlineTextBox}
						onChange={(e) => setHeadlineTextBox(e.target.value)}
					/>
					<GreenButton
						variant="contained"
						onClick={() => {
							setHeadlineItems([...headlineItems, headlineTextBox]);
							setHeadlineTextBox('');
						}}
						disabled={!headlineTextBox}>
						Add
					</GreenButton>
				</Row>

				<TickerListContainer>
					<DragDropContext onDragEnd={onDragEndHeadlines}>
						<Droppable droppableId="list">
							{(provided) => (
								<div ref={provided.innerRef} {...provided.droppableProps}>
									<HeadlineList
										texts={headlineItems}
										setState={setHeadlineItems}
										showFunc={setAsnnHeadline}
										currentState={asnnHeadline}
									/>
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</DragDropContext>
				</TickerListContainer>
				<hr style={{ margin: '24px 0' }} />
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
							setTicker([...ticker, tickerTextBox]);
							setTickerTextBox('');
						}}
						disabled={!tickerTextBox}>
						Add
					</Button>
				</Row>

				<TickerListContainer>
					<DragDropContext onDragEnd={onDragEndTicker}>
						<Droppable droppableId="list">
							{(provided) => (
								<div ref={provided.innerRef} {...provided.droppableProps}>
									<TickerList texts={ticker} setState={setTicker} />
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</DragDropContext>
				</TickerListContainer>
				<GreenButton
					fullWidth
					variant="contained"
					onClick={() => setAsnnTicker(ticker)}
					disabled={asnnTicker == ticker}>
					Update Ticker
				</GreenButton>
			</ASNNDashContainer>
		</ThemeProvider>
	);
};

createRoot(document.getElementById('root')!).render(<ASNNDash />);
