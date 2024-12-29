"use client";

import Header from "@/components/Header/Header";
import { Box, Button, Card, CardActions, CardContent, Checkbox, Divider, FormControl, FormLabel, Input, Typography } from "@mui/joy";
import { useState } from "react";



const RegisterPage = () => {
    const[propertyName, setPropertyName] = useState("");
    const[location, setLocation] = useState("");
    const[price, setPrice] = useState("");
    const[zoning, setZoning] = useState("");
    const[forSale, setForSale] = useState(false);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPropertyName(e.target.value);
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocation(e.target.value);
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(e.target.value);
    };

    const handleZoningChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setZoning(e.target.value);
    };

    const handleForSaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForSale(e.target.checked);
    };
    
    return (
        <Box sx={{width: 1, height: 1}}>
            <Header />
            <Box sx={{width: 1, height: 1, p: 2, justifyContent: "center", alignItems: "center"}}>
            <Card
                variant="outlined"
                sx={{
                    maxHeight: 'max-content',
                    maxWidth: '100%',
                    mx: 'auto',
                    // to make the demo resizable
                    overflow: 'auto',
                    resize: 'horizontal',
                }}
                >
                <Typography level="title-lg">
                    Register New Property
                </Typography>
                <Divider inset="none" />
                <CardContent
                    sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(80px, 1fr))',
                    gap: 1.5,
                    }}
                >
                    <FormControl sx={{ gridColumn: '1/-1' }}>
                        <FormLabel>Name</FormLabel>
                        <Input onChange={handleNameChange} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Zoning</FormLabel>
                        <Input placeholder="Type of property" onChange={handleZoningChange} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Proposed Price</FormLabel>
                        <Input  onChange={handlePriceChange}/>
                    </FormControl>
                    <FormControl sx={{ gridColumn: '1/-1' }}>
                        <FormLabel>Location</FormLabel>
                        <Input placeholder="Enter full location address" onChange={handleLocationChange} />
                    </FormControl>
                    <Checkbox label="For sale" sx={{ gridColumn: '1/-1', my: 1 }} onChange={handleForSaleChange} />
                    <CardActions sx={{ gridColumn: '1/-1' }}>
                    <Button variant="solid" color="primary">
                        Apply register
                    </Button>
                    </CardActions>
                </CardContent>
                </Card>
            </Box>
        </Box>
      );
}

export default RegisterPage;