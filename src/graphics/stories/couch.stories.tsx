import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Couch } from '../elements/couch';

export default {
	title: 'Couch',
	component: Couch,
} as ComponentMeta<typeof Couch>;

const Template: ComponentStory<typeof Couch> = (args) => <Couch {...args} />;

export const Primary = Template.bind({});

Primary.args = {
	couch: [
		{ name: 'Couch 1', pronouns: 'He/Him' },
		{ name: 'Couch 2', pronouns: 'She/Her' },
		{ name: 'Couch 3', pronouns: '' },
		{ name: 'Host', pronouns: 'They/Them', host: true },
	],
};
