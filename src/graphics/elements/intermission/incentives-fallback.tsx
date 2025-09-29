import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import gsap, { Power2 } from "gsap";

import AusSpeedrunsLogo from "../../media/AusSpeedruns-Logo.svg";
import TGXLogo from "../../media/ASGX23/TGXLogo-Wide-White.png";
import TwitterLogo from "../../media/icons/twitter.svg";
import YoutubeLogo from "../../media/icons/youtube.svg";
import WebsiteLogo from "../../media/icons/website.svg";
// import InstagramLogo from "../../media/instagram.svg";

const IncentivesFallbackContainer = styled.div`
	height: 100%;
	width: 100%;
	font-size: 35px;
`;

const Page = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
`;

// const ThankYou = styled(Page)`
// 	display: flex;
// 	flex-direction: column;
// 	justify-content: center;
// 	align-items: center;
// `;

// const NextEvent = styled(Page)`
// 	display: flex;
// 	flex-direction: column;
// 	justify-content: center;
// 	align-items: center;
// `;

// const NextEventLogo = styled.img`
// 	width: 55%;
// 	height: auto;
// 	/* margin-top: 8px; */
// `;

const Socials = styled(Page)`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-end;
`;

const SocialBox = styled.div`
	/* height: 86%; */
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	width: 73%;
`;

const SocialLogo = styled.img`
	width: auto;
	height: 60px;
	margin-top: 20px;
	/* margin-bottom: 6px; */
`;

const SocialLinks = styled.div`
	display: flex;
	flex-direction: row;
	/* flex-wrap: wrap; */
	width: 90%;
	justify-content: center;
`;

const SocialElement = styled.div`
	font-size: 28px;
	width: 100%;
	display: flex;
	align-items: center;
	margin-top: 12px;
	justify-content: center;
`;

const SocialImage = styled.img`
	width: 32px;
	height: auto;
	margin-right: 8px;
`;

const InterIncentASMMContainer = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: var(--text-light);
	font-size: 37px;
	overflow: hidden;
	padding: 10px 120px;
	box-sizing: border-box;
`;

const Header = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	/* height: 100%; */
	position: relative;
	text-align: center;
`;

const Total = styled.div`
	font-size: 80px;
	font-weight: bold;
	line-height: 95px;
`;

const KM = styled.span`
	font-size: 60px;
	font-weight: normal;
`;

const LearnMore = styled.div`
	font-size: 20px;
	font-weight: light;
`;

const Website = styled.span`
	/* font-weight: bold; */
	font-family: var(--secondary-font);
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
	asmm?: number;
}

// const PANEL_DURATIONS = 90;
export const InterIncentivesFallback = (props: Props) => {
	// const ThankYouRef = useRef<HTMLDivElement>(null);
	const SocialsRef = useRef<HTMLDivElement>(null);
	// const ASNNRef = useRef<HTMLDivElement>(null);
	// const ASNNDummyRef = useRef<HTMLDivElement>(null);
	// const [asnnValue, setASNNValue] = useState(0);

	// const runLoop = useCallback(() => {
	// 	const localTl = gsap.timeline({ onComplete: runLoop });

	// 	// localTl.to(ThankYouRef.current, { opacity: 1, duration: 1 });
	// 	// localTl.to(ThankYouRef.current, { opacity: 0, duration: 1 }, `+=${PANEL_DURATIONS}`);

	// 	localTl.to(SocialsRef.current, { opacity: 1, duration: 1 });
	// 	localTl.to(SocialsRef.current, { opacity: 0, duration: 1 }, `+=${PANEL_DURATIONS}`);

	// 	localTl.set(ASNNDummyRef.current, { x: 0 });
	// 	localTl.call(() => {
	// 		setASNNValue(0);
	// 	});
	// 	localTl.to(ASNNRef.current, { opacity: 1, duration: 1 });
	// 	localTl.to(
	// 		ASNNDummyRef.current,
	// 		{
	// 			ease: Power2.easeOut,
	// 			duration: 5,
	// 			x: 1000 / 100,
	// 			onUpdate: () => {
	// 				const dummyElPos = gsap.getProperty(ASNNDummyRef.current, "x") ?? 0;
	// 				setASNNValue(parseFloat(dummyElPos.toString()) * 100);
	// 			},
	// 		},
	// 		"-=0.5",
	// 	);
	// 	localTl.to(ASNNRef.current, { opacity: 0, duration: 1 }, `+=${PANEL_DURATIONS}`);

	// 	localTl.play();
	// }, []);

	// useEffect(() => {
	// 	gsap.defaults({ ease: "power2.inOut" });
	// 	const timer = setTimeout(runLoop, 1000);
	// 	return () => clearTimeout(timer);
	// }, [runLoop]);

	return (
		<IncentivesFallbackContainer className={props.className} style={props.style}>
			{/* <ThankYou ref={ThankYouRef} style={{ opacity: 0 }}>
				Thank you for watching and donating to
				<br />
				<b>Australian Speedrun Marathon 2023</b>
			</ThankYou> */}
			{/* <Socials ref={SocialsRef}> */}
			<Socials ref={SocialsRef}>
				<SocialBox style={{ paddingBottom: 16 }}>
					<SocialLogo src={TGXLogo} />
					<SocialLinks>
						<SocialElement>
							<SocialImage src={WebsiteLogo} />
							TheGameExpo.com
						</SocialElement>
					</SocialLinks>
					<SocialLinks style={{ justifyContent: "space-between", width: "38%" }}>
						<SocialElement>
							<SocialImage src={YoutubeLogo} />
							@TheGameExpo
						</SocialElement>
						<SocialElement>
							<SocialImage src={TwitterLogo} />
							@TheGameExpo
						</SocialElement>
					</SocialLinks>
				</SocialBox>
				<SocialBox style={{ paddingBottom: 16 }}>
					<SocialLogo src={AusSpeedrunsLogo} />
					<SocialLinks>
						<SocialElement>
							<SocialImage src={WebsiteLogo} />
							AusSpeedruns.com
						</SocialElement>
					</SocialLinks>
					<SocialLinks style={{ justifyContent: "space-between", width: "60%" }}>
						<SocialElement>
							<SocialImage src={YoutubeLogo} />
							@AusSpeedruns
						</SocialElement>
						<SocialElement>
							<SocialImage src={TwitterLogo} />
							@AusSpeedruns
						</SocialElement>
					</SocialLinks>
				</SocialBox>
			</Socials>
			{/* <InterIncentASMMContainer ref={ASNNRef} style={{ opacity: 0 }}>
				<Header>The ASM2023 attendees have walked</Header>
				<Total>
					<span style={{ width: 190, display: "inline-block", textAlign: "center" }}>
						{asnnValue.toFixed(0)}
					</span>
					<KM>KM!</KM>
				</Total>
				<LearnMore>
					Learn more about ASMM at <Website>AusSpeedruns.com/ASMM</Website>
				</LearnMore>
				<div ref={ASNNDummyRef} />
			</InterIncentASMMContainer> */}
		</IncentivesFallbackContainer>
	);
};
