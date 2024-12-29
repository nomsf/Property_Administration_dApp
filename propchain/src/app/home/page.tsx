"use client";

import Header from "@/components/Header/Header";
import Propertycard from "@/components/Propertycard/Propertycard";
import { PropertycardProps } from "@/components/Propertycard/Propertycard.types";
import { Box, Stack } from "@mui/joy";
import { useState } from "react";

export default function HomePage() {

  const proptemp: PropertycardProps[] = [
    {
      name: "123 Main St",
      zoning: "Flat",
      location: "123 Main St, Springfield, IL, 62701",
      price: 100000
    },
    {
      name: "456 Elm St",
      zoning: "Residential",
      location: "456 Elm St, Springfield, IL, 62702",
      price: 150000
    },
    {
      name: "789 Oak St",
      zoning: "Commercial",
      location: "789 Oak St, Springfield, IL, 62703",
      price: 200000
    },
    {
      name: "101 Pine St",
      zoning: "Industrial",
      location: "101 Pine St, Springfield, IL, 62704",
      price: 250000
    },
    {
      name: "202 Maple St",
      zoning: "Agricultural",
      location: "202 Maple St, Springfield, IL, 62705",
      price: 300000
    },
    {
      name: "303 Birch St",
      zoning: "Mixed-Use",
      location: "303 Birch St, Springfield, IL, 62706",
      price: 350000
    },
    {
      name: "404 Cedar St",
      zoning: "Flat",
      location: "404 Cedar St, Springfield, IL, 62707",
      price: 400000
    },
    {
      name: "505 Walnut St",
      zoning: "Residential",
      location: "505 Walnut St, Springfield, IL, 62708",
      price: 450000
    },
    {
      name: "606 Ash St",
      zoning: "Commercial",
      location: "606 Ash St, Springfield, IL, 62709",
      price: 500000
    },
    {
      name: "707 Cherry St",
      zoning: "Industrial",
      location: "707 Cherry St, Springfield, IL, 62710",
      price: 550000
    }
  ];
  

  const [properties, setProperties] = useState<PropertycardProps[]>(proptemp);

  return (
    <Box sx={{width: 1, height: 1}}>
      <Header />
      <Stack spacing={2} pt={4} mb={10} sx={{justifyContent: "center", alignItems: "center"}}>
        {properties.map((property, index) => (
            <Propertycard key={index} {...property} />
          ))}
      </Stack>
    </Box>
  );
}
