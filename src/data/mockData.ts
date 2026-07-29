import { DepositRecord, User, Rider } from '../types';

export const DEFAULT_ADMIN_EMAIL = 'northeastexpressfounders@gmail.com';

export interface DistributionCenter {
  code: string;
  name: string;
  location: string;
}

export const KNOWN_DC_LIST: DistributionCenter[] = [
  { code: 'DC-GAU-01', name: 'Guwahati Central Hub', location: 'Guwahati, Assam' },
  { code: 'DC-DIS-02', name: 'Dispur Hub', location: 'Dispur, Assam' },
  { code: 'DC-JOR-03', name: 'Jorhat Logistics Center', location: 'Jorhat, Assam' },
  { code: 'DC-DIB-04', name: 'Dibrugarh Express Hub', location: 'Dibrugarh, Assam' },
  { code: 'DC-SIL-05', name: 'Silchar Distribution Center', location: 'Silchar, Assam' },
  { code: 'DC-SHL-06', name: 'Shillong Hub', location: 'Shillong, Meghalaya' },
  { code: 'DC-TEZ-07', name: 'Tezpur Gateway DC', location: 'Tezpur, Assam' },
];

export const INITIAL_RIDERS: Rider[] = [
  { id: 'RDR-402', name: 'Bikram Das', routeNo: 'Route 12 - Paltan Bazaar', phone: '+91 98640 12345', status: 'ACTIVE' },
  { id: 'RDR-108', name: 'Deepak Kalita', routeNo: 'Route 05 - Zoo Road', phone: '+91 98640 23456', status: 'ACTIVE' },
  { id: 'RDR-305', name: 'Sunil Gogoi', routeNo: 'Route 18 - Jalukbari', phone: '+91 98640 34567', status: 'ACTIVE' },
  { id: 'RDR-201', name: 'Rohan Saikia', routeNo: 'Route 09 - Ganeshguri', phone: '+91 98640 45678', status: 'ACTIVE' },
  { id: 'RDR-115', name: 'Manoj Roy', routeNo: 'Route 22 - Dispur Express', phone: '+91 98640 56789', status: 'ACTIVE' },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin-1',
    name: 'Northeast Express Founder (Admin)',
    email: 'northeastexpressfounders@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    role: 'ADMIN',
    dcCode: 'DC-GAU-01',
    dcName: 'Guwahati Central Hub',
  },
  {
    id: 'user-dc-1',
    name: 'Rajesh Sharma (DC Agent)',
    email: 'rajesh.dc@expresslogistics.in',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    role: 'DC_USER',
    dcCode: 'DC-GAU-01',
    dcName: 'Guwahati Central Hub',
  },
  {
    id: 'user-dc-2',
    name: 'Amitabh Baruah (Hub Lead)',
    email: 'amitabh.hub@expresslogistics.in',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    role: 'DC_USER',
    dcCode: 'DC-GAU-01',
    dcName: 'Guwahati Central Hub',
  },
];

// Helper to construct SVG sample screenshot previews
const createSamplePaymentReceiptSvg = (app: string, txId: string, amount: number) => {
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="550" viewBox="0 0 400 550" fill="none">
    <rect width="400" height="550" rx="20" fill="#111827"/>
    <rect x="20" y="20" width="360" height="510" rx="16" fill="#1F2937"/>
    <circle cx="200" cy="90" r="32" fill="#10B981" fill-opacity="0.2"/>
    <path d="M188 90L196 98L212 82" stroke="#10B981" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="200" y="150" fill="#10B981" font-size="16" font-family="sans-serif" font-weight="bold" text-anchor="middle">PAID SUCCESSFULLY</text>
    <text x="200" y="195" fill="#FFFFFF" font-size="32" font-family="sans-serif" font-weight="800" text-anchor="middle">₹${amount.toLocaleString('en-IN')}</text>
    <text x="200" y="225" fill="#9CA3AF" font-size="13" font-family="sans-serif" text-anchor="middle">Payment via ${app}</text>
    <line x1="40" y1="250" x2="360" y2="250" stroke="#374151" stroke-dasharray="4 4"/>
    <text x="50" y="285" fill="#9CA3AF" font-size="12" font-family="sans-serif">Transaction ID</text>
    <text x="350" y="285" fill="#F3F4F6" font-size="12" font-family="monospace" text-anchor="end">${txId}</text>
    <text x="50" y="325" fill="#9CA3AF" font-size="12" font-family="sans-serif">To Merchant</text>
    <text x="350" y="325" fill="#F3F4F6" font-size="12" font-family="sans-serif" font-weight="600" text-anchor="end">DC Express Logistics</text>
    <text x="50" y="365" fill="#9CA3AF" font-size="12" font-family="sans-serif">Payment Status</text>
    <text x="350" y="365" fill="#34D399" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="end">Completed</text>
    <text x="50" y="405" fill="#9CA3AF" font-size="12" font-family="sans-serif">Date &amp; Time</text>
    <text x="350" y="405" fill="#F3F4F6" font-size="12" font-family="sans-serif" text-anchor="end">Today, 04:32 PM</text>
    <rect x="40" y="445" width="320" height="50" rx="10" fill="#374151"/>
    <text x="200" y="475" fill="#D1D5DB" font-size="12" font-family="sans-serif" text-anchor="middle">Verified by UPI Gateway Ref #${txId.slice(-6)}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
};

const getTodayIso = () => new Date().toISOString().split('T')[0];
const getPastDateIso = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const INITIAL_DEPOSITS: DepositRecord[] = [
  {
    id: 'DEP-2026-0801',
    dcCode: 'DC-GAU-01',
    dcName: 'Guwahati Central Hub',
    riderId: 'RDR-402',
    riderName: 'Bikram Das',
    routeNo: 'Route 12 - Paltan Bazaar',
    depositDate: getTodayIso(),
    createdAt: new Date().toISOString(),
    denominations: {
      500: 12,
      200: 5,
      100: 15,
      50: 10,
    },
    totalCash: 9000,
    onlineAmount: 4500,
    totalAmount: 13500,
    onlinePaymentApp: 'GPay',
    onlineTransactionId: 'GPI294018472019',
    screenshotUrl: createSamplePaymentReceiptSvg('Google Pay (GPay)', 'GPI294018472019', 4500),
    screenshotName: 'gpay_receipt_bikram_4500.png',
    status: 'VERIFIED',
    submittedByEmail: 'rajesh.dc@expresslogistics.in',
    submittedByName: 'Rajesh Sharma',
    notes: '35 deliveries completed. Full cash & online collected.',
    verifiedBy: 'northeastexpressfounders@gmail.com',
    verifiedAt: new Date().toISOString(),
  },
  {
    id: 'DEP-2026-0802',
    dcCode: 'DC-GAU-01',
    dcName: 'Guwahati Central Hub',
    riderId: 'RDR-108',
    riderName: 'Deepak Kalita',
    routeNo: 'Route 05 - Zoo Road',
    depositDate: getTodayIso(),
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    denominations: {
      500: 20,
      200: 10,
      100: 20,
      50: 8,
      20: 10,
    },
    totalCash: 14360,
    onlineAmount: 6200,
    totalAmount: 20560,
    onlinePaymentApp: 'PhonePe',
    onlineTransactionId: 'PPE88392019382',
    screenshotUrl: createSamplePaymentReceiptSvg('PhonePe UPI', 'PPE88392019382', 6200),
    screenshotName: 'phonepe_deepak_6200.jpg',
    status: 'PENDING',
    submittedByEmail: 'rajesh.dc@expresslogistics.in',
    submittedByName: 'Rajesh Sharma',
    notes: 'COD Bag #882 handed to locker. Awaiting final audit.',
  },
  {
    id: 'DEP-2026-0803',
    dcCode: 'DC-GAU-01',
    dcName: 'Guwahati Central Hub',
    riderId: 'RDR-305',
    riderName: 'Sunil Gogoi',
    routeNo: 'Route 18 - Jalukbari',
    depositDate: getTodayIso(),
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    denominations: {
      500: 8,
      200: 10,
      100: 10,
      50: 10,
    },
    totalCash: 7500,
    onlineAmount: 3800,
    totalAmount: 11300,
    onlinePaymentApp: 'Paytm',
    onlineTransactionId: 'PTM99201847120',
    screenshotUrl: createSamplePaymentReceiptSvg('Paytm QR', 'PTM99201847120', 3800),
    screenshotName: 'paytm_sunil_3800.png',
    status: 'VERIFIED',
    submittedByEmail: 'amitabh.hub@expresslogistics.in',
    submittedByName: 'Amitabh Baruah',
    notes: 'All 28 prepaid/COD parcels accounted.',
    verifiedBy: 'northeastexpressfounders@gmail.com',
    verifiedAt: new Date().toISOString(),
  },
  {
    id: 'DEP-2026-0804',
    dcCode: 'DC-GAU-01',
    dcName: 'Guwahati Central Hub',
    riderId: 'RDR-201',
    riderName: 'Rohan Saikia',
    routeNo: 'Route 09 - Ganeshguri',
    depositDate: getPastDateIso(1),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    denominations: {
      500: 15,
      200: 5,
      100: 8,
      50: 4,
    },
    totalCash: 9500,
    onlineAmount: 8400,
    totalAmount: 17900,
    onlinePaymentApp: 'UPI QR',
    onlineTransactionId: 'UPI77291038472',
    screenshotUrl: createSamplePaymentReceiptSvg('BHIM UPI QR', 'UPI77291038472', 8400),
    screenshotName: 'upi_rohan_8400.png',
    status: 'VERIFIED',
    submittedByEmail: 'rajesh.dc@expresslogistics.in',
    submittedByName: 'Rajesh Sharma',
    notes: 'Yesterday deposit. Verified by night shift admin.',
    verifiedBy: 'northeastexpressfounders@gmail.com',
    verifiedAt: new Date(Date.now() - 80000000).toISOString(),
  },
  {
    id: 'DEP-2026-0805',
    dcCode: 'DC-GAU-01',
    dcName: 'Guwahati Central Hub',
    riderId: 'RDR-115',
    riderName: 'Manoj Roy',
    routeNo: 'Route 22 - Dispur Express',
    depositDate: getPastDateIso(1),
    createdAt: new Date(Date.now() - 90000000).toISOString(),
    denominations: {
      500: 10,
      100: 10,
      50: 6,
    },
    totalCash: 6300,
    onlineAmount: 1200,
    totalAmount: 7500,
    onlinePaymentApp: 'Bank Transfer',
    onlineTransactionId: 'NEFT992019481',
    screenshotUrl: createSamplePaymentReceiptSvg('HDFC Bank IMPS', 'NEFT992019481', 1200),
    screenshotName: 'bank_transfer_manoj.png',
    status: 'DISCREPANCY',
    submittedByEmail: 'amitabh.hub@expresslogistics.in',
    submittedByName: 'Amitabh Baruah',
    notes: 'Cash collected is ₹50 short of manifest total.',
    auditNotes: 'Rider agreed to deduct ₹50 from tomorrow allowance.',
  },
];
