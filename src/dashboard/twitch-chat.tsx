import React from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { NoMargin } from "./elements/no-margin";

const TwitchChatContainer = styled.div``;

export const TwitchChat: React.FC = () => {
	const twitchParents = nodecg.bundleConfig.twitch.parents;
	const parents = twitchParents
		.map((parent: string) => {
			return `&parent=${parent}`;
		})
		.join("");

	return (
		<TwitchChatContainer>
			<NoMargin />
			<iframe
				style={{ border: 0 }}
				height="500"
				width="416"
				id="twitchchat"
				src={`https://www.twitch.tv/embed/ausspeedruns/chat?${parents}&darkpopout`}
			></iframe>
		</TwitchChatContainer>
	);
};

createRoot(document.getElementById("root")!).render(<TwitchChat />);
