
export type User = {
  id: string;
  username: string;
  email: string;
  role: "parent" | "child";
};

export type Account = {
  id: string;
  name: string;
  balance: number;
  userId: string;
  parentId?: string;
  isParentAccount: boolean;
  createdAt: string;
};

export type Transaction = {
  id: string;
  amount: number;
  description: string;
  accountId: string;
  createdAt: string;
};
