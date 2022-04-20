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
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="x" />
					<link
						href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600&family=Work+Sans:wght@600;700&display=swap"
						rel="stylesheet"
					/>

					<link rel="icon" href="/favicon.ico" />
				</Head>
				<body className="h-full font-body">
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
