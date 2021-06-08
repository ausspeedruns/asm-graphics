export interface Stream {
	channel: string;
	size: 'left' | 'right' | 'whole';
	state: 'live' | 'preview' | 'hidden' | 'both';
}
