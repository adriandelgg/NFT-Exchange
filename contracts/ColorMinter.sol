// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Delgado.sol";

/**
 * @title An NFT minter
 * @author Adrian Delgado, https://github.com/adriandelgg
 */
// Set Token URI w/ IPFS metadata
contract ColorMinter is Delgado {
    // The token ID that will be given to new minted tokens.
    uint256 private _tokenId;

    // Mapping from color to check if it exists
    mapping(string => bool) private _tokenExists;

    // Ex: "#21F32"
    // Mints a new token based on a HEX color.
    // Add tokenURI creation
    // URI Must be just the IPFS hash due to baseURI being set.
    function mint(string memory _uri) internal returns (uint256) {
        require(!_tokenExists[_uri], "NFT already exists!");
        _safeMint(msg.sender, _tokenId);
        _tokenExists[_uri] = true;
        _tokenId++;
        return _tokenId - 1;
    }

    // The total amount of tokens that have been minted.
    function totalMinted() public view returns (uint256) {
        return _tokenId;
    }

    // Checks if a color has been minted.
    function tokenExists(string memory _uri) public view returns (bool) {
        return _tokenExists[_uri];
    }
}
