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
  "function purchase(uint256 itemId) public payable"
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
          await provider.send("wallet_switchEthereumChain", [{ chainId: POLYGON_AMOY_CHAIN_ID }]);
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

  const purchaseNFT = useCallback(async (itemId: number, priceMatic: string) => {
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
  }, []);

  return {
    account,
    isConnecting,
    connectWallet,
    purchaseNFT
  };
}
