// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

// @title An NFT minter
// @author Adrian Delgado, https://github.com/adriandelgg

contract ColorMinter is ERC721Enumerable {
    // The token ID that will be given to new minted tokens.
    uint256 private _tokenId;

    constructor() ERC721("Color", "COLOR") {
        _tokenId = 1;
    }

    // Mapping for color to check if it exists.
    mapping(string => bool) private _colorExists;

    // Ex: "#21F32"
    // Mints a new token based on a HEX color.
    function mint(string memory _color) public {
        // Must accept only HEX colors
        require(!_colorExists[_color], "Mint Error: NFT already exists!");
        _colorExists[_color] = true;
        _safeMint(msg.sender, _tokenId);
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
}
