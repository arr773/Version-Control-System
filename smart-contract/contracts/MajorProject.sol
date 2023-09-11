// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.2;

import "./DocumentContract.sol";

contract MajorProject {

    struct User {
        address walletAddress;
        bool status;
        bool approverRequestStatus;
    }
    
    struct PendingVersionDisplay {
        string documentName;
        address documentAddress;
        string pendingVersionHash;
        uint256 pendingVersionVersion;
    }

    User[] public users;
    DocumentContract[] public documentContracts;
    address[] public approvers;
    mapping(address => bool) forApprover;
    mapping(address => bool) forDocument;
    address addressForApproval;
    User activeUser;

    constructor() {
        users.push(User(0xA87881a951FF0B2647E6Fcc3064Ea96b858B50CD, true, false));
    }

    event UserStatus (address userAddress, bool status);

    function addActiveUser(address _walletAddress) public {
        uint256 i = 0;
        for (; i < users.length; i++) {
            User memory user = users[i];
            if (user.walletAddress == _walletAddress) {
                activeUser = user;
                return;
            }
        }
        if (i >= users.length) {
            users.push(User(_walletAddress, false, false));
            activeUser = users[i];
            return;
        }
        else {
            revert();
        }
    }

    function approvePendingHash() public {
        uint256 i = 0;
        for (; i < documentContracts.length; i++) {
            if (documentContracts[i].getCreatorAddress() == activeUser.walletAddress){
                if (keccak256(abi.encodePacked(documentContracts[i].getPendingVersion().hash)) == keccak256(abi.encodePacked(''))) {
                    continue;
                } else {
                    break;
                }
            }        
        }
        if (i >= documentContracts.length)
            return;
        require (documentContracts[i].getAvailableVersion() == documentContracts[i].getPendingVersion().version);
        DocumentContract temp = documentContracts[i];
        temp.addVersion(temp.getPendingVersion().hash);
        temp.setPendingVersion('', 0);
    }

    function createNewContract(string memory documentHash, string memory documentName) public returns (address){
        uint256 i = 0;
        for (i = 0; i < users.length; i++) {
            if (users[i].walletAddress == activeUser.walletAddress)
                break;
        }
        if (i >= users.length)
            revert();
        require(users[i].status == true);
        DocumentContract documentContract = new DocumentContract(documentHash, documentName, activeUser.walletAddress);
        documentContracts.push(documentContract);
        return documentContract.getBlockNumber();
    }

    function getUserStatus() public view returns (bool) {
        return activeUser.status;
    }

    function addNewVersion(string memory documentHash, uint256 version, address contractAddress) public {
        uint256 i = 0;
        for (; i < documentContracts.length; i++) {
            if (documentContracts[i].getBlockNumber() == contractAddress){
                break;
            }        
        }
        if (i >= documentContracts.length)
            return;
        DocumentContract temp = documentContracts[i];
        if (temp.getCreatorAddress() == activeUser.walletAddress) {
            temp.addVersion(documentHash);
            temp.setPendingVersion('', 0);
        }
        else {
            if (keccak256(abi.encodePacked(documentContracts[i].getPendingVersion().hash)) == keccak256(abi.encodePacked(''))) {
                temp.setPendingVersion(documentHash, version);
            }
        }
    }

    function getDocumentHashes(address contractAddress) public view returns (string[] memory) {
        uint256 i = 0;
        for (; i < documentContracts.length; i++) {
            if (documentContracts[i].getBlockNumber() == contractAddress)
                break;
        }
        require (i <= documentContracts.length);
        DocumentContract temp = documentContracts[i];
        return temp.getDocumentHashes();
    }

    function getDocumentContracts() public view returns (DocumentContract[] memory) {
        return documentContracts;
    }

    function getAvailableDocumentVersion(address contractAddress) public view returns (uint256 availableDocumentVersion) {
        for (uint256 i = 0; i < documentContracts.length; i++) {
            if (documentContracts[i].getBlockNumber() == contractAddress) {
                return documentContracts[i].getAvailableVersion();
            }
        }
    }

    function getDocumentContractName(address contractAddress) public view returns (string memory documentContractName) {
        for (uint256 i = 0; i < documentContracts.length; i++) {
            if (documentContracts[i].getBlockNumber() == contractAddress) {
                return documentContracts[i].getDocumentName();
            }
        }
    }

    function getAllApprover() public {
        address[] memory app = new address[](users.length);   
        uint256 i = 0;
        for(;i<users.length;i++){
            if(users[i].status == true){
                app[i] = users[i].walletAddress;
            }
        }
        approvers =  app;
    }

    function checkForApproveNewVersion() public view returns (PendingVersionDisplay memory _pendingVersionDisplay) {
        for (uint256 i = 0; i < documentContracts.length; i++) {
            DocumentContract temp = documentContracts[i];
            if (temp.getCreatorAddress() == activeUser.walletAddress) {
                PendingVersionDisplay memory pendingVersionDisplay;
                pendingVersionDisplay.documentName = temp.getDocumentName();
                pendingVersionDisplay.documentAddress = temp.getBlockNumber();
                pendingVersionDisplay.pendingVersionHash = temp.getPendingVersion().hash;
                pendingVersionDisplay.pendingVersionVersion = temp.getPendingVersion().version;
                return pendingVersionDisplay;
            }
        }
    }

    function approveNewApprover() public {
        forApprover[activeUser.walletAddress] = true;
    }

    function checkAllApproversForApprover() public {
        uint256 i = 0;
        for(;i<approvers.length;i++){
            if(forApprover[approvers[i]] == false){
                break;
            }
        }
        if(i==approvers.length){
            i = 0;
            for(;i<users.length;i++){
                if(users[i].walletAddress == activeUser.walletAddress){
                    users[i].status = true;
                    activeUser = users[i];
                }
                forApprover[users[i].walletAddress] = false;
            }
        }
    }

    function applyForApprover() public {
        addressForApproval = activeUser.walletAddress;
        for (uint256 i = 0; i <= users.length; i++) {
            if (users[i].walletAddress == activeUser.walletAddress) {
                users[i].approverRequestStatus = true;
                activeUser = users[i];
                return;
            }
        }
    }

    function checkForApproverRequestStatus() public view returns (bool _approverRequestStatus) {
        return activeUser.approverRequestStatus;
    }

    function checkForApprovals() public view returns (address){
        return addressForApproval;
    }
}