import { objectToGetParams } from './objectToGetParams';

type Options = {
	title?: string;
	summary?: string;
	source?: string;
};

export function linkedinLink(url: string, { title, summary, source }: Options) {
	return (
		'https://linkedin.com/shareArticle' +
		objectToGetParams({ url, mini: 'true', title, summary, source })
	);
}
