// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./ColorMinter.sol";

// @title A DEX for ERC721 tokens (NFTs)
// @author Adrian Delgado, https://github.com/adriandelgg

contract Exchange is Ownable, ColorMinter, ERC721Holder {
    using SafeMath for uint256;

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

    /**
     * @dev Mapping from seller's address, to tokenID, to sale price
     * of the token. Used to remember the sale price of the seller's NFT
     */
    mapping(address => mapping(uint256 => uint256)) public soldToken;

    /**
     * @dev Allows a user of the DEX to sell their NFT to the DEX and also specify
     * their sell price in wei. Checks to make sure the sell price is greater than 2e12
     * because the DEX takes a 1e12 commission. Stores the sell price and the
     * owner of the address that's selling it in 2 different mappings.
     */
    function sellToExchange(uint256 _tokenId, uint256 _sellPrice) public {
        require(
            _sellPrice > 2e12,
            "Sale Error: Sell price of token must be greater than 2,000,000,000,000 (2 szabos or 2e12)."
        );
        safeTransferFrom(msg.sender, address(this), _tokenId);
        emit TokenTransferredToExchange(msg.sender, _tokenId, _sellPrice);
        soldToken[msg.sender][_tokenId] = _sellPrice;
        tokenSeller[_tokenId] = msg.sender;
    }

    /**
     * @dev Lets a user buy the NFT from the DEX. Function verifies that the amount
     * sent in wei is equal to that of the sale price. If it is, the contract
     * will accept the ether then transfer the NFT to the buyer.
     * After it's been transferred, the DEX then transfer the ether
     * minus 1e12 (1 szabo commission fee) to the original owner/seller of the NFT.
     */
    function buyToken(uint256 _tokenId) public payable {
        address tokenOwner = tokenSeller[_tokenId];
        uint256 tokenSalePrice = soldToken[tokenOwner][_tokenId];
        require(
            msg.value == tokenSalePrice,
            "Purchase Error: The amount sent to purchase does not equal the sell price."
        );
        payContract();

        this.safeTransferFrom(address(this), msg.sender, _tokenId);
        emit TokenPurchased(_tokenId, msg.sender, address(tokenOwner));

        _paySellerAfterPurchase(tokenOwner, tokenSalePrice);
    }

    /** @dev Pays the seller (the owner of the NFT before the DEX)
     * the sell price they offered the NFT for minus the commission fee. */
    function _paySellerAfterPurchase(
        address _tokenOwner,
        uint256 _tokenSalePrice
    ) private {
        uint256 payAmount = _tokenSalePrice.sub(1e12);
        (bool success, ) = _tokenOwner.call{value: payAmount}("");
        require(success, "Transaction failed.");
    }

    // Sends ether to contract from the address that calls this function
    function payContract() public payable {
        (bool success, ) = payable(this).call{value: msg.value}("");
        require(success, "Transaction failed.");
        emit ReceivedEther(msg.sender, msg.value);
    }

    // The total tokens the DEX holds
    function totalTokens() public view returns (uint256) {}

    function _removeTokenFromDex(uint256 _index) private {}

    // Withdraws all ether from contract and transfers to owner.
    function withdrawAll() public onlyOwner {
        address payable _owner = payable(owner());
        (bool success, ) = _owner.call{value: address(this).balance}("");
        require(success, "Transaction failed.");
    }

    //1. Give exchange NFT to sell
    // Will change owner ship to contract, but contract will remember who sent it by storing in a mapping
    // When someone buy it, the contract will transfer to them, take 1 nano, and send the remaining amount to seller
    // emit sell event
    //2. Owner can withdraw exchange's funds
    // function withdraw() onlyOwner {
    // Withdraws to owner's wallet address
    // emit withdraw event
    // }
}
