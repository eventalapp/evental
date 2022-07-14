export const pageView = (url: URL) => {
	if (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) {
		// @ts-ignore
		window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
			page_path: url
		});
	}
};

type GTagEvent = {
	action: string;
	category: string;
	label: string;
	value: number;
};

export const event = ({ action, category, label, value }: GTagEvent) => {
	window.gtag('event', action, {
		event_category: category,
		event_label: label,
		value: value
	});
};
