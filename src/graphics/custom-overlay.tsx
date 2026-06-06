import { createRoot } from "react-dom/client";
import { RenderNode } from "./overlays/custom/custom";
import { useOverlayStore } from "./stores/overlay-store";

const testTree = {
	name: "Standard",
	element: "root",
	children: [
		{
			element: "container",
			attributes: {
				direction: "vertical",
			},
			children: [
				{
					element: "facecam",
					transform: {
						height: 352,
					},
					attributes: {
						verticalCoop: true,
					},
				},
				{
					element: "container",
					attributes: {
						direction: "vertical",
					},
					children: [
						{
							element: "couch",
							attributes: {
								direction: "horizontal",
							},
						},
						{
							element: "run-info",
							attributes: {
								type: "vertical",
							},
						},
						{
							element: "container",
							attributes: {
								flexGrow: 1,
							},
						},
						{
							element: "sponsors",
							attributes: {
								sponsorHeight: 125,
								sponsorWidth: 480,
							},
						},
					],
				},
			],
		},
		{
			element: "game",
			attributes: {
				// aspectRatio: 1,
				aspectRatio: 1.33,
			},
		},
	],
};

export function CustomOverlay() {
	return <RenderNode node={testTree} />;
}

createRoot(document.getElementById("root")!).render(<CustomOverlay />);
