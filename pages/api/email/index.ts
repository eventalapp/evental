import { api } from '../../../utils/api';
import { sendForgetPasswordEmail } from '../../../email/forgotPassword';

export default api({
	async GET() {
		sendForgetPasswordEmail();
	}
});
