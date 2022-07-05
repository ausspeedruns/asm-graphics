import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { RaceFinish } from '../elements/race-finish';

export default {
	title: 'Race Finish',
	component: RaceFinish,
} as ComponentMeta<typeof RaceFinish>;

const Template: ComponentStory<typeof RaceFinish> = (args) => <RaceFinish {...args} />;

export const Primary = Template.bind({});

Primary.args = {
	place: 1,
	time: '12:34:56',
};
