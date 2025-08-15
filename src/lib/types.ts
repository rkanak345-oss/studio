export interface User {
  id: string;
  name: string;
  mobile: string;
  isAdmin: boolean;
  wallet: number;
  refCode: string;
  referredBy: string | null;
  createdAt: string;
}

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  method: 'upi' | 'bank';
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  account: string;
}

export interface Tx {
  title: string;
  date: string;
  detail: string;
}
