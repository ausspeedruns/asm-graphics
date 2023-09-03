import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { VerticalInfo } from "../elements/info-box/vertical";
import { DefaultTimer } from "./defaults";

export default {
	title: "Info Box/Vertical",
	component: VerticalInfo,
} as ComponentMeta<typeof VerticalInfo>;

const Template: ComponentStory<typeof VerticalInfo> = (args) => (
	<div style={{ maxWidth: 600 }}>
		<VerticalInfo {...args} />
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
