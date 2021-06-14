// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

/**
 * @title An NFT minter
 * @author Adrian Delgado, https://github.com/adriandelgg
 */

// Charge a few in order to mint a token
// Set Token URI w/ IPFS metadata
contract ColorMinter is ERC721Enumerable {
    // The token ID that will be given to new minted tokens.
    uint256 private _tokenId;

    constructor() ERC721("Color", "COLOR") {
        _tokenId = 1;
    }

    // Mapping from color to check if it exists
    mapping(string => bool) private _colorExists;

    // Mapping from token ID to token value
    mapping(uint256 => string) private _tokenValue;

    // Ex: "#21F32"
    // Mints a new token based on a HEX color.
    function mint(string memory _color) internal returns (uint256) {
        require(msg.value == 1e12, "Amount sent must be 1e12.");
        require(!_colorExists[_color], "NFT already exists!");
        _safeMint(msg.sender, _tokenId);
        _colorExists[_color] = true;
        _tokenValue[_tokenId] = _color;
        _tokenId++;
        return _tokenId - 1;
    }

    // The total amount of tokens that have been minted.
    function totalMinted() public view returns (uint256) {
        return _tokenId - 1;
    }

    // Checks if a color has been minted.
    function colorExists(string memory _color) public view returns (bool) {
        return _colorExists[_color];
    }

    function getTokenValue(uint256 _tokensId)
        public
        view
        returns (string memory)
    {
        return _tokenValue[_tokensId];
    }
}
