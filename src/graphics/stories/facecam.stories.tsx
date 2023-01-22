import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Facecam } from '../elements/facecam';
import { DefaultPlayer } from './defaults';

export default {
	title: 'Facecam',
	component: Facecam,
} as ComponentMeta<typeof Facecam>;

const Template: ComponentStory<typeof Facecam> = (args) => <div style={{maxWidth: 550, border: '2px solid red'}}><Facecam {...args} /></div>;

export const Primary = Template.bind({});
Primary.args = {
	teams: [{ players: [DefaultPlayer], id: '0', name: '' }],
	height: 500,
	pronounStartSide: 'left',
	dontAlternatePronouns: false,
	noCam: false,
};

export const NoTwitch = Template.bind({});
NoTwitch.args = {
	teams: [{ players: [{ ...DefaultPlayer, social: { twitch: undefined } }], id: '0', name: '' }],
	height: 500,
	pronounStartSide: 'left',
	dontAlternatePronouns: false,
	noCam: false,
};

export const TwitchNameSame = Template.bind({});
TwitchNameSame.args = {
	teams: [{ players: [{ ...DefaultPlayer, social: { twitch: DefaultPlayer.name } }], id: '0', name: '' }],
	height: 500,
	pronounStartSide: 'left',
	dontAlternatePronouns: false,
	noCam: false,
};

export const NoPronoun = Template.bind({});
NoPronoun.args = {
	teams: [{ players: [{ ...DefaultPlayer, pronouns: '' }], id: '0', name: '' }],
	height: 500,
	pronounStartSide: 'left',
	dontAlternatePronouns: false,
	noCam: false,
};

export const Two = Template.bind({});
Two.args = {
	teams: [{ players: [DefaultPlayer, { ...DefaultPlayer, id: '1' }], id: '0', name: '' }],
	height: 500,
	pronounStartSide: 'left',
	dontAlternatePronouns: false,
	noCam: false,
	audioIndicator: [{ id: '0', active: true, inputName: 'TestInput' }],
};

export const Three = Template.bind({});
Three.args = {
	teams: [
		{ players: [DefaultPlayer, { ...DefaultPlayer, id: '1' }, { ...DefaultPlayer, id: '2' }], id: '0', name: '' },
	],
	height: 500,
	pronounStartSide: 'left',
	dontAlternatePronouns: false,
	noCam: false,
};

export const Four = Template.bind({});
Four.args = {
	teams: [
		{
			players: [
				DefaultPlayer,
				{ ...DefaultPlayer, id: '1' },
				{ ...DefaultPlayer, id: '3' },
				{ ...DefaultPlayer, id: '4' },
			],
			id: '0',
			name: '',
		},
	],
	height: 500,
	pronounStartSide: 'left',
	dontAlternatePronouns: false,
	noCam: false,
};

export const Speaking = Template.bind({});
Speaking.args = {
	teams: [{ players: [DefaultPlayer], id: '0', name: '' }],
	height: 500,
	pronounStartSide: 'left',
	dontAlternatePronouns: false,
	noCam: false,
	audioIndicator: [{ id: '0', active: true, inputName: 'TestInput' }],
};
