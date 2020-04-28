export type ServerErrorPayload = { message: string };

export class ServerError extends Error {
	error: ServerErrorPayload;

	constructor(message: string) {
		super(message);

		this.error = { message };
	}
}
