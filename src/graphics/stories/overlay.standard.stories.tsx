import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Standard } from "../overlays/standard";
import { DefaultOverlay, DefaultPlayer } from "./defaults";

export default {
	title: "Overlay/Standard 4:3",
	component: Standard,
} as ComponentMeta<typeof Standard>;

const Template: ComponentStory<typeof Standard> = (args) => <Standard {...args} />;

export const Primary = Template.bind({});
export const Coop = Template.bind({});
export const CoopBothPronouns = Template.bind({});
export const CoopNoPronouns = Template.bind({});

Primary.args = DefaultOverlay;
Coop.args = {
	...DefaultOverlay,
	runData: {
		...DefaultOverlay.runData,
		customData: {},
		id: "",
		teams: [{ players: [DefaultPlayer, { ...DefaultPlayer, pronouns: "" }], name: "", id: "0" }],
	},
};

CoopBothPronouns.args = {
	...DefaultOverlay,
	runData: {
		...DefaultOverlay.runData,
		customData: {},
		id: "",
		teams: [{ players: [DefaultPlayer, DefaultPlayer], name: "", id: "0" }],
	},
};

CoopNoPronouns.args = {
	...DefaultOverlay,
	runData: {
		...DefaultOverlay.runData,
		customData: {},
		id: "",
		teams: [
			{
				players: [
					{ ...DefaultPlayer, pronouns: "" },
					{ ...DefaultPlayer, pronouns: "" },
				],
				name: "",
				id: "0",
			},
		],
	},
};
