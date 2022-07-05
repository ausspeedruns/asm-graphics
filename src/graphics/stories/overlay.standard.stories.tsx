import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Standard } from '../overlays/standard';
import { DefaultOverlay } from './defaults';

export default {
	title: 'Overlay/Standard 4:3',
	component: Standard,
} as ComponentMeta<typeof Standard>;

const Template: ComponentStory<typeof Standard> = (args) => <Standard {...args} />;

export const Primary = Template.bind({});

Primary.args = DefaultOverlay;
