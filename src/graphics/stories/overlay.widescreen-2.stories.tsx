import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Widescreen2 } from '../overlays/widescreen-2';
import { DefaultPlayer, DefaultTimer } from './defaults';

export default {
	title: 'Overlay/Widescreen 16:9 2P',
	component: Widescreen2,
} as ComponentMeta<typeof Widescreen2>;

const Template: ComponentStory<typeof Widescreen2> = (args) => <Widescreen2 {...args} />;

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
