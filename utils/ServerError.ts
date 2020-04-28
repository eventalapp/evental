export type ServerErrorPayload = { message: string };

export type ServerErrorResponse = {
	error: ServerErrorPayload;
};

export class ServerError extends Error {
	statusCode: number;
	message: string;

	constructor(message: string, statusCode: number) {
		super(message);

		this.statusCode = statusCode;
		this.message = message;
	}
}
