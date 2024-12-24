// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PropertyRegistry is ERC721, Ownable {
    struct Property {
        string name;
        string location;
        uint256 price;
        string zoning;
        address tenant;
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

    function registerProperty(string memory name, string memory location, uint256 price, string memory zoning) public onlyOwner {
        uint256 propertyId = nextPropertyId++;
        properties[propertyId] = Property(name, location, price, zoning, address(0), false);
        _mint(msg.sender, propertyId);

        emit PropertyRegistered(propertyId, name, location, price, zoning);
    }

    function transferProperty(uint256 propertyId, address newOwner) public payable {
        require(ownerOf(propertyId) == msg.sender, "Only the owner can transfer the property");
        require(properties[propertyId].forSale, "Property is not for sale");
        require(msg.value >= properties[propertyId].price, "Insufficient payment");

        address oldOwner = ownerOf(propertyId);
        _transfer(oldOwner, newOwner, propertyId);
        properties[propertyId].forSale = false;

        payable(oldOwner).transfer(msg.value);

        emit PropertyTransferred(propertyId, oldOwner, newOwner, msg.value);
    }

    function updatePropertyForSale(uint256 propertyId, bool isForSale) public onlyOwner {
        require(ownerOf(propertyId) == msg.sender, "Only the owner can update the sale status");
        properties[propertyId].forSale = isForSale;

        emit PropertyUpdated(propertyId, "forSale");
    }
}
