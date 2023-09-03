import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Tweet } from "../elements/tweet";

export default {
	title: "Tweet",
	component: Tweet,
} as ComponentMeta<typeof Tweet>;

const Template: ComponentStory<typeof Tweet> = (args) => (
	// <div >
	<Tweet {...args} style={{ height: 200, width: 400 }} />
	// </div>
);

export const Primary = Template.bind({});

Primary.args = {
	tweet: {
		data: {
			authorID: "105261155",
			id: "1317382179320627201",
			created_at: "2020-10-26T07:17:29.000Z",
			text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis lacinia nisl nulla, vitae tempus augue tincidunt sed. In eget enim eu nibh semper faucibus id at mauris. Integer posuere tempor magna vel vestibulum. In placerat purus magna, non porttitor lacus dapibus id. V #ASAP2022",
		},
		includes: { users: [{ id: "105261155", name: "Ewan Lyon", username: "Clubwhom" }] },
		matchingRules: [{ id: 1, tag: "Event Hashtag" }],
	},
};
