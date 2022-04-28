import Busboy from 'busboy';
import { NextApiRequest } from 'next';
import { ServerError } from './ServerError';

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
				reject(new ServerError(error.message));
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
			if (error instanceof Error) {
				reject(new ServerError(error.message));
			}

			reject(new ServerError('An error has occurred while parsing the form.'));
		});

		req.pipe(busboy);
	});
};
