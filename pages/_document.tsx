import NextDocument, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';

export default class Document extends NextDocument {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await NextDocument.getInitialProps(ctx);

		return { ...initialProps };
	}

	render() {
		return (
			<Html
				lang="en-EN"
				prefix="og: https://ogp.me/ns# fb: https://ogp.me/ns/fb#"
				itemScope
				itemType="https://schema.org/WebPage"
				className="h-full"
			>
				<Head>
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" />
					<link
						href="https://fonts.googleapis.com/css2?family=Inter:wght@200;400;700&display=swap"
						rel="stylesheet"
					/>

					<link rel="shortcut icon" href="/images/favicon.ico" type="image/x-icon" />
					<link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
					<link rel="apple-touch-icon" sizes="57x57" href="/images/apple-touch-icon-57x57.png" />
					<link rel="apple-touch-icon" sizes="72x72" href="/images/apple-touch-icon-72x72.png" />
					<link rel="apple-touch-icon" sizes="76x76" href="/images/apple-touch-icon-76x76.png" />
					<link
						rel="apple-touch-icon"
						sizes="114x114"
						href="/images/apple-touch-icon-114x114.png"
					/>
					<link
						rel="apple-touch-icon"
						sizes="120x120"
						href="/images/apple-touch-icon-120x120.png"
					/>
					<link
						rel="apple-touch-icon"
						sizes="144x144"
						href="/images/apple-touch-icon-144x144.png"
					/>
					<link
						rel="apple-touch-icon"
						sizes="152x152"
						href="/images/apple-touch-icon-152x152.png"
					/>
					<link
						rel="apple-touch-icon"
						sizes="180x180"
						href="/images/apple-touch-icon-180x180.png"
					/>
				</Head>
				<body className="h-full font-sans text-gray-900">
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
