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
				<Head />
				<body className="h-full text-gray-900">
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
