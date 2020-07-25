import { objectToGetParams } from './objectToGetParams';

export function twitterLink(
	url: string,
	{
		title,
		via,
		hashtags = [],
		related = []
	}: { title?: string; via?: string; hashtags?: string[]; related?: string[] }
) {
	return (
		'https://twitter.com/share' +
		objectToGetParams({
			url,
			text: title,
			via,
			hashtags: hashtags.length > 0 ? hashtags.join(',') : undefined,
			related: related.length > 0 ? related.join(',') : undefined
		})
	);
}
