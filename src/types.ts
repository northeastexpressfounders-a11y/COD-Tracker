export type UserRole = 'ADMIN' | 'DC_USER';

export interface Rider {
  id: string;
  name: string;
  routeNo: string;
  phone?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  dcCode: string;
  dcName: string;
}

export type DenominationValue = 2000 | 500 | 200 | 100 | 50 | 20 | 10 | 5 | 2 | 1;

export interface DenominationBreakdown {
  [key: number]: number; // e.g. 500: 10
}

export type DepositStatus = 'PENDING' | 'VERIFIED' | 'DISCREPANCY';

export type PaymentMethodApp = 'GPay' | 'PhonePe' | 'Paytm' | 'UPI QR' | 'Bank Transfer' | 'POS Card' | 'Other';

export interface DepositRecord {
  id: string;
  dcCode: string;
  dcName: string;
  riderId: string;
  riderName: string;
  routeNo: string;
  depositDate: string; // YYYY-MM-DD
  createdAt: string; // ISO string
  denominations: DenominationBreakdown;
  totalCash: number;
  onlineAmount: number;
  totalAmount: number;
  onlinePaymentApp?: PaymentMethodApp;
  onlineTransactionId?: string;
  screenshotUrl?: string;
  screenshotName?: string;
  status: DepositStatus;
  submittedByEmail: string;
  submittedByName: string;
  notes?: string;
  auditNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface DepositFilterOptions {
  startDate: string;
  endDate: string;
  searchQuery: string;
  riderFilter: string;
  statusFilter: 'ALL' | DepositStatus;
  minAmount?: number;
  maxAmount?: number;
  dcCodeFilter: string;
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  denominations: DenominationValue[];
}
