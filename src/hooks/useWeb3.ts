import { useState, useCallback } from "react";
import { BrowserProvider, Contract, parseEther } from "ethers";

// Add type definition for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

const POLYGON_AMOY_CHAIN_ID = "0x13882"; // 80002 in hex
// Dummy ABI for minting/purchasing. Replace with actual ABI if needed.
const NFT_ABI = [
  "function purchase(uint256 itemId) public payable",
  // "function purchase(uint256 id, uint256 amount) public payable"
];
// Placeholder contract address from guide
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export function useWeb3() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error("Vui lòng cài đặt MetaMask!");
    }

    setIsConnecting(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      const network = await provider.getNetwork();
      if (network.chainId !== 80002n) {
        try {
          await provider.send("wallet_switchEthereumChain", [
            { chainId: POLYGON_AMOY_CHAIN_ID },
          ]);
        } catch (switchError: any) {
          // If chain is not added, we should ideally call wallet_addEthereumChain,
          // but keeping it simple as per spec for now.
          throw new Error("Vui lòng chuyển mạng sang Polygon Amoy!");
        }
      }

      setAccount(accounts[0]);
      return { provider, address: accounts[0] };
    } catch (err: any) {
      console.error(err);
      throw new Error(err.message || "Lỗi kết nối ví");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const purchaseNFT = useCallback(
    async (itemId: number, priceMatic: string) => {
      if (!window.ethereum) throw new Error("Không tìm thấy ví");

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, NFT_ABI, signer);

      const priceInWei = parseEther(priceMatic);
      const tx = await contract.purchase(itemId, { value: priceInWei });
      // const tx = await contract.purchase(itemId, 1, { value: priceInWei });

      // Wait for 1 confirmation
      const receipt = await tx.wait();
      return receipt?.hash;
    },
    [],
  );

  /**
   * Chuyển một lượng MATIC tới địa chỉ admin được cấu hình trong .env
   * (VITE_ADMIN_WALLET_ADRESS) thông qua MetaMask.
   *
   * @param amountMatic - Số lượng MATIC cần chuyển (ví dụ: "0.5")
   * @returns Transaction hash sau khi giao dịch được xác nhận
   */
  const transferMatic = useCallback(async (amountMatic: string): Promise<string> => {
    if (!window.ethereum) throw new Error("Vui lòng cài đặt MetaMask!");

    const receiverAddress = import.meta.env.VITE_ADMIN_WALLET_ADRESS as string;
    if (!receiverAddress) throw new Error("Địa chỉ nhận tiền chưa được cấu hình!");

    const provider = new BrowserProvider(window.ethereum);

    // Kiểm tra và chuyển sang mạng Polygon Amoy nếu cần
    const network = await provider.getNetwork();
    if (network.chainId !== 80002n) {
      try {
        await provider.send("wallet_switchEthereumChain", [
          { chainId: POLYGON_AMOY_CHAIN_ID },
        ]);
      } catch {
        throw new Error("Vui lòng chuyển mạng sang Polygon Amoy!");
      }
    }

    const signer = await provider.getSigner();
    const amountInWei = parseEther(amountMatic);

    // Gọi ví để thực hiện lệnh chuyển tiền
    const tx = await signer.sendTransaction({
      to: receiverAddress,
      value: amountInWei,
    });

    // Chờ 1 block xác nhận
    const receipt = await tx.wait();
    if (!receipt) throw new Error("Giao dịch không nhận được xác nhận!");

    return receipt.hash;
  }, []);

  return {
    account,
    isConnecting,
    connectWallet,
    purchaseNFT,
    transferMatic,
  };
}
