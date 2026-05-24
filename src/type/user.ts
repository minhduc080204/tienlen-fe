export type UserType = {
  id: number;
  name: string;
  account: string;
  avatarUrl?: string;
  tokenBalance: number ; //money
  role?: 'ADMIN' | 'USER';
};
