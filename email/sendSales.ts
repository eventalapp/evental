import { sendSalesData } from './sendSalesData';
import { sendSales } from './templates/sales';

const send = () => {
	sendSalesData.forEach(async (val) => {
		await sendSales(val);
	});
};

send();
