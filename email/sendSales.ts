// @ts-ignore
import { sendSalesData } from './sendSalesData';
import { SendSalesArgs, sendSales } from './templates/sales';

const send = (data: SendSalesArgs[]) => {
	data.forEach(async (val) => {
		await sendSales(val);
	});
};

send(sendSalesData || []);
