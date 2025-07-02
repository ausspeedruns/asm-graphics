import React from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";

import { BrowserRouter, Route, Routes } from "react-router";
import { ASMStream } from "./elements/individual-stream";

const StreamContainer = styled.div``;

const Streams = ["asm_station1", "asm_station2", "asm_station3", "asm_station4"];

export const Stream: React.FC = () => {
	const StreamElements = Streams.map((stream) => {
		return (
			<Route path={`/${stream}`} key={stream}>
				<ASMStream channel={stream} size="whole" />
			</Route>
		);
	});

	return (
		<StreamContainer>
			<BrowserRouter>
				<Routes>{StreamElements}</Routes>
			</BrowserRouter>
		</StreamContainer>
	);
};

createRoot(document.getElementById("root")!).render(<Stream />);
