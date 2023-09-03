import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { SmallInfo } from "../elements/info-box/small";
import { DefaultTimer } from "./defaults";

export default {
	title: "Info Box/Small",
	component: SmallInfo,
} as ComponentMeta<typeof SmallInfo>;

const Template: ComponentStory<typeof SmallInfo> = (args) => (
	<div style={{ maxWidth: 600 }}>
		<SmallInfo {...args} />
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
