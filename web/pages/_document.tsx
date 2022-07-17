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
					{process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
						<>
							<script
								async
								src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
							/>
							<script
								dangerouslySetInnerHTML={{
									__html: `
										window.dataLayer = window.dataLayer || [];
										function gtag(){dataLayer.push(arguments);}
										gtag('js', new Date());
										gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
											page_path: window.location.pathname,
										});
									`
								}}
							/>
						</>
					)}

					<link rel="manifest" href="/manifest.json" />
					<link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
					<link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
					<link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
					<link rel="mask-icon" href="/images/safari-pinned-tab.svg" color="#0066ff" />
					<meta name="msapplication-TileColor" content="#2b5797" />
					<meta name="theme-color" content="#ffffff" />
				</Head>
				<body className="h-full text-gray-900">
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
