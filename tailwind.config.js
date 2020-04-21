module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	darkMode: false,
	theme: {},
	variants: {
		extend: {
			opacity: ['disabled'],
			backgroundColor: ['disabled'],
			cursor: ['hover', 'focus', 'disabled']
		}
	}
};
