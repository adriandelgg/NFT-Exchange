// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";

// @title An NFT minter
// @author Adrian Delgado, https://github.com/adriandelgg

contract ColorMinter is ERC721Enumerable {
    using SafeMath for uint256;
    // The token ID that will be given to new minted tokens.
    uint256 private _tokenId;

    constructor() ERC721("Color", "COLOR") {
        _tokenId = 1;
    }

    struct Token {
        uint256 tokenId;
        string tokenValue;
    }

    // Mapping from color to check if it exists
    mapping(string => bool) private _colorExists;

    // Mapping from token ID to token struct
    mapping(uint256 => Token) private _tokenValue;

    // Ex: "#21F32"
    // Mints a new token based on a HEX color.
    function mint(string memory _color) public {
        // Must accept only HEX colors
        require(!_colorExists[_color], "NFT already exists!");
        _safeMint(msg.sender, _tokenId);
        _colorExists[_color] = true;
        _tokenValue[_tokenId] = Token(_tokenId, _color);
        _tokenId++;
    }

    // The total amount of tokens that have been minted.
    function totalMinted() public view returns (uint256) {
        return _tokenId - 1;
    }

    // Checks if a color has been minted.
    function colorExists(string memory _color) public view returns (bool) {
        return _colorExists[_color];
    }

    /**
     * @dev Gets the total number of NFTs an address has, then uses it to create
     * an array of all the token IDs the address owns. With that array it then
     * creates another array of structs that holds the token IDs and their string value.
     * @param _owner: An address to get token data from.
     * @param _startIndex: The index you want to start getting the items from.
     */
    function tokensOwnedAndValues(address _owner, uint256 _startIndex)
        public
        view
        returns (Token[] memory)
    {
        uint256 ownerBalance = balanceOf(_owner);
        require(ownerBalance != 0, "Address has 0 NFTs.");
        require(
            _startIndex < ownerBalance,
            "Index is equal to or higher than balance."
        );

        uint256 len = ownerBalance - _startIndex;
        uint256[] memory ids = new uint256[](len);

        for (uint256 i = _startIndex; i < ownerBalance; i++) {
            ids[i] = tokenOfOwnerByIndex(_owner, i);
        }

        Token[] memory tokens = new Token[](ids.length);

        for (uint256 i = _startIndex; i < tokens.length; i++) {
            tokens[i] = _tokenValue[ids[i]];
        }

        return tokens;
    }
}
