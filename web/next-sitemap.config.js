/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl:
		(process.env.NEXT_PUBLIC_VERCEL_URL && `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`) ||
		'https://evental.app',
	generateRobotsTxt: true
};
