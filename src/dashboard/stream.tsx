import React from "react";
import { createRoot } from "react-dom/client";

import { NoMargin } from "./elements/no-margin";

// @ts-ignore
// import { TwitchPlayer } from 'react-twitch-embed';

const TWITCHPARENTS = nodecg.bundleConfig.twitch.parents;

const Stream: React.FC = () => {
	return (
		<>
			<NoMargin />
			{/* <TwitchPlayer channel="ausspeedruns" parents={TWITCHPARENTS} width={416} height={234} /> */}
		</>
	);
};

createRoot(document.getElementById("root")!).render(<Stream />);
