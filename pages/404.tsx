import { NextPage } from 'next';

const NotFoundPage: NextPage = () => {
	return (
		<div className="flex flex-row min-h-screen justify-center items-center">
			<h1 className="text-2xl">404 - Page not found</h1>
		</div>
	);
};

export default NotFoundPage;
