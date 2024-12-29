"use client";

import Header from "@/components/Header/Header";
import Propertycard from "@/components/Propertycard/Propertycard";
import { PropertycardProps } from "@/components/Propertycard/Propertycard.types";
import { Box, Stack } from "@mui/joy";
import { useState } from "react";

export default function HomePage() {

  const proptemp: PropertycardProps[] = [
    {
      location: "123 Main St, Springfield, IL, 62701",
      type: "Flat",
      valuation: [5000, 100000, 200000]
    },
    {
      location: "123 Main St, Springfield, IL, 62701",
      type: "Land",
      valuation: [5000, 100000, 200000]
    },
    {
      location: "333 Second St, Sheffield, AD, 433212",
      type: "House",
      valuation: [5000, 100000, 200000]
    }
  ]
  proptemp.push(
    {
      location: "444 Fourth St, Metropolis, NY, 10001",
      type: "Condo",
      valuation: [6000, 110000, 210000]
    },
    {
      location: "555 Fifth St, Gotham, NJ, 07001",
      type: "Apartment",
      valuation: [7000, 120000, 220000]
    },
    {
      location: "666 Sixth St, Star City, CA, 90001",
      type: "Villa",
      valuation: [8000, 130000, 230000]
    },
    {
      location: "777 Seventh St, Central City, CO, 80001",
      type: "Cottage",
      valuation: [9000, 140000, 240000]
    },
    {
      location: "888 Eighth St, Coast City, FL, 33001",
      type: "Bungalow",
      valuation: [10000, 150000, 250000]
    },
    {
      location: "999 Ninth St, Smallville, KS, 66001",
      type: "Mansion",
      valuation: [11000, 160000, 260000]
    },
    {
      location: "1010 Tenth St, Atlantis, GA, 30001",
      type: "Farmhouse",
      valuation: [12000, 170000, 270000]
    },
    {
      location: "1111 Eleventh St, Wakanda, IL, 62702",
      type: "Penthouse",
      valuation: [13000, 180000, 280000]
    },
    {
      location: "1212 Twelfth St, Asgard, TX, 75001",
      type: "Townhouse",
      valuation: [14000, 190000, 290000]
    },
    {
      location: "1313 Thirteenth St, Themyscira, WA, 98001",
      type: "Duplex",
      valuation: [15000, 200000, 300000]
    }
  );

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
