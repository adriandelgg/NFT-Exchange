pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "./ColorMinter.sol";

contract Exchange is Ownable, ColorMinter {
    event TokenPurchased(uint256 tokenId, address buyer, address seller);

    mapping(address => string[]) public soldToken;

    receive() external payable {}

    fallback() external payable {}

    function sellToExchange(uint256 _tokenId, uint256 _sellPrice) public {
        transferFrom(msg.sender, address(this), _tokenId);
    }

    function buyToken(uint256 _tokenId) public payable {
        transferFrom(address(this), msg.sender, _tokenId);
        emit TokenPurchased(_tokenId, msg.sender, address(this)); // Instead of this it should be the original seller
    }

    function paySellerAfterPurchase() private {}

    function withdrawAll() public onlyOwner {
        address payable _owner = payable(owner());
        (bool success, ) = _owner.call{value: address(this).balance}("");
        require(success, "Transaction failed.");
    }

    function giveEther() public payable {
        // address payable thisContract = payable(this);
        payable(this).transfer(1 ether);
        // address payable cont = payable(this);
        // (bool success, ) = cont.call{value: 1 ether}("");
        // require(success, "Transaction failed.");
    }

    //1. Give exchange NFT to sell
    // Will change owner ship to contract, but contract will remember who sent it by storing in a mapping
    // When someone buy it, the contract will transfer to them, take 3%, and send the remaining amount to seller
    // emit sell event
    //2. Owner can withdraw exchange's funds
    // function withdraw() onlyOwner {
    // Withdraws to owner's wallet address
    // emit withdraw event
    // }
}
