"use client";

import { Box, Button, CssBaseline, Drawer, Dropdown, Input, List, ListItem, ListItemButton, Menu, MenuButton, MenuItem, Stack, Typography } from "@mui/joy";
import Image from "next/image";
import { useState } from "react";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import { useRouter } from "next/navigation";

const theme = createTheme({
    palette: {
        primary: {
            main: "#ededed",
        },
    }
})


const Header = () => {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    return (
        <Stack
            direction="row" 
            sx={{width: 1,
                height: 1,
                maxHeight: 70,
                p: 2,
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#0a0a0a",
                borderBottom: "1px solid #333",
                }}>
            {/* <a onClick={() => setOpen(true)}>
                <Image
                    src="/util/list.svg"
                    alt="Menu"
                    width={30}
                    height={30}
                />
            </a> */}

            <Dropdown>
                <MenuButton sx={{border: "none", }}>
                    <Image
                        src="/util/list.svg"
                        alt="Menu"
                        width={30}
                        height={30}
                    />
                </MenuButton>
                <Menu>
                    <MenuItem onClick={() => router.push("/home")}>Home</MenuItem>
                    <MenuItem onClick={() => router.push("/home")}>User</MenuItem>
                    <MenuItem onClick={() => router.push("/register")}>Register</MenuItem>
                </Menu>
            </Dropdown>

            <Typography 
                level="h1"
                fontSize="xl"
                fontWeight="xl"
                color="neutral"    
                fontFamily="Monospace"
                textColor="#ededed"      
            >Propchain
            </Typography>
            
            <Input 
                placeholder="Search"
                variant="soft"
                sx={{width: 1/3,
                    maxWidth: 400,
                    backgroundColor: "#333",
                    color: "#fff",
                }}
                startDecorator={
                    <img src="/util/search.svg" 
                        alt="Search" 
                        width={20} 
                        height={20} 
                        className="opacity-45"
                        />
                }
            />
        </Stack>
    );
}

export default Header;