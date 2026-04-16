import { createInvoiceForOrder } from '../../ifirma/create-faktura/invoice-service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateBill(data: any, id: string) {
  return createInvoiceForOrder({ data, orderId: id });
}
