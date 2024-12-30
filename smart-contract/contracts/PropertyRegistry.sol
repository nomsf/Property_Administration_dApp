// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PropertyRegistry is ERC721, Ownable, ReentrancyGuard {
    struct Property {
        string name;
        string location;
        uint256 price;
        string zoning;
        bool forSale;
    }

    uint256 public nextPropertyId;
    mapping(uint256 => Property) public properties;

    event PropertyRegistered(uint256 indexed propertyId, string name, string location, uint256 price, string zoning);
    event PropertyTransferred(uint256 indexed propertyId, address indexed oldOwner, address indexed newOwner, uint256 price);
    event PropertyUpdated(uint256 indexed propertyId, string updatedField);

    constructor(address initialOwner) ERC721("PropertyToken", "PT") Ownable(initialOwner) {
        require(initialOwner != address(0), "Owner address cannot be zero");
    }

    function registerProperty(
        string memory name,
        string memory location,
        uint256 price,
        string memory zoning,
        address propertyOwner
    ) public onlyOwner {
        require(propertyOwner != address(0), "Invalid property owner address");

        uint256 propertyId = nextPropertyId++;
        properties[propertyId] = Property(name, location, price, zoning, false);
        _mint(propertyOwner, propertyId);

        emit PropertyRegistered(propertyId, name, location, price, zoning);
    }

    function updatePropertyForSale(uint256 propertyId, bool isForSale) public {
        require(ownerOf(propertyId) != address(0), "Property does not exist");
        require(ownerOf(propertyId) == msg.sender, "Only the property owner can update the sale status");

        properties[propertyId].forSale = isForSale;

        emit PropertyUpdated(propertyId, "forSale");
    }

    function buyProperty(uint256 propertyId) public payable nonReentrant {
        require(properties[propertyId].forSale, "Property is not for sale");
        require(msg.value >= properties[propertyId].price, "Insufficient payment");

        address oldOwner = ownerOf(propertyId);
        address newOwner = msg.sender;

        require(oldOwner != address(0), "Invalid property owner");
        require(newOwner != oldOwner, "Buyer is already the owner");

        _transfer(oldOwner, newOwner, propertyId);

        properties[propertyId].forSale = false;

        payable(oldOwner).transfer(msg.value);

        emit PropertyTransferred(propertyId, oldOwner, newOwner, msg.value);
    }
}
