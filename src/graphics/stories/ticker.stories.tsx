import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Ticker, TickerProps } from '../elements/ticker';
import { DefaultPlayer } from './defaults';

export default {
	title: 'Ticker',
	component: Ticker,
	argTypes: {
		donationAmount: { control: { type: 'range', min: 0, max: 100000, step: 1 } }
	}
} as ComponentMeta<typeof Ticker>;

const Template: ComponentStory<typeof Ticker> = (args) => <Ticker {...args} />;

const baseArgs: Omit<TickerProps, 'tickerOrder'> = {
	donationAmount: 10000,
	runDataActive: {
		game: 'Long Game Title 1',
		category: 'Any%',
		estimate: '1:00:00',
		release: '2000',
		system: 'SNES',
		id: '0',
		teams: [{ players: [DefaultPlayer], name: '', id: '0' }],
		customData: {},
	},
	runDataArray: [
		{
			game: 'Long Game Title 1',
			category: 'Any%',
			estimate: '1:00:00',
			release: '2000',
			system: 'SNES',
			id: '0',
			teams: [{ players: [DefaultPlayer], name: '', id: '0' }],
			customData: {},
		},
		{
			game: 'Long Game Title 2',
			category: 'Any%',
			estimate: '1:00:00',
			release: '2000',
			system: 'SNES',
			id: '1',
			teams: [{ players: [DefaultPlayer], name: '', id: '0' }],
			customData: {},
		},
		{
			game: 'Long Game Title 3',
			category: 'Any%',
			estimate: '1:00:00',
			release: '2000',
			system: 'SNES',
			id: '2',
			teams: [{ players: [DefaultPlayer], name: '', id: '0' }],
			customData: {},
		},
		{
			game: 'Long Game Title 4',
			category: 'Any%',
			estimate: '1:00:00',
			release: '2000',
			system: 'SNES',
			id: '3',
			teams: [{ players: [DefaultPlayer], name: '', id: '0' }],
			customData: {},
		},
		{
			game: 'Long Game Title 5',
			category: 'Any%',
			estimate: '1:00:00',
			release: '2000',
			system: 'SNES',
			id: '4',
			teams: [{ players: [DefaultPlayer], name: '', id: '0' }],
			customData: {},
		},
	],
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

export const Primary = Template.bind({});
Primary.args = {
	...baseArgs,
	tickerOrder: [
		{ type: 'cta' },
		{ type: 'nextruns' },
		{ type: 'goals' },
		{ type: 'wars' },
		{ type: 'prizes' },
		{ type: 'milestone' },
	],
};

export const CTA = Template.bind({});
CTA.args = {
	...baseArgs,
	tickerOrder: [{ type: 'cta' }],
};

export const NextRuns = Template.bind({});
NextRuns.args = {
	...baseArgs,
	tickerOrder: [{ type: 'nextruns' }],
};

export const Goals = Template.bind({});
Goals.args = {
	...baseArgs,
	tickerOrder: [{ type: 'goals' }],
};

export const Wars = Template.bind({});
Wars.args = {
	...baseArgs,
	tickerOrder: [{ type: 'wars' }],
};

export const Prizes = Template.bind({});
Prizes.args = {
	...baseArgs,
	tickerOrder: [{ type: 'prizes' }],
};

export const Milestone = Template.bind({});
Milestone.args = {
	...baseArgs,
	tickerOrder: [{ type: 'milestone' }],
};

export const NoItems = Template.bind({});
NoItems.args = {
	...baseArgs,
	tickerOrder: [],
};
