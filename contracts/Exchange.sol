pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "./ColorMinter.sol";

contract Exchange is Ownable, ColorMinter {
    event TokenPurchased(
        uint256 tokenId,
        address indexed buyer,
        address indexed seller
    );

    event TokenTransferredToExchange(
        address indexed from,
        uint256 tokenId,
        uint256 price
    );
    event ReceivedEther(address indexed from, uint256 amount);

    // Address for TokenID sold & for how much
    // 1st uint: TokenID
    // 2nd uint: Price Sold for
    mapping(address => mapping(uint256 => uint256)) public soldToken;

    receive() external payable {}

    fallback() external payable {}

    function sellToExchange(uint256 _tokenId, uint256 _sellPrice) public {
        transferFrom(msg.sender, address(this), _tokenId);
        emit TokenTransferredToExchange(msg.sender, _tokenId, _sellPrice);
        soldToken[msg.sender][_tokenId] = _sellPrice;
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

    function sendEther() public payable {
        (bool success, ) = payable(this).call{value: msg.value}("");
        require(success, "Transaction failed.");
        emit ReceivedEther(msg.sender, msg.value);
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
