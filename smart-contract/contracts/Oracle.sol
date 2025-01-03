// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Oracle is Ownable {
    // Add new job type for addition
    bytes32 public constant CALCULATE_PROPERTY_TAX = keccak256("CALCULATE_PROPERTY_TAX");
    
    struct OracleRequest {
        address requester;
        bytes32 jobId;
        bool fulfilled;
        uint256 timestamp;
        uint256 payment;
        // parameters for tax calculation
        uint256 building_area;
        uint256 land_area;
        uint256 building_price_per_m2;
        uint256 land_price_per_m2;
    }

    // Events
    event RequestCreated(
        bytes32 indexed requestId, 
        address indexed requester, 
        bytes32 jobId,
        uint256 building_area,
        uint256 land_area,
        uint256 building_price_per_m2,
        uint256 land_price_per_m2
    );
    event DataFulfilled(bytes32 indexed requestId, uint256 result);

    // State variables
    mapping(bytes32 => OracleRequest) public requests;
    mapping(address => bool) public authorizedNodes;
    mapping(bytes32 => string) public jobDescriptions;
    uint256 public fee;
    
    constructor(uint256 _fee, address initialOwner) Ownable(initialOwner){
        fee = _fee;
        jobDescriptions[CALCULATE_PROPERTY_TAX] = "Calculate property tax based on provided information (building area, land area, building price per m^2, land price per m^2)";
    }

    // Request tax calculation
    function requestTaxCalculation(uint256 building_area, uint256 land_area, uint256 building_price_per_m2, uint256 land_price_per_m2) external payable returns (bytes32) {
        require(msg.value >= fee, "Insufficient payment");
        
        bytes32 requestId = keccak256(
            abi.encodePacked(block.timestamp, msg.sender, CALCULATE_PROPERTY_TAX, building_area, land_area, building_price_per_m2, land_price_per_m2)
        );
        
        requests[requestId] = OracleRequest({
            requester: msg.sender,
            jobId: CALCULATE_PROPERTY_TAX,
            fulfilled: false,
            timestamp: block.timestamp,
            payment: msg.value,
            building_area: building_area,
            land_area: land_area,
            building_price_per_m2: building_price_per_m2,
            land_price_per_m2: land_price_per_m2
        });

        emit RequestCreated(requestId, msg.sender, CALCULATE_PROPERTY_TAX, building_area, land_area, building_price_per_m2, land_price_per_m2);
        return requestId;
    }

    // Get request details
    function getRequest(bytes32 requestId) external view returns (
        address requester,
        bytes32 jobId,
        bool fulfilled,
        uint256 timestamp,
        uint256 building_area,
        uint256 land_area,
        uint256 building_price_per_m2,
        uint256 land_price_per_m2
    ) {
        OracleRequest memory request = requests[requestId];
        return (
            request.requester,
            request.jobId,
            request.fulfilled,
            request.timestamp,
            request.building_area,
            request.land_area,
            request.building_price_per_m2,
            request.land_price_per_m2
        );
    }

    // Fulfill oracle request with data
    function fulfillRequest(bytes32 requestId, uint256 result) external {
        require(authorizedNodes[msg.sender], "Not authorized");
        require(!requests[requestId].fulfilled, "Already fulfilled");
        
        requests[requestId].fulfilled = true;
        emit DataFulfilled(requestId, result);
        
        payable(msg.sender).transfer(requests[requestId].payment);
    }

    // Authorize oracle nodes
    function authorizeNode(address node) external onlyOwner {
        authorizedNodes[node] = true;
    }

    // Revoke node authorization
    function revokeNode(address node) external onlyOwner {
        authorizedNodes[node] = false;
    }
}