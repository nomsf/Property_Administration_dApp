"use client";

import { Box, Button, Stack, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { toast } from "react-toastify";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

const PRIVATE_CHAIN_ID = "585858";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const router = useRouter();

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      toast.error("MetaMask is not installed!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum!);
      const accounts = await provider.send("eth_requestAccounts", []);

      const currentChainId = await provider.getNetwork().then((net) => net.chainId);
      if (currentChainId.toString() !== PRIVATE_CHAIN_ID) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: PRIVATE_CHAIN_ID }],
        });
      }

      setWalletAddress(accounts[0]);
      router.push("/home");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Error connecting wallet. Please check the console for more details.");
    }
  };

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum!);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          const currentChainId = await provider.getNetwork().then((net) => net.chainId);
          if (currentChainId.toString() === PRIVATE_CHAIN_ID) {
            const address = await accounts[0].getAddress();
            setWalletAddress(address);
            router.push("/home");
          }
        }
      }
    };

    checkWalletConnection();
  }, [router]);

  return (
    <Box sx={{ width: 1, height: 1, backgroundColor: "#1a1a1a" }}>
      <Stack
        spacing={2}
        sx={{
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1a1a1a",
        }}
      >
        <Typography
          level="h1"
          fontSize="xl"
          fontWeight="xl"
          fontFamily="Monospace"
          textColor="#ededed"
        >
          Propchain
        </Typography>
        {walletAddress ? (
          <Button color="success" disabled>
            Connected: {walletAddress}
          </Button>
        ) : (
          <Button color="primary" onClick={connectWallet}>
            Connect Wallet
          </Button>
        )}
      </Stack>
    </Box>
  );
}
