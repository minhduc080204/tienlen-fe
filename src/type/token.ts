export interface TokenPackage {
  id: number;
  name: string;
  priceMatic: number;
  tokenAmount: number;
  description?: string;
  active: boolean;
  createdAt: string;
}

export interface DepositVerifyRequest {
  txHash: string;
  packageId: number;
  walletAddress: string;
}

// Admin types
export interface AdminTokenPackageCreateRequest {
  name: string;
  priceMatic: number;
  tokenAmount: number;
  description?: string;
}

export interface AdminTokenPackageUpdateRequest extends AdminTokenPackageCreateRequest {
  active?: boolean;
}
