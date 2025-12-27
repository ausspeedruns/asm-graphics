import { VisibilityOff, Visibility } from "@mui/icons-material";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { useState } from "react";

interface PasswordFieldProps {
	label: string;
	value: string;
	onChange: (newValue: string) => void;
}

export function PasswordField(props: PasswordFieldProps) {
	const [showPassword, setShowPassword] = useState(false);
	return (
		<TextField
			label={props.label}
			type={showPassword ? "text" : "password"}
			fullWidth
			margin="dense"
			value={props.value}
			onChange={(e) => props.onChange(e.target.value)}
			slotProps={{
				input: {
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								aria-label={showPassword ? "hide the password" : "display the password"}
								onClick={() => setShowPassword(!showPassword)}
								edge="end"
							>
								{showPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					),
				},
			}}
		/>
	);
}
