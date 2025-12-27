import { FormGroup, TextField, Button } from "@mui/material";
import { useReplicant } from "@nodecg/react-hooks";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const MelbourneAoC = `AusSpeedruns acknowledges the traditional owners of the lands on which we are gathered for this event, the Wurundjeri Woi Wurrung people of the Kulin Nation, and their continued connection to Country. We pay our respects to their elders past and present, and extend that respect any First Nations people in attendance today. AusSpeedruns also acknowledges the traditional owners of the many lands, waterways and ecosystems on which our viewers from home are joining us.`;

const AdelaideAoC = `AusSpeedruns acknowledges the traditional owners of the lands on which we are gathered for this event, the Kaurna people, and their continued connection to Country. We pay our respects to their elders past and present, and extend that respect any First Nations people in attendance today. AusSpeedruns also acknowledges the traditional owners of the many lands, waterways and ecosystems on which our viewers from home are joining us.`;

export function AcknowledgementOfCountry() {
	const [acknowledgementRep, setAcknowledgementRep] = useReplicant("acknowledgementOfCountry");

	return (
		<div>
			<h3>Acknowledgement of Country</h3>
			<FormGroup>
				<TextField
					label="Acknowledgement of Country"
					multiline
					minRows={4}
					fullWidth
					value={acknowledgementRep ?? ""}
					onChange={(e) => setAcknowledgementRep(e.target.value)}
				/>
				<div style={{ display: "flex", marginTop: "8px", gap: "8px" }}>
					<Button onClick={() => setAcknowledgementRep(MelbourneAoC)} fullWidth>
						Melbourne
					</Button>
					<Button onClick={() => setAcknowledgementRep(AdelaideAoC)} fullWidth>
						Adelaide
					</Button>
				</div>
			</FormGroup>
		</div>
	);
}
