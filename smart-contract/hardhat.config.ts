import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
    solidity: "0.8.28",
    networks: {
        local1: {
            url: "http://127.0.0.1:49857",
            accounts: [
                "0xbcdf20249abf0ed6d944c0288fad489e33f66b3960d9e6229c1cd214ed3bbe31",
                "0x39725efee3fb28614de3bacaffe4cc4bd8c436257e2c8bb887c4b5c4be45e76d",
                "0x53321db7c1e331d93a11a41d16f004d7ff63972ec8ec7c25db329728ceeb1710",
            ],
        },
        local2: {
            url: "http://127.0.0.1:51313",
            accounts: [
                "0xab63b23eb7941c1251757e24b3d2350d2bc05c3c388d06f8fe6feafefb1e8c70",
                "0x5d2344259f42259f82d2c140aa66102ba89b57b4883ee441a8b312622bd42491",
                "0x27515f805127bebad2fb9b183508bdacb8c763da16f54e0678b16e8f28ef3fff",
            ],
        },
        local3: {
            url: "http://127.0.0.1:51418",
            accounts: [
                "0x7ff1a4c1d57e5e784d327c4c7651e952350bc271f156afb3d00d20f5ef924856",
                "0x3a91003acaf4c21b3953d94fa4a6db694fa69e5242b2e37be05dd82761058899",
                "0xbb1d0f125b4fb2bb173c318cdead45468474ca71474e2247776b2b4c0fa2d3f5",
            ],
        },
    },
};

export default config;
