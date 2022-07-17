/** @type {import('next').NextConfig} */
// see https://github.com/martpie/next-transpile-modules#readme
const withTM = require('next-transpile-modules')(['@eventalapp/shared']);

module.exports = withTM({
	images: {
		domains: [
			'i.imgur.com',
			'avatars.githubusercontent.com',
			'cdn.discordapp.com',
			'www.gravatar.com',
			'cloudflare-ipfs.com',
			'lh3.googleusercontent.com',
			'cdn.evental.app'
		]
	},
	eslint: {
		dirs: ['pages', 'utils', 'components']
	}
});
