"use client";

import { Box, Button, Stack, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

const PRIVATE_CHAIN_ID = "585858";

export default function LoginPage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const router = useRouter();

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum!);
        const accounts = await provider.send("eth_requestAccounts", []);

        const currentChainId = await provider.getNetwork().then((net) => net.chainId);
        console.log("Current chain ID:", currentChainId.toString());
        console.log("Private chain ID:", PRIVATE_CHAIN_ID);
        if (currentChainId.toString() !== PRIVATE_CHAIN_ID) {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: PRIVATE_CHAIN_ID }],
          });
        }

        setWalletAddress(accounts[0]);
        console.log("Wallet connected:", accounts[0]);
        router.push("/home");
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
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
            console.log("Wallet already connected:", address);
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
