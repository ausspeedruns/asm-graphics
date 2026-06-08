import { Couch } from "./components/couch";
import { Facecam } from "./components/facecam";
import { Container } from "./components/container";
import { Game } from "./components/game";
import { Sponsors } from "./components/sponsors";
import { RunInfo } from "./components/run-info";
import { Root } from "./components/root";

interface TreeNode {
	element: string;
	attributes?: Record<string, unknown>;
	style?: Record<string, unknown>;
	transform?: {
		width?: number;
		height?: number;
	};
	children?: TreeNode[];
}

export function RenderNode({ node }: { node: TreeNode }) {
	const { element, attributes, style, transform, children } = node;

	const Element = getElementByName(element);
	return (
		<Element style={{ ...style, width: transform?.width, height: transform?.height }} {...attributes}>
			{children?.map((child, index) => (
				<RenderNode key={index} node={child} />
			))}
		</Element>
	);
}

function getElementByName(name: string) {
	switch (name) {
		case "container":
			return Container;
		case "facecam":
			return Facecam;
		case "couch":
			return Couch;
		case "game":
			return Game;
		case "sponsors":
			return Sponsors;
		case "run-info":
			return RunInfo;
		case "root":
			return Root;
		default:
			return () => <div>Unknown element: {name}</div>;
	}
}
