// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

// @title An NFT minter
// @author Adrian Delgado, https://github.com/adriandelgg

contract ColorMinter is ERC721Enumerable {
    constructor() ERC721("Color", "COLOR") {}

    string[] public colors;
    mapping(string => bool) public _colorExists;

    // Ex: "#21F32"
    function mint(string memory _color) public {
        // Must accept only HEX colors
        require(!_colorExists[_color]);
        _colorExists[_color] = true;
        colors.push(_color);
        uint256 _id = colors.length - 1;
        _safeMint(msg.sender, _id);
    }

    function getColorsLength() public view returns (uint256) {
        return colors.length;
    }
}
