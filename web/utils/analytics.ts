export const pageView = (url: URL) => {
	// @ts-ignore
	if (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS) {
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
	if (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS) {
		window.gtag('event', action, {
			event_category: category,
			event_label: label,
			value: value
		});
	}
};
