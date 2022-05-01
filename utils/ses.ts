import * as AWS from 'aws-sdk';

export const SES = new AWS.SESV2({
	accessKeyId: process.env.EVENTAL_AWS_ACCESS_KEY_ID!,
	secretAccessKey: process.env.EVENTAL_AWS_SECRET_ACCESS_KEY!,
	region: process.env.EVENTAL_AWS_REGION!
});
