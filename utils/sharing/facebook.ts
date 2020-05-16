import { objectToGetParams } from './objectToGetParams';

export function facebookLink(
	url: string,
	{ quote, hashtag }: { quote?: string; hashtag?: string }
) {
	return (
		'https://www.facebook.com/sharer/sharer.php' +
		objectToGetParams({
			u: url,
			quote,
			hashtag
		})
	);
}
