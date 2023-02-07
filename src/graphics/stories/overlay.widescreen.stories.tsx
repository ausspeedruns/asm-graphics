import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Widescreen } from '../overlays/widescreen';
import { DefaultOverlay, DefaultPlayer } from './defaults';

export default {
	title: 'Overlay/Widesceeen 16:9',
	component: Widescreen,
} as ComponentMeta<typeof Widescreen>;

const Template: ComponentStory<typeof Widescreen> = (args) => <Widescreen {...args} />;

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
		id: '',
		teams: [{ players: [DefaultPlayer, { ...DefaultPlayer, pronouns: '' }], name: '', id: '0' }],
	},
};

CoopBothPronouns.args = {
	...DefaultOverlay,
	runData: {
		...DefaultOverlay.runData,
		customData: {},
		id: '',
		teams: [{ players: [DefaultPlayer, DefaultPlayer], name: '', id: '0' }],
	},
};

CoopNoPronouns.args = {
	...DefaultOverlay,
	runData: {
		...DefaultOverlay.runData,
		customData: {},
		id: '',
		teams: [
			{
				players: [
					{ ...DefaultPlayer, pronouns: '' },
					{ ...DefaultPlayer, pronouns: '' },
				],
				name: '',
				id: '0',
			},
		],
	},
};
