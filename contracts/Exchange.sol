// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "./ColorMinter.sol";

/**
 * @title A DEX for ERC721 tokens (NFTs)
 * @author Adrian Delgado - https://github.com/adriandelgg
 * @dev To get all token IDs the exchange currently has for sale,
 * you have to use tokenOfOwnerByIndex() along with balanceOf()
 * in JS to enumerate through the array holding all the token IDs.
 */

contract Exchange is ColorMinter, ERC721Holder {
    receive() external payable {}

    fallback() external payable {}

    event TokenPurchased(
        uint256 indexed tokenId,
        address indexed buyer,
        address indexed seller
    );

    event TokenTransferredToExchange(
        address indexed from,
        uint256 indexed tokenId,
        uint256 price
    );

    event ReceivedEther(address indexed from, uint256 amount);

    /**
     * @dev Used to keep track of who's selling the token & for how much.
     * With this information, the DEX is able to pay the owner properly,
     * receive the correct amount for it during a sale,
     * and return the token to them if they wish to unlist it.
     */
    struct TokenSeller {
        address tokenOwner;
        uint256 tokenId;
        uint256 tokenSalePrice;
    }

    // Mapping from token ID to token seller's info.
    mapping(uint256 => TokenSeller) private _tokenInfo;

    // Gets the token sell data from the mapping containing structs
    function getTokenSellData(uint256 _tokenId)
        public
        view
        returns (TokenSeller memory)
    {
        return _tokenInfo[_tokenId];
    }

    /**
     * @dev Mints a new NFT & tethers a URI to it. Also accepts
     * 1e12 ETH as payment for minting. URI must be only the IPFS hash
     */
    function mintNFT(string memory _tokenUri) public payable {
        require(msg.value == 1e12, "Amount sent must be 1e12.");
        uint256 tokenId = mint(_tokenUri);
        _setTokenURI(tokenId, _tokenUri);
    }

    /**
     * @dev Allows a user to sell their NFT to the DEX and also specify
     * their sell price in wei. Checks to make sure the sell price is greater or equal
     * to 2e12 because the DEX takes a 1e12 commission. Stores the listing info in a mapping
     * that takes a token ID and returns a struct with the data.
     */
    function sellNFT(uint256 _tokenId, uint256 _sellPrice) public {
        require(
            _sellPrice >= 2e12,
            "Sale Error: Sell price must be 2e12 (2 szabos) or greater."
        );
        safeTransferFrom(msg.sender, address(this), _tokenId);

        emit TokenTransferredToExchange(msg.sender, _tokenId, _sellPrice);

        _tokenInfo[_tokenId] = TokenSeller(msg.sender, _tokenId, _sellPrice);
    }

    /**
     * @dev Allows the seller of the token to withdraw their sales listing
     * and get their NFT back to their wallet address. No charge or ether
     * will be paid since you can only get the token back if it's unsold.
     * Only gas fee. Removes the sale listing from the struct mapping.
     */
    function getTokenBack(uint256 _tokenId) external {
        address tokenOwner = _tokenInfo[_tokenId].tokenOwner;
        require(
            msg.sender == tokenOwner,
            "You are not the owner of this token."
        );
        this.safeTransferFrom(address(this), msg.sender, _tokenId);
        delete _tokenInfo[_tokenId];
    }

    /**
     * @dev Lets a user buy the NFT from the DEX. Function verifies that the amount
     * sent in wei is equal to that of the sale price. If it is, the contract
     * will accept the ether then transfer the NFT to the buyer.
     * After it's been transferred, the DEX then transfers the ether minus 1e12
     * (1 szabo commission fee) to the original owner/seller of the NFT.
     * Deletes the struct from the mapping after.
     */
    function buyToken(uint256 _tokenId) external payable {
        TokenSeller memory tokenData = getTokenSellData(_tokenId);
        address tokenOwner = tokenData.tokenOwner;
        require(msg.sender != tokenOwner, "You can't purchase your own token!"); // Needs test
        uint256 tokenSalePrice = tokenData.tokenSalePrice;
        require(
            msg.value == tokenSalePrice,
            "Purchase amount doesn't equal the selling price."
        );
        payContract(); // Test to see if this function is needed

        this.safeTransferFrom(address(this), msg.sender, _tokenId);
        emit TokenPurchased(_tokenId, msg.sender, address(tokenOwner));

        // Pays seller and removes the token info from mapping
        _paySellerAfterPurchase(tokenOwner, tokenSalePrice);
        delete _tokenInfo[_tokenId];
    }

    /**
     * @dev Pays the seller (the owner of the NFT that created the listing)
     * the sell price they offered the NFT for minus the commission fee.
     */
    function _paySellerAfterPurchase(
        address _tokenOwner,
        uint256 _tokenSalePrice
    ) private {
        uint256 payAmount = _tokenSalePrice - 1e12;
        (bool success, ) = _tokenOwner.call{value: payAmount}("");
        require(success, "Transaction failed.");
    }

    // Sends ether to contract from the address that calls this function
    function payContract() public payable {
        (bool success, ) = payable(address(this)).call{value: msg.value}("");
        require(success, "Transaction failed.");
        emit ReceivedEther(msg.sender, msg.value);
    }

    // Owner of contract can withdraw all contract's ether
    function withdrawAll() external onlyOwner {
        address payable _owner = payable(owner());
        (bool success, ) = _owner.call{value: address(this).balance}("");
        require(success, "Transaction failed.");
    }
}
