import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';

import ASMLogo from '../../media/ASGX23/ASM2023Logo.png';
import AusSpeedrunsLogo from '../../media/AusSpeedruns-Logo.svg';
import TheGameExpoLogo from '../../media/ASGX23/TGXLogo-Wide-White.png';
import TwitterLogo from '../../media/twitter.svg';
import YoutubeLogo from '../../media/youtube.svg';
import WebsiteLogo from '../../media/website.svg';
import InstagramLogo from '../../media/instagram.svg';

const IncentivesFallbackContainer = styled.div`
	height: 100%;
	width: 100%;
	font-size: 40px;
`;

const Page = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
`;

const ThankYou = styled(Page)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const NextEvent = styled(Page)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const NextEventLogo = styled.img`
	width: 55%;
	height: auto;
	/* margin-top: 8px; */
`;

const Socials = styled(Page)`
	display: flex;
	align-items: center;
	justify-content: space-evenly;
`;

const SocialBox = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
`;

const SocialLogo = styled.img`
	width: auto;
	height: 60px;
	margin-top: 20px;
	/* margin-bottom: 6px; */
`;

const SocialLinks = styled.div``;

const SocialElement = styled.div`
	font-size: 28px;
	width: 100%;
	display: flex;
	align-items: center;
	margin-top: 12px;
`;

const SocialImage = styled.img`
	width: 32px;
	height: auto;
	margin-right: 16px;
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
}

export const InterIncentivesFallback = (props: Props) => {
	const ThankYouRef = useRef<HTMLDivElement>(null);
	const NextEventRef = useRef<HTMLDivElement>(null);
	const SocialsRef = useRef<HTMLDivElement>(null);
	const mainTl = useRef<gsap.core.Timeline>(gsap.timeline({ paused: true, repeat: -1 }));

	const runLoop = useCallback(() => {
		if (!mainTl.current) return;

		mainTl.current.to(ThankYouRef.current, { opacity: 1, duration: 1 });
		mainTl.current.to(ThankYouRef.current, { opacity: 0, duration: 1 }, '+=30');
		
		mainTl.current.to(NextEventRef.current, { opacity: 1, duration: 1 });
		mainTl.current.to(NextEventRef.current, { opacity: 0, duration: 1 }, '+=30');
		
		mainTl.current.to(SocialsRef.current, { opacity: 1, duration: 1 });
		mainTl.current.to(SocialsRef.current, { opacity: 0, duration: 1 }, '+=30');

		mainTl.current.play();
	}, []);

	useEffect(() => {
		gsap.defaults({ ease: 'power2.inOut' });
		const timer = setTimeout(runLoop, 1000);
		return () => clearTimeout(timer);
	}, [runLoop]);

	return (
		<IncentivesFallbackContainer className={props.className} style={props.style}>
			<ThankYou ref={ThankYouRef} style={{ opacity: 0 }}>
				Thank you for watching and donating to
				<br />
				<b>AusSpeedruns × The Game Expo 2023</b>
			</ThankYou>
			<NextEvent ref={NextEventRef} style={{ opacity: 0 }}>
				Our next event is in Adelaide for
				<NextEventLogo src={ASMLogo} />
			</NextEvent>
			<Socials ref={SocialsRef} style={{ opacity: 0 }}>
				<SocialBox>
					<SocialLogo src={AusSpeedrunsLogo} />
					<SocialLinks>
						<SocialElement>
							<SocialImage src={YoutubeLogo} />
							@AusSpeedruns
						</SocialElement>
						<SocialElement>
							<SocialImage src={TwitterLogo} />
							@AusSpeedruns
						</SocialElement>
						<SocialElement>
							<SocialImage src={WebsiteLogo} />
							AusSpeedruns.com
						</SocialElement>
					</SocialLinks>
				</SocialBox>
				<SocialBox>
					<SocialLogo src={TheGameExpoLogo} />
					<SocialLinks>
						<SocialElement>
							<SocialImage src={InstagramLogo} />
							@TheGameExpo
						</SocialElement>
						<SocialElement>
							<SocialImage src={TwitterLogo} />
							@TheGameExpo
						</SocialElement>
						<SocialElement>
							<SocialImage src={WebsiteLogo} />
							TheGameExpo.com
						</SocialElement>
					</SocialLinks>
				</SocialBox>
			</Socials>
		</IncentivesFallbackContainer>
	);
};
