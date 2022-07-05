import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Standard2 } from '../overlays/standard-2';
import { DefaultPlayer, DefaultTimer } from './defaults';

export default {
	title: 'Overlay/Standard 4:3 2P',
	component: Standard2,
} as ComponentMeta<typeof Standard2>;

const Template: ComponentStory<typeof Standard2> = (args) => <Standard2 {...args} />;

export const Primary = Template.bind({});

Primary.args = {
	noCam: { current: false, preview: false },
	preview: false,
	couchInformation: { current: [{ name: 'Couch 1', pronouns: 'He/Him' }], preview: [] },
	runData: {
		game: 'Long Game Title',
		category: 'Any%',
		estimate: '1:00:00',
		release: '2000',
		system: 'SNES',
		id: '',
		teams: [
			{ players: [DefaultPlayer], name: '', id: '0' },
			{ players: [{ ...DefaultPlayer, id: '1' }], name: '', id: '1' },
		],
		customData: {},
	},
	audioIndicator: '0',
	sponsors: [],
	timer: DefaultTimer,
};
