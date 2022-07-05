import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Widescreen3 } from '../overlays/widescreen-3';
import { DefaultPlayer, DefaultTimer } from './defaults';

export default {
	title: 'Overlay/Widescreen 16:9 3P',
	component: Widescreen3,
} as ComponentMeta<typeof Widescreen3>;

const Template: ComponentStory<typeof Widescreen3> = (args) => <Widescreen3 {...args} />;

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
			{ players: [{...DefaultPlayer, id: '1'}], name: '', id: '1' },
			{ players: [{...DefaultPlayer, id: '2'}], name: '', id: '2' },
		],
		customData: {},
	},
	audioIndicator: '0',
	sponsors: [],
	timer: DefaultTimer,
};
