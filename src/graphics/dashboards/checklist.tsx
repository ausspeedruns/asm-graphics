import React, { useState } from 'react';
import styled from 'styled-components';

import { FormControlLabel, Grid } from '@material-ui/core';
import { GreenCheckbox } from '../../dashboard/elements/styled-ui';

const ChecklistContainer = styled.div``;

export const Checklist: React.FC = () => {
	return (
		<ChecklistContainer>
			<Grid container>
				<Grid direction="column" container item xs>
					<ChecklistItem name="No Clipping" />
					<ChecklistItem name="Runner audio" />
					<ChecklistItem name="Camera" />
				</Grid>
				<Grid direction="column" container item xs></Grid>
			</Grid>
		</ChecklistContainer>
	);
};

/* Single Checklist Item */

const ChecklistItemContainer = styled.div`
	border-radius: 8px;
	margin: 4px;
	padding-left: 8px;
	box-sizing: border-box;
	border: 1px solid ${(props: Checked) => (props.checked ? '#9bd279' : 'black')};
	${(props: Checked) => (props.checked ? 'background-color: #9bd279;' : '')}
`;

interface ItemProps {
	name: string;
}

interface Checked {
	checked: boolean;
}

const ChecklistItem: React.FC<ItemProps> = (props: ItemProps) => {
	const [checked, setChecked] = useState(false);

	const changeEventHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChecked(event.target.checked);
	};

	return (
		<ChecklistItemContainer checked={checked}>
			<FormControlLabel
				style={{ width: '100%' }}
				control={<GreenCheckbox checked={checked} onChange={changeEventHandler} />}
				label={props.name}
			/>
		</ChecklistItemContainer>
	);
};
