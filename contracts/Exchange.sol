pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "./ColorMinter.sol";

contract Exchange is Ownable, ColorMinter {
    mapping(address => string[]) public soldToken;

    function sellToExchange(uint256 _tokenId, uint256 _sellPrice) public {
        transferFrom(msg.sender, address(this), _tokenId);
    }

    function buyToken() public {}
    //1. Give exchange NFT to sell
    // Will change owner ship to contract, but contract will remember who sent it by storing in a mapping
    // When someone buy it, the contract will transfer to them, take 3%, and send the remaining amount to seller
    // emit sell event
    //2. Owner can withdraw exchanges funds
    // function withdraw() onlyOwner {
    // Withdraws to owner's wallet address
    // emit withdraw event
    // }
}
