import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Widescreen } from '../overlays/widescreen';
import { DefaultOverlay } from './defaults';

export default {
	title: 'Overlay/Widesceeen 16:9',
	component: Widescreen,
} as ComponentMeta<typeof Widescreen>;

const Template: ComponentStory<typeof Widescreen> = (args) => <Widescreen {...args} />;

export const Primary = Template.bind({});

Primary.args = DefaultOverlay;
