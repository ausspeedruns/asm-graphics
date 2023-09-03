import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Nameplate } from "../elements/nameplate";

export default {
	title: "Nameplate",
	component: Nameplate,
	argTypes: {
		speakingValue: { control: { type: "range", min: -40, max: 10, step: 0.1 } },
	},
} as ComponentMeta<typeof Nameplate>;

const Template: ComponentStory<typeof Nameplate> = (args) => (
	<div style={{ maxWidth: 400 }}>
		<Nameplate {...args} />
	</div>
);

export const Primary = Template.bind({});

Primary.args = {
	player: {
		name: "TestName",
		pronouns: "He/Him",
		social: {
			twitch: "TestTwitch",
		},
		country: "AU",
		teamID: "0",
		customData: {},
		id: "0",
	},
	nameplateLeft: false,
	maxWidth: 400,
	speaking: false,
};
