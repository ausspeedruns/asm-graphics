import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { IntermissionElement } from '../intermission';
import { DefaultPlayer } from './defaults';

export default {
	title: 'Intermission',
	component: IntermissionElement,
} as ComponentMeta<typeof IntermissionElement>;

const Template: ComponentStory<typeof IntermissionElement> = (args) => <IntermissionElement {...args} />;

export const Primary = Template.bind({});

Primary.args = {
	activeRun: {
		game: 'Test Game Name 1',
		category: 'Any%',
		estimate: '02:00:00',
		teams: [{ id: '0', players: [DefaultPlayer] }],
		system: 'PC',
		id: '0',
		customData: {},
	},
	muted: true,
	runArray: [
		{
			game: 'Test Game Name 1',
			category: 'Any%',
			estimate: '02:00:00',
			teams: [{ id: '0', players: [DefaultPlayer] }],
			system: 'PC',
			id: '0',
			customData: {},
		},
		{
			game: 'Test Game Name 2',
			category: 'Any%',
			estimate: '02:00:00',
			teams: [{ id: '0', players: [DefaultPlayer] }],
			system: 'PC',
			id: '1',
			customData: {},
		},
		{
			game: 'Test Game Name 3',
			category: 'Any%',
			estimate: '02:00:00',
			teams: [{ id: '0', players: [DefaultPlayer] }],
			system: 'PC',
			id: '2',
			customData: {},
		},
		{
			game: 'Test Game Name 4',
			category: 'Any%',
			estimate: '02:00:00',
			teams: [{ id: '0', players: [DefaultPlayer] }],
			system: 'PC',
			id: '3',
			customData: {},
		},
	],
	host: { name: 'Clubwho', pronouns: 'He/Him', host: true },
	incentives: [
		{
			game: 'Test Game Title',
			incentive: 'Test the Goals',
			notes: 'Test goal notes',
			active: true,
			index: 0,
			goal: 100,
			total: 50,
			type: 'Goal',
		},
		{
			game: 'Test Game Title',
			incentive: 'Test the War',
			notes: 'Test war notes',
			active: true,
			index: 0,
			type: 'War',
			options: [
				{
					name: 'Name 1',
					total: 100,
				},
				{
					name: 'Name 2',
					total: 120,
				},
				{
					name: 'Name 3',
					total: 10,
				},
				{
					name: 'Name 4',
					total: 0,
				},
			],
		},
	],
};
