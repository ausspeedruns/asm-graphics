interface HostRead {
	title: string;
	content: string;
}

export const Prizes: HostRead = {
	title: "Prizes",
	content: `Mention the prizes we have for donating (type !prizes in the Twitch chat to bring up the prizes link - prizes.ausspeedruns.com)

Sample prizes script:
> “We also have a number of prizes to giveaway for those who donate. Anyone within Australia who donates at least $10 will automatically go into the running to win one of our Steam game bundles, we have 5 different bundles available to win.
> 
> For all the information, head on over to prizes.ausspeedruns.com”`,
};

export const TwitchRevenue: HostRead = {
	title: "Twitch Revenue",
	content: `Mention that Twitch revenue will also go to Game on Cancer

Sample Twitch revenue script:
> In addition to donating, the Twitch revenue we receive throughout the event will also be given to Game on Cancer, which includes bits and subscriptions to the AusSpeedruns channel, as another way to support Game on Cancer.`,
};

export const Incentives: HostRead = {
	title: "Incentives",
	content: `Mentioning the donation incentives (type !incentives in the Twitch chat to bring up the incentive link &ndash; incentives.ausspeedruns.com)

Sample incentives script: [Note: this is obviously as example, and won't be the case]        
> “We have several donation incentives over the course of this marathon. To put money towards one of these incentives, simply mention it in the comments section on Tiltify when making your donation.
>     
> The next one coming up is a bid war to choose the Mio's hairstyle in Xenoblade Chronicles 3, and currently 'short hair' is ahead on $43.
>                                 
> To see the full list of all the incentives, head to incentives.ausspeedruns.com`,
};
