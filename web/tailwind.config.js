module.exports = {
	content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	mode: 'jit',
	theme: {
		fontFamily: {
			display: [
				'Inter',
				'-apple-system',
				'BlinkMacSystemFont',
				'"Segoe UI"',
				'Roboto',
				'"Helvetica Neue"',
				'Arial',
				'"Noto Sans"',
				'sans-serif',
				'"Apple Color Emoji"',
				'"Segoe UI Emoji"',
				'"Segoe UI Symbol"',
				'"Noto Color Emoji"'
			]
		},
		fontSize: {
			'tiny': '.70rem',
			'xs': '.80rem',
			'sm': '.90rem',
			'base': '1rem',
			'lg': '1.125rem',
			'xl': '1.25rem',
			'2xl': '1.5rem',
			'3xl': '1.875rem',
			'4xl': '2.25rem',
			'5xl': '3rem',
			'6xl': '4rem',
			'7xl': '5rem'
		},
		extend: {
			boxShadow: {
				slider: '0 0 0 5px rgba(0, 0, 0, 0.3)'
			},
			keyframes: {
				// Dropdown menu
				'scale-in': {
					'0%': { opacity: 0, transform: 'scale(0)' },
					'100%': { opacity: 1, transform: 'scale(1)' }
				},
				'slide-down': {
					'0%': { opacity: 0, transform: 'translateY(-10px)' },
					'100%': { opacity: 1, transform: 'translateY(0)' }
				},
				'slide-up': {
					'0%': { opacity: 0, transform: 'translateY(10px)' },
					'100%': { opacity: 1, transform: 'translateY(0)' }
				},
				// Tooltip
				'slide-up-fade': {
					'0%': { opacity: 0, transform: 'translateY(2px)' },
					'100%': { opacity: 1, transform: 'translateY(0)' }
				},
				'slide-right-fade': {
					'0%': { opacity: 0, transform: 'translateX(-2px)' },
					'100%': { opacity: 1, transform: 'translateX(0)' }
				},
				'slide-down-fade': {
					'0%': { opacity: 0, transform: 'translateY(-2px)' },
					'100%': { opacity: 1, transform: 'translateY(0)' }
				},
				'slide-left-fade': {
					'0%': { opacity: 0, transform: 'translateX(2px)' },
					'100%': { opacity: 1, transform: 'translateX(0)' }
				},
				// Navigation menu
				'enter-from-right': {
					'0%': { transform: 'translateX(200px)', opacity: 0 },
					'100%': { transform: 'translateX(0)', opacity: 1 }
				},
				'enter-from-left': {
					'0%': { transform: 'translateX(-200px)', opacity: 0 },
					'100%': { transform: 'translateX(0)', opacity: 1 }
				},
				'exit-to-right': {
					'0%': { transform: 'translateX(0)', opacity: 1 },
					'100%': { transform: 'translateX(200px)', opacity: 0 }
				},
				'exit-to-left': {
					'0%': { transform: 'translateX(0)', opacity: 1 },
					'100%': { transform: 'translateX(-200px)', opacity: 0 }
				},
				'scale-in-content': {
					'0%': { transform: 'rotateX(-30deg) scale(0.9)', opacity: 0 },
					'100%': { transform: 'rotateX(0deg) scale(1)', opacity: 1 }
				},
				'scale-out-content': {
					'0%': { transform: 'rotateX(0deg) scale(1)', opacity: 1 },
					'100%': { transform: 'rotateX(-10deg) scale(0.95)', opacity: 0 }
				},
				'fade-in': {
					'0%': { opacity: 0 },
					'100%': { opacity: 1 }
				},
				'fade-out': {
					'0%': { opacity: 1 },
					'100%': { opacity: 0 }
				},
				// Toast
				'toast-hide': {
					'0%': { opacity: 1 },
					'100%': { opacity: 0 }
				},
				'toast-slide-in-right': {
					'0%': { transform: `translateX(calc(100% + 1rem))` },
					'100%': { transform: 'translateX(0)' }
				},
				'toast-slide-in-bottom': {
					'0%': { transform: `translateY(calc(100% + 1rem))` },
					'100%': { transform: 'translateY(0)' }
				},
				'toast-swipe-out': {
					'0%': { transform: 'translateX(var(--radix-toast-swipe-end-x))' },
					'100%': {
						transform: `translateX(calc(100% + 1rem))`
					}
				}
			},
			animation: {
				// Dropdown menu
				'scale-in': 'scale-in 0.2s ease-in-out',
				'slide-down': 'slide-down 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
				'slide-up': 'slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
				// Tooltip
				'slide-up-fade': 'slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
				'slide-right-fade': 'slide-right-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
				'slide-down-fade': 'slide-down-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
				'slide-left-fade': 'slide-left-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
				// Navigation menu
				'enter-from-right': 'enter-from-right 0.25s ease',
				'enter-from-left': 'enter-from-left 0.25s ease',
				'exit-to-right': 'exit-to-right 0.25s ease',
				'exit-to-left': 'exit-to-left 0.25s ease',
				'scale-in-content': 'scale-in-content 0.2s ease',
				'scale-out-content': 'scale-out-content 0.2s ease',
				'fade-in': 'fade-in 0.2s ease',
				'fade-out': 'fade-out 0.2s ease',
				// Toast
				'toast-hide': 'toast-hide 100ms ease-in forwards',
				'toast-slide-in-right': 'toast-slide-in-right 150ms cubic-bezier(0.16, 1, 0.3, 1)',
				'toast-slide-in-bottom': 'toast-slide-in-bottom 150ms cubic-bezier(0.16, 1, 0.3, 1)',
				'toast-swipe-out': 'toast-swipe-out 100ms ease-out forwards',
				'spin-slow': 'spin 3s linear infinite'
			},
			gridTemplateColumns: {
				eventList: '60px 60px 1fr',
				eventDesktopList: '80px 80px 1fr'
			},
			colors: {
				white: {
					DEFAULT: '#FFFFFF'
				},
				red: {
					DEFAULT: '#EF4444',
					50: '#FEF2F2',
					100: '#FEE2E2',
					200: '#FECACA',
					300: '#FCA5A5',
					400: '#F87171',
					500: '#EF4444',
					600: '#DC2626',
					700: '#B91C1C',
					800: '#991B1B',
					900: '#7F1D1D'
				},
				gray: {
					DEFAULT: '#475569',
					50: '#f8fafc',
					75: '#f7f7f7',
					100: '#f1f5f9',
					200: '#e2e8f0',
					300: '#cbd5e1',
					400: '#94a3b8',
					500: '#64748b',
					600: '#475569',
					700: '#334155',
					800: '#1e293b',
					900: '#0f172a'
				},
				secondary: {
					DEFAULT: '#5C41FF',
					50: '#FAF9FF',
					100: '#E8E4FF',
					200: '#C5BBFF',
					300: '#A293FF',
					400: '#7F6AFF',
					500: '#5C41FF',
					600: '#2C09FF',
					700: '#1E00D0',
					800: '#160098',
					900: '#0E0060'
				},
				primary: {
					DEFAULT: '#0066FF',
					50: '#B8D4FF',
					100: '#A3C8FF',
					200: '#7AAFFF',
					300: '#5297FF',
					400: '#297EFF',
					500: '#0066FF',
					600: '#0050C7',
					700: '#00398F',
					800: '#002357',
					900: '#000C1F'
				}
			}
		}
	},
	variants: {
		extend: {
			opacity: ['disabled'],
			backgroundColor: ['disabled'],
			cursor: ['hover', 'focus', 'disabled']
		}
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('tailwindcss-radix')(),
		require('@tailwindcss/typography')
	]
};
