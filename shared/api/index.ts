import axios from 'axios';

const baseURL =
	(process.env && process.env.API_HOST) ||
	(process.env &&
		process.env.NEXT_PUBLIC_VERCEL_URL &&
		`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`) ||
	'http://localhost:5555/api';

console.log({ baseURL });

export const api = axios.create({
	baseURL
});
