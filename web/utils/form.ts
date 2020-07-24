import Busboy from 'busboy';
import { NextApiRequest } from 'next';
import { NextkitError } from 'nextkit';

export const populateFormData = (data: Record<string, unknown>) => {
	const formData = new FormData();

	Object.entries(data).forEach(([key, value]) => {
		if (value instanceof File) {
			formData.append(key, value, value.name);
		} else if (value instanceof Date) {
			formData.append(key, value.toISOString());
		} else {
			if (value !== undefined && !(typeof value === 'string' && value?.length === 0)) {
				formData.append(key, String(value));
			}
		}
	});

	return formData;
};

export const busboyParseForm = (
	req: NextApiRequest
): Promise<{
	buffer: Buffer;
	formData: Record<string, string>;
	filename?: string;
	mimeType?: string;
	fileLocation?: string;
}> => {
	return new Promise((resolve, reject) => {
		const busboy = Busboy({ headers: req.headers });
		let chunks: Uint8Array[] = [];
		let formData: Record<string, string> = {};

		let filename: string;
		let mimeType: string;

		busboy.on('file', async (name, file, info) => {
			const { filename: filenameParsed, mimeType: mimeTypeParsed } = info;

			filename = filenameParsed;

			mimeType = mimeTypeParsed;

			file.on('data', async (data) => {
				chunks.push(data);
			});

			file.on('error', (error) => {
				throw new NextkitError(500, error.message);
			});
		});

		busboy.on('field', async (name, val) => {
			formData[name] = val;
		});

		busboy.on('finish', async () => {
			resolve({
				buffer: Buffer.concat(chunks),
				filename,
				mimeType,
				formData
			});
		});

		busboy.on('error', (error) => {
			console.error('busboy error', error);
			reject(error);
		});

		req.pipe(busboy);
	});
};
