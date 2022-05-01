import mjml2html from 'mjml';
import { convert } from 'html-to-text';
import { SES } from '../utils/ses';

export const sendForgetPasswordEmail = () => {
	const resetPasswordLink = 'https://evental.app/auth/reset-password';
	const sendToAddress = 'kcjackkelly@gmail.com';

	const htmlOutput = mjml2html(`
 <mjml>
    <mj-head>
        <mj-font name="Inter"
                 href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" />
        <mj-style inline="inline">
            .link-button {
                text-decoration: none;
                background-color: #0066FF;
                color: #ffffff;
                padding: 8px 15px;
                border-radius: 5px
            }
        </mj-style>
    </mj-head>

    <mj-body>
        <mj-section>
            <mj-column>
                <mj-image width="150px" src="https://cdn.evental.app/images/logo-text.png"/>

                <mj-divider border-color="#CDCDCD" border-width='3px'/>

                <mj-text font-weight="bold" font-size="30px" color="#111827" align="center" font-family="Inter, Roboto, Arial">Password
                    Reset
                </mj-text>

                <mj-text padding-bottom="30px" font-size="16px" color="#111827" font-family="Inter, Roboto, Arial">You have requested a
                    password change.
                </mj-text>

                <mj-text font-size="16px" color="#5C41FF" font-family="Inter, Roboto, Arial">
                    <a class="link-button" href="${resetPasswordLink}" target="_blank">Reset password</a>
                </mj-text>
            </mj-column>
        </mj-section>
    </mj-body>
</mjml>
`);

	console.log(htmlOutput);

	const text = convert(htmlOutput.html, {
		wordwrap: 130
	});

	console.log(text);

	const params = {
		Content: {
			Simple: {
				Body: {
					Html: {
						Data: htmlOutput.html,
						Charset: 'UTF-8'
					},
					Text: {
						Data: text,
						Charset: 'UTF-8'
					}
				},
				Subject: {
					Data: 'Password Reset',
					Charset: 'UTF-8'
				}
			}
		},
		Destination: {
			ToAddresses: [sendToAddress]
		},
		FromEmailAddress: 'no-reply@evental.app'
	};

	SES.sendEmail(params, function (err, data) {
		if (err) console.log(err, err.stack);
		// an error occurred
		else console.log(data); // successful response
	});
};
