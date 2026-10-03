import { Button } from "@base-ui/react";
import { useState } from "react";

export function TestNetwork() {
	const [testResult, setTestResult] = useState<string | null>(null);

	return (
		<div>
			<h1>Test Network</h1>
			<Button onClick={() => setTestResult("Test completed successfully")}>Run Test</Button>
			{testResult && <p>{testResult}</p>}
		</div>
	);
}