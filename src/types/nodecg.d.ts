export * from '../../../../types/server';
export { ListenForCb } from '../../../../types/lib/nodecg-instance';
export * from '../../../../types/browser';

export interface Asset {
	base: string;
	bundleName: string;
	category: string;
	ext: string;
	name: string;
	sum: string;
	url: string;
}