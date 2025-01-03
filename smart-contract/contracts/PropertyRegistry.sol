// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PropertyRegistry is ERC721, Ownable, ReentrancyGuard {
    struct Property {
        uint256 price;
        bool forSale;
        string name;
        string location;
        string zoning;
    }

    uint256 public nextPropertyId;
    mapping(uint256 => Property) public properties;

    event PropertyRegistered(uint256 indexed propertyId, uint256 price, string name, string location, string zoning);
    event PropertyUpdated(uint256 indexed propertyId, string updatedField);
    event PropertyAcquired(uint256 indexed propertyId, address indexed oldPropertyOwner, address indexed newPropertyOwner, uint256 price);

    string public constant TOKEN_NAME = "PropertyToken";
    string public constant TOKEN_SYMBOL = "PT";

    constructor(address contractOwner) ERC721(TOKEN_NAME, TOKEN_SYMBOL) Ownable(contractOwner) {
        require(contractOwner != address(0), "Invalid contract owner address");
    }

    function isPropertyOwner(uint256 propertyId, address account) public view returns (bool) {
        return ownerOf(propertyId) == account;
    }

    function getPropertyForSale(uint256 propertyId) public view returns (bool) {
        return properties[propertyId].forSale;
    }

    function registerProperty(address propertyOwner, uint256 price, string memory name, string memory location, string memory zoning) public onlyOwner {
        require(propertyOwner != address(0), "Invalid property owner address");
        require(price > 0, "Property price must be greater than zero");
        require(bytes(name).length > 0, "Property name is required");
        require(bytes(location).length > 0, "Property location is required");
        require(bytes(zoning).length > 0, "Property zoning is required");

        uint256 propertyId;
        unchecked {
            propertyId = nextPropertyId++;
        }
        properties[propertyId] = Property(price, false, name, location, zoning);
        _mint(propertyOwner, propertyId);

        emit PropertyRegistered(propertyId, price, name, location, zoning);
    }

    function updatePropertyPrice(uint256 propertyId, uint256 newPrice) public {
        require(ownerOf(propertyId) != address(0), "Property does not exist");
        require(ownerOf(propertyId) == msg.sender, "Only property owner can update property price");

        properties[propertyId].price = newPrice;

        emit PropertyUpdated(propertyId, "price");
    }

    function updatePropertyForSale(uint256 propertyId, bool forSale) public {
        require(ownerOf(propertyId) != address(0), "Property does not exist");
        require(ownerOf(propertyId) == msg.sender, "Only property owner can update property for sale");
        require(properties[propertyId].price > 0, "Property price must be greater than zero");

        properties[propertyId].forSale = forSale;

        emit PropertyUpdated(propertyId, "forSale");
    }

    function updatePropertyName(uint256 propertyId, string memory newName) public {
        require(ownerOf(propertyId) != address(0), "Property does not exist");
        require(ownerOf(propertyId) == msg.sender, "Only property owner can update property name");
        require(bytes(newName).length > 0, "Property name is required");

        properties[propertyId].name = newName;

        emit PropertyUpdated(propertyId, "name");
    }

    function acquireProperty(uint256 propertyId) public payable nonReentrant {
        Property storage property = properties[propertyId];
        require(property.forSale, "Property is not for sale");
        require(msg.value >= property.price, "Insufficient payment");

        address oldPropertyOwner = ownerOf(propertyId);
        address newPropertyOwner = msg.sender;

        require(oldPropertyOwner != address(0), "Invalid property owner");
        require(newPropertyOwner != oldPropertyOwner, "Buyer is already property owner");

        _transfer(oldPropertyOwner, newPropertyOwner, propertyId);
        property.forSale = false;

        (bool success, ) = oldPropertyOwner.call{value: msg.value}("");
        require(success, "Payment transfer failed");

        emit PropertyAcquired(propertyId, oldPropertyOwner, newPropertyOwner, msg.value);
    }
}
