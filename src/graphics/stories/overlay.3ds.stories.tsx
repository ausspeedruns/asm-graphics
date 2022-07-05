import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ThreeDS } from '../overlays/3ds';
import { DefaultOverlay } from './defaults';

export default {
	title: 'Overlay/3DS (5:3 | 4:3)',
	component: ThreeDS,
} as ComponentMeta<typeof ThreeDS>;

const Template: ComponentStory<typeof ThreeDS> = (args) => <ThreeDS {...args} />;

export const Primary = Template.bind({});

Primary.args = DefaultOverlay;
