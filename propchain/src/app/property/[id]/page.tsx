"use client";

import { Property } from "@/components/global.types";
import Header from "@/components/Header/Header";
import { Box, Button, Divider, Grid, Typography } from "@mui/joy";
import { useParams } from "next/navigation";
import { Warning } from "postcss";
import { useEffect, useState } from "react";

const PropertyPage = () => {
    const {id} = useParams();
    const [property, setProperty] = useState<Property | null>(null);

    useEffect(() => {
        const fetchProperty = async () => {
            const res = await fetch(`/api/property/popular/${id}`);
            const data: Property = await res.json();
            setProperty(data);
        };

        fetchProperty();
    }, [id]);

    if(!property) {
        return (
            <Box sx={{width: 1, height: 1}}>
                <Header />
                <Box sx={{width: 1, height: 1, p: 2, justifyContent: "center", alignItems: "center"}}>
                    <Typography level="h1" fontSize="xl" fontWeight="xl" sx={{textAlign: "center"}}>
                        Loading...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        
        <Box sx={{width: 1, height: 1}}>
            <Header />

            {/* <Box sx={{display:"flex", width: 1, height: 1, p: 2, justifyContent: "center"}}>
                <Box sx={{width: 1/2}}>
                    <Typography level="h1" fontSize="2xl" fontWeight="xl" sx={{color:"#ffffff"}}>
                        {property.type}
                    </Typography>
                </Box>
                <Box sx={{width: 1/2, height:'auto'}}>
                    <Typography level="h2" fontSize="xl" sx={{color:"#ffffff"}}>
                        Rp {property.valuation.slice(-1)[0]}
                    </Typography>
                </Box>
                <Box sx={{width: 1, height:'auto'}}>
                    <Typography level="h2" fontSize="xl" sx={{color:"#ffffff"}}>
                        {property.area} sqft
                    </Typography>
                </Box>
            </Box> */}
            <Box sx={{display:"flex", justifyContent: "center"}} variant="outlined" m={2}>
                <Grid container spacing={2} sx={{p: 2, pt:10, maxWidth: 3/4}}>
                    <Grid size={6} sx={{display:"flex", justifyContent: "center", alignItems: "center"}}>
                        <Typography level="h1" fontSize="2xl" fontWeight="xl" sx={{color:"#ffffff"}}>
                            {property.type}
                        </Typography>
                    </Grid>
                    <Grid size={6} pl={10} sx={{display:"flex", justifyContent: "center", alignItems: "center"}}>
                        <Typography level="h2" fontSize="xl" sx={{color: "#8dadf7"}}>
                            Rp{property.valuation.slice(-1)[0]}
                        </Typography>
                    </Grid>
                    <Grid size={12} sx={{display:"flex", justifyContent: "center", alignItems: "center"}}>
                        <Typography noWrap={false} level="h2" fontSize="lg" fontWeight="lg" sx={{color:"#ffffff"}}>
                            {property.location}
                        </Typography>
                    </Grid>
                    <Grid size={12} sx={{display:"flex", justifyContent: "center", alignItems: "center"}}>
                        <Typography level="body-lg" fontSize="md" sx={{textAlign:"start",color:"#ffffff", borderTop: "1px solid #ffffff", borderBottom:"1px solid #ffffff", pr: 2, py: 1}}>
                            {property.description}
                        </Typography>
                    </Grid>
                    <Grid size={12} sx={{display:"flex", justifyContent: "center", alignItems: "center"}}>
                        <Typography level="title-lg" fontSize="xl" sx={{textAlign:"start",color:"#ffffff"}}>
                            {property.area} m2
                        </Typography>
                    </Grid>
                    <Grid size={12} sx={{display:"flex", justifyContent: "center", alignItems: "center"}}>
                        <Button color="neutral" onClick={() => console.log("clicked")}>
                            Apply Transfer
                        </Button>
                    </Grid>
                </Grid>
                
            </Box>
        </Box>
    );
}

export default PropertyPage;

