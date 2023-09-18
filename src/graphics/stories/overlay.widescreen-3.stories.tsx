import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import { Widescreen3 } from "../overlays/widescreen-3";
import { DefaultPlayer, DefaultTimer } from "./defaults";

export default {
	title: "Overlay/Widescreen 16:9 3P",
	component: Widescreen3,
} as Meta<typeof Widescreen3>;

const Template: StoryFn<typeof Widescreen3> = (args) => <Widescreen3 {...args} />;

export const Primary = Template.bind({});

Primary.args = {
	preview: false,
	commentators: [{ id: "Com1", name: "Couch 1", pronouns: "He/Him" }],
	runData: {
		game: "Kingdom Hearts 1.5",
		category: "Beginner any%",
		estimate: "03:00:00",
		release: "2017",
		system: "PlayStation 4",
		id: "",
		teams: [
			{ players: [DefaultPlayer], name: "", id: "0" },
			{ players: [{ ...DefaultPlayer, id: "1" }], name: "", id: "1" },
			{ players: [{ ...DefaultPlayer, id: "2" }], name: "", id: "2" },
		],
		customData: {},
	},
	audioIndicator: "0",
	sponsors: [],
	timer: DefaultTimer,
};
