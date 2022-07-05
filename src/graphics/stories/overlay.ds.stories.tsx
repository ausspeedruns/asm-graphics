import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { DS } from '../overlays/ds';
import { DefaultOverlay } from './defaults';

export default {
	title: 'Overlay/DS (4:3 | 4:3)',
	component: DS,
} as ComponentMeta<typeof DS>;

const Template: ComponentStory<typeof DS> = (args) => <DS {...args} />;

export const Primary = Template.bind({});

Primary.args = DefaultOverlay;
