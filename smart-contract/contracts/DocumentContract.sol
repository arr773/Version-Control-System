// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.2;


contract DocumentContract {

    struct PendingVersion {
        string hash;
        uint256 version;
    }

    string[] documentHashes;
    string documentName;
    address creatorAddress;
    PendingVersion pendingVersion;

    constructor(string memory documentHash, string memory _documentName, address walletAddress) {
        documentHashes.push(documentHash);
        documentName = _documentName;
        creatorAddress = walletAddress;
    }

    function addVersion(string memory documentHash) public {
        require (keccak256(abi.encodePacked(documentHashes[documentHashes.length - 1])) != keccak256(abi.encodePacked(documentHash)));
        documentHashes.push(documentHash);
    }

    function getBlockNumber() public view returns (address) {
        return address(this);
    }

    function getDocumentName() public view returns (string memory) {
        return documentName;
    }

    function getDocumentHashes() public view returns (string[] memory) {
        return documentHashes;
    }

    function getAvailableVersion() public view returns (uint256) {
        return documentHashes.length + 1;
    }

    function getPendingVersion() public view returns (PendingVersion memory _pendingVersion) {
        return pendingVersion;
    }

    function setPendingVersion(string memory _pendingDocumentHash, uint256 _version) public {
        pendingVersion.hash = _pendingDocumentHash;
        pendingVersion.version = _version;
    }

    function getCreatorAddress() public view returns (address) {
        return creatorAddress;
    }
} 