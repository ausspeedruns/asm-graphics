import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { WideInfo } from "../elements/info-box/wide";
import { DefaultTimer } from "./defaults";

export default {
	title: "Info Box/Wide",
	component: WideInfo,
} as ComponentMeta<typeof WideInfo>;

const Template: ComponentStory<typeof WideInfo> = (args) => (
	<div style={{ maxWidth: 600 }}>
		<WideInfo {...args} />
	</div>
);

export const Primary = Template.bind({});

Primary.args = {
	runData: {
		game: "Long Game Title",
		category: "Any%",
		estimate: "1:00:00",
		release: "2000",
		system: "SNES",
		id: "",
		teams: [],
		customData: {},
	},
	timer: DefaultTimer,
};
