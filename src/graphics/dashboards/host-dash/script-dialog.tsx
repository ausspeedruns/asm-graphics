import { styled as muiStyled, useColorScheme } from "@mui/material/styles";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	type DialogProps,
	DialogTitle,
	Tab,
} from "@mui/material";
import { useReplicant } from "@nodecg/react-hooks";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Markdown from "react-markdown";

import RemarkGithubAlerts from "remark-github-alerts";
import "remark-github-alerts/styles/github-colors-light.css";
import "remark-github-alerts/styles/github-colors-dark-class.css";

import type { HostRead } from "../../../extensions/host-reads";
import type { IntermissionVideo } from "@asm-graphics/shared/IntermissionVideo";

const Container = styled.div`
	font-family: var(--main-font);
	font-weight: normal;

	blockquote {
		border-left: 4px solid var(--asm-orange);
		padding: 16px;
	}
`;

const HostDashTab = muiStyled(Tab)({
	fontWeight: "bold",
	"&.Mui-selected": {
		color: "white",
		background: "var(--asm-orange)",
	},
	transition: "background-color 0.25s, color 0.25s",
});

const HostDashTabList = muiStyled(TabList)({
	borderBottom: "1px solid var(--asm-orange)",
});

interface ScriptDialogProps extends DialogProps {
	playAd: (name: string, length: number) => void;
}

export function ScriptDialog(props: ScriptDialogProps) {
	const { mode } = useColorScheme();
	const [hostReadsRep] = useReplicant<HostRead[]>("host-reads");
	const [intermissionVideosRep] = useReplicant<IntermissionVideo[]>("intermission-videos");
	const [tab, setTab] = useState("");

	useEffect(() => {
		const initialHostRead = hostReadsRep?.[0];
		if (initialHostRead) {
			setTab(initialHostRead.id);
		}
	}, [hostReadsRep]);

	return (
		<Dialog
			maxWidth="md"
			fullWidth
			scroll="paper"
			sx={{ "& .MuiPaper-root": { height: "80%" } }}
			style={{ colorScheme: mode }}
			{...props}
		>
			<DialogTitle>Charity Scripts</DialogTitle>
			<DialogContent>
				<DialogContentText>
					<p>Video Ads</p>
					<div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
						{intermissionVideosRep?.map((video) => {
							if (!video.videoInfo) {
								return null;
							}

							const duration = Math.round(video.videoInfo.duration);

							return (
								<Button
									key={video.asset}
									variant="outlined"
									onClick={() => props.playAd(video.asset, duration)}
									style={{ textTransform: "none" }}
								>
									{video.displayName} ({duration}s)
								</Button>
							);
						})}
					</div>
					<hr />
					<div>
						<p>Scripts</p>
					</div>
					<Container style={{ flexGrow: 1 }}>
						<TabContext value={tab}>
							<HostDashTabList onChange={(_, newValue) => setTab(newValue)} aria-label="Scripts">
								{hostReadsRep?.map((read) => (
									<HostDashTab key={read.id} label={read.title} value={read.id} />
								))}
							</HostDashTabList>

							{hostReadsRep?.map((read) => (
								<TabPanel key={read.id} value={read.id} style={{ color: "var(--text-color)" }}>
									<Markdown remarkPlugins={[RemarkGithubAlerts]}>{read.content}</Markdown>
								</TabPanel>
							))}
						</TabContext>
					</Container>
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={(e) => props.onClose?.(e, "escapeKeyDown")} color="primary">
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};
