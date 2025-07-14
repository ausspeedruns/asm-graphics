import styled from "styled-components";

export const SectionStyles = `
	border: 2px solid var(--plastic-top);
	border-radius: 22px;

	box-shadow:
		2px 2px 3px rgba(217, 211, 224, 0.34),
		inset 2px 2px 3px rgba(217, 211, 224, 0.34),
		-2px -2px 3px rgba(68, 42, 105, 0.77),
		inset -2px -2px 3px rgba(68, 42, 105, 0.77);

	backdrop-filter: blur(5px);`;

export const SectionReactStyles = {
	border: "2px solid var(--plastic-top)",
	borderRadius: "22px",

	boxShadow: `
		2px 2px 3px rgba(217, 211, 224, 0.34),
		inset 2px 2px 3px rgba(217, 211, 224, 0.34),
		-2px -2px 3px rgba(49, 49, 49, 0.77),
		inset -2px -2px 3px rgba(49, 49, 49, 0.77)`,

	backdropFilter: "blur(5px)",
};

const SectionContainer = styled.div`
	${SectionStyles}
`;

interface SectionProps {
	style?: React.CSSProperties;
	children?: React.ReactNode;
}

export function Section(props: SectionProps) {
	return <SectionContainer style={props.style}>{props.children}</SectionContainer>;
}
