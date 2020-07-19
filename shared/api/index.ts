import axios from 'axios';

let baseURL;

if (process.env.API_HOST) {
	baseURL = process.env.API_HOST;
} else if (process.env.NEXT_PUBLIC_VERCEL_URL) {
	baseURL = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`;
} else {
	baseURL = 'http://localhost:5555/api';
}

console.log({ baseURL });

export const api = axios.create({
	baseURL
});
