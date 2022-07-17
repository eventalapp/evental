import { objectToGetParams } from './objectToGetParams';

type Options = {
	body?: string;
	separator?: string;
	subject?: string;
};

export function emailLink(url: string, { subject, body, separator }: Options) {
	return 'mailto:' + objectToGetParams({ subject, body: body ? body + separator + url : url });
}
