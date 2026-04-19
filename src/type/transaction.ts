export interface Transaction {
  id: number;
  userId: number;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
  referenceId: number | null;
}
