"use client";

import Header from "@/components/Header/Header";
import { Box, Button, FormControl, Input, Stack, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Login() {
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            router.push('/home');
        } else {
            console.error('Failed to login');
        }
    }

    return (
        <Box sx={{width: 1, height: 1, backgroundColor: "#1a1a1a"}}>
        <Stack 
            spacing={2}
            sx={{
            height: 4/5, 
            width: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#1a1a1a",
        }}>
            <Typography 
                    level="h1"
                    fontSize="xl"
                    fontWeight="xl"
                    color="neutral"    
                    fontFamily="Monospace"
                    textColor="#ededed"
                >Propchain
                </Typography>
            <FormControl sx={{ width:1, maxWidth: 300}}>
                <Input onChange={(email) => setEmail(email.target.value)} placeholder="Email"/>
            </FormControl>
            <FormControl sx={{ width:1,maxWidth: 300}}>
                <Input onChange={(pass) => setPassword(pass.target.value)} placeholder="Password" />
            </FormControl>
            <Button color="neutral" onClick={handleLogin}>Login</Button>
        </Stack>
        </Box>
    );
}