import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import { Couch } from "../elements/couch";

export default {
	title: "Couch",
	component: Couch,
} as Meta<typeof Couch>;

const Template: StoryFn<typeof Couch> = (args) => <Couch {...args} />;

export const Primary = Template.bind({});

Primary.args = {
	commentators: [
		{ id: "com1", name: "Couch 1", pronouns: "He/Him" },
		{ id: "com2", name: "Couch 2", pronouns: "She/Her" },
		{ id: "com3", name: "Couch 3", pronouns: "" },
	],
	host: { id: "host", name: "Host", pronouns: "They/Them" },
	audio: { MARIO_RED: true },
};
