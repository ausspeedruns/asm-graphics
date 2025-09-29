import { createRoot } from "react-dom/client";
import styled from "styled-components";
// import { useReplicant } from '@nodecg/react-hooks';
// import useCurrentRun from 'hooks/useCurrentRun';

const DashboardStageViewContainer = styled.div``;

export function DashboardStageView() {
	return <DashboardStageViewContainer></DashboardStageViewContainer>;
}

createRoot(document.getElementById("root")!).render(<DashboardStageView />);
