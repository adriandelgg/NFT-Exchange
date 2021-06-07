pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "./ColorMinter.sol";

contract Exchange is Ownable, ColorMinter, ERC721Holder {
    receive() external payable {}

    fallback() external payable {}

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

    // Mapping from token ID to seller's address
    mapping(uint256 => address) public tokenSeller;

    // Mapping from seller's address, to token ID, to sale price
    // 1st uint: TokenID
    // 2nd uint: Sale Price
    mapping(address => mapping(uint256 => uint256)) public soldToken;

    // _sellPrice must be the wei price
    function sellToExchange(uint256 _tokenId, uint256 _sellPrice) public {
        safeTransferFrom(msg.sender, address(this), _tokenId);
        emit TokenTransferredToExchange(msg.sender, _tokenId, _sellPrice);
        soldToken[msg.sender][_tokenId] = _sellPrice;
        tokenSeller[_tokenId] = msg.sender;
    }

    // Buys token from DEX
    function buyToken(uint256 _tokenId) public payable {
        address tokenOwner = tokenSeller[_tokenId];
        uint256 tokenSalePrice = soldToken[tokenOwner][_tokenId];
        require(msg.value == tokenSalePrice);
        sendEther();

        this.safeTransferFrom(address(this), msg.sender, _tokenId);
        emit TokenPurchased(_tokenId, msg.sender, address(tokenOwner));

        // Transfer money to original owner minus 3% fee.
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

    // The total tokens the DEX holds
    function totalTokens() public view returns (uint256) {}

    function _removeTokenFromDex(uint256 _index) private {}

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
