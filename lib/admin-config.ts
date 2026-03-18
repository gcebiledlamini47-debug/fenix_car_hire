export const adminConfig = {
  siteName: 'Fenix Car Hire',
  adminEmail: 'reception@fenix.co.sz',
  adminPhone: '+268 76829797',
  companyAddress: 'Mbabane, Sidvwashini, Lilanga Complex, Office B',
  bankDetails: {
    accountName: 'Semperfi Investments (Pty)',
    bankName: 'Standard Bank Swaziland',
    branchCode: '663164',
    accountNumber: '9110005689573',
  },
  taxRate: 0.15, // 15% VAT
};

export function formatCurrency(amount: number, currency: string = 'E'): string {
  return `${currency} ${amount.toFixed(2)}`;
}

export function calculateTotal(subtotal: number, taxRate: number = 0.15): { subtotal: number; tax: number; total: number } {
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

export function generateQuotationNumber(): string {
  const date = new Date();
  const timestamp = date.getTime().toString().slice(-6);
  return `QUO-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${timestamp}`;
}

export function generateInvoiceNumber(): string {
  const date = new Date();
  const timestamp = date.getTime().toString().slice(-4);
  return `INV-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${timestamp}`;
}

export function generateChecksheetNumber(): string {
  const date = new Date();
  const timestamp = date.getTime().toString().slice(-4);
  return `CHK-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${timestamp}`;
}
