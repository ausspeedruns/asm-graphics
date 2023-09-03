import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Timer } from "../elements/timer";

export default {
	title: "Timer",
	component: Timer,
} as ComponentMeta<typeof Timer>;

const Template: ComponentStory<typeof Timer> = (args) => <Timer {...args} />;

export const Primary = Template.bind({});

Primary.args = {
	timer: {
		milliseconds: 45296700,
		state: "running",
		time: "12:34:56",
		timestamp: 0,
		teamFinishTimes: {},
	},
};
