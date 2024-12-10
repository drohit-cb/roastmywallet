// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RoastNFT is ERC721, Ownable {
    struct RoastEntry {
        uint256 tokenId;
        address wallet;      // Owner who got roasted
        uint256 likes;
        string roastText;
        uint256 timestamp;
    }

    // Storage
    mapping(uint256 => RoastEntry) public roasts;
    mapping(uint256 => mapping(address => bool)) public hasLiked;
    uint256 public totalRoasts;

    // Events
    event RoastMinted(uint256 tokenId, address wallet, string roastText);
    event RoastLiked(uint256 tokenId, address liker);

    constructor() ERC721("RoastMyWallet", "ROAST") Ownable(msg.sender) {}

    function mintRoast(string calldata roastText) external {
        uint256 tokenId = totalRoasts + 1;
        
        roasts[tokenId] = RoastEntry({
            tokenId: tokenId,
            wallet: msg.sender,
            likes: 0,
            roastText: roastText,
            timestamp: block.timestamp
        });

        _mint(msg.sender, tokenId);
        totalRoasts = tokenId;
        
        emit RoastMinted(tokenId, msg.sender, roastText);
    }

    function likeRoast(uint256 tokenId) external {
        require(tokenId <= totalRoasts, "Roast doesn't exist");
        require(!hasLiked[tokenId][msg.sender], "Already liked");
        require(msg.sender != roasts[tokenId].wallet, "Can't like own roast");

        hasLiked[tokenId][msg.sender] = true;
        roasts[tokenId].likes += 1;

        emit RoastLiked(tokenId, msg.sender);
    }

    function getRoast(uint256 tokenId) external view returns (RoastEntry memory) {
        require(tokenId <= totalRoasts, "Roast doesn't exist");
        return roasts[tokenId];
    }

    function getTopRoasts(uint256 limit) external view returns (RoastEntry[] memory) {
        uint256 count = totalRoasts < limit ? totalRoasts : limit;
        RoastEntry[] memory topRoasts = new RoastEntry[](count);
        
        // Basic implementation - returns latest N roasts
        // TODO: Implement proper sorting by likes
        for(uint256 i = 0; i < count; i++) {
            topRoasts[i] = roasts[totalRoasts - i];
        }
        
        return topRoasts;
    }
} 