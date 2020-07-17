import axios from 'axios';

const baseURL =
	process.env.API_HOST || process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:5555/api';

console.log({ baseURL });

export const api = axios.create({
	baseURL
});
