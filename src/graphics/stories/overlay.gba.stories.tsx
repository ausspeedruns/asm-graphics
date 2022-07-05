import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { GBA } from '../overlays/gba';
import { DefaultOverlay } from './defaults';

export default {
	title: 'Overlay/GBA 3:2',
	component: GBA,
} as ComponentMeta<typeof GBA>;

const Template: ComponentStory<typeof GBA> = (args) => <GBA {...args} />;

export const Primary = Template.bind({});

Primary.args = DefaultOverlay;
