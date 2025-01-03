"use client";

import { useParams } from "next/navigation";
import Header from "@/components/Header/Header";
import { Box, Button, Card, CardActions, CardContent, Divider, FormControl, FormLabel, Input, Select, Option, Typography } from "@mui/joy";
import { useState } from "react";
import { ethers } from "ethers";
import PropertyRegistryABI from "../../../../../../smart-contract/artifacts/contracts/PropertyRegistry.sol/PropertyRegistry.json";
import OracleABI from "../../../../../../smart-contract/artifacts/contracts/Oracle.sol/Oracle.json";
import { toast } from "react-toastify";

const CONTRACT_ADDRESS = "0x9f5eaC3d8e082f47631F1551F1343F23cd427162";
const ORACLE_CONTRACT_ADDRESS = "0x4952bE6a8033519456197bdf5B5a8a6189621F17";

const TaxCalculationPage = () => {
  const { id } = useParams();
  const [buildingArea, setBuildingArea] = useState(0);
  const [landArea, setLandArea] = useState(0);
  const [buildingPricePerM2, setBuildingPricePerM2] = useState(0);
  const [landPricePerM2, setLandPricePerM2] = useState(0);
  const [taxType, setTaxType] = useState("");
  const [calculatedTax, setCalculatedTax] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBuildingAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => setBuildingArea(Number(e.target.value));
  const handleLandAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => setLandArea(Number(e.target.value));
  const handleBuildingPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => setBuildingPricePerM2(Number(e.target.value));
  const handleLandPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => setLandPricePerM2(Number(e.target.value));

  const handleTaxTypeChange = (event: any, value: string | null) => {
    if (value) {
      setTaxType(value);
    }
  };

  const calculateTax = async () => {
    if (!buildingArea || !landArea || !buildingPricePerM2 || !landPricePerM2 || !taxType || !id) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum!);
      const signer = await provider.getSigner();

      const propertyRegistry = new ethers.Contract(CONTRACT_ADDRESS, PropertyRegistryABI.abi, signer);
      const oracleContract = new ethers.Contract(ORACLE_CONTRACT_ADDRESS, OracleABI.abi, provider);

      const fee = ethers.parseEther("0.1");

      setCalculatedTax(null);

      oracleContract.on("DataFulfilled", (requestId, result) => {
        if (requestId === id) {
          console.log("Tax Calculation Result from Oracle:", result);
          setCalculatedTax(result.toNumber());
          toast.success("Tax calculated successfully!");
        }
      });

      let tx;
      if (taxType === "PBB") {
        tx = await propertyRegistry.requestPBBTaxCalculation(
          id,
          buildingArea,
          landArea,
          buildingPricePerM2,
          landPricePerM2,
          { value: fee }
        );
      } else if (taxType === "PPN") {
        tx = await propertyRegistry.requestPPNTaxCalculation(
          id,
          buildingArea,
          landArea,
          buildingPricePerM2,
          landPricePerM2,
          { value: fee }
        );
      }

      const txHash = tx.hash;
      toast.info(`Transaction sent! Tx Hash: ${txHash}`);
  
      const receipt = await tx.wait();
      toast.success(`Tax calculation request sent successfully! Block: ${receipt.blockNumber}`);
    } catch (error) {
      console.error("Error calculating tax:", error);
      toast.error("Failed to calculate tax. Check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: 1, height: 1 }}>
      <Header />
      <Box sx={{ width: 1, height: 1, p: 2, justifyContent: "center", alignItems: "center" }}>
        <Card
          variant="outlined"
          sx={{
            maxHeight: "max-content",
            maxWidth: 600,
            mx: "auto",
            overflow: "auto",
            resize: "horizontal",
          }}
        >
          <Typography level="title-lg">Tax Calculation for Property {id}</Typography>
          <Divider inset="none" />
          <CardContent
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(80px, 1fr))",
              gap: 1.5,
            }}
          >
            <FormControl>
              <FormLabel>Building Area (m²)</FormLabel>
              <Input type="number" onChange={handleBuildingAreaChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Land Area (m²)</FormLabel>
              <Input type="number" onChange={handleLandAreaChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Building Price per m²</FormLabel>
              <Input type="number" onChange={handleBuildingPriceChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Land Price per m²</FormLabel>
              <Input type="number" onChange={handleLandPriceChange} />
            </FormControl>
            <FormControl sx={{ gridColumn: "1/-1" }}>
              <FormLabel>Tax Type</FormLabel>
              <Select placeholder="Select Tax Type" onChange={handleTaxTypeChange}>
                <Option value="PBB">PBB</Option>
                <Option value="PPN">PPN</Option>
              </Select>
            </FormControl>
            {calculatedTax !== null && (
              <Box>
                <Typography sx={{ mt: 1 }}>Calculated Tax: {calculatedTax}</Typography>
              </Box>
            )}
          </CardContent>
          <CardActions>
            <Button variant="solid" color="primary" onClick={calculateTax} loading={loading}>
              Calculate Tax
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Box>
  );
};

export default TaxCalculationPage;
