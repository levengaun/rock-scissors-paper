pragma solidity ^0.8.7;
//SPDX-License-Identifier: MIT

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";


contract RockScissorsPaper is VRFConsumerBaseV2 {

    address owner;
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    // --------------------------------------------------------------
    // random number generation logic

    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256 randomNumber);

    struct RequestStatus {
        bool fulfilled;
        bool exists; 
        uint256 randomNumber;
    }
    mapping(uint256 => RequestStatus) public s_requests; 

    VRFCoordinatorV2Interface COORDINATOR;

    uint64 s_subscriptionId;

    uint256[] public requestIds;

    bytes32 keyHash = 0xd4bb89654db74673a187bd804519e65e3f71a52bc55f11da7601a13dcf505314;
    uint32 callbackGasLimit = 100000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 1;

    constructor(uint64 subscriptionId)
        payable
        VRFConsumerBaseV2(0x6A2AAd07396B36Fe02a22b33cf443582f682c82f)
    {
        COORDINATOR = VRFCoordinatorV2Interface(
            0x6A2AAd07396B36Fe02a22b33cf443582f682c82f
        );
        s_subscriptionId = subscriptionId;
        owner = msg.sender;
    }

    function requestRandomNumber() internal returns (uint256 requestId) {
        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        s_requests[requestId] = RequestStatus({
            randomNumber: 0,
            exists: true,
            fulfilled: false
        });
        requestIds.push(requestId);
        emit RequestSent(requestId, numWords);
        return requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].exists, "request not found");
        s_requests[_requestId].fulfilled = true;
        uint256 randomNumber = (_randomWords[0] % 3) + 1;
        s_requests[_requestId].randomNumber = randomNumber;
        emit RequestFulfilled(_requestId, randomNumber);
    }

    function getRequestStatus(uint256 _requestId)
        external
        view
        returns (bool fulfilled, uint256 randomNumber)
    {
        require(s_requests[_requestId].exists, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.fulfilled, request.randomNumber);
    } 
    
    // --------------------------------------------------------------
    // game logic

    enum Move { None, Rock, Scissors, Paper }
    enum GameStatus { Draw, Lose, Win }

    event GameResult(address player, uint256 betAmount, Move playerMove, Move botMove, GameStatus status);
    
    function play(uint8 option) public payable {
        require(1 <= option && option <= 3, "Unknown option.");
        require(msg.value > 0, "Bet amount must be more than zero.");
        require(msg.value*2 < address(this).balance, "Insufficient contract balance.");
        
        Move playerMove = Move(option);
        uint256 randomNum = requestRandomNumber() % 3 + 1;
        Move botMove = Move(randomNum);

        if (playerMove == botMove) {
            // return funds
            payable(msg.sender).transfer(msg.value);
            emit GameResult(msg.sender, msg.value, playerMove, botMove, GameStatus.Draw);
        } else if (
                playerMove == Move.Scissors && botMove == Move.Paper ||
                playerMove == Move.Paper && botMove == Move.Rock ||
                playerMove == Move.Rock && botMove == Move.Scissors) {
            // user won - transfer him double bet
            payable(msg.sender).transfer(msg.value * 2);
            emit GameResult(msg.sender, msg.value, playerMove, botMove, GameStatus.Win);
        } else {
            // user lost - just emit event
            emit GameResult(msg.sender, msg.value, playerMove, botMove, GameStatus.Lose);
        }
    }

    // accept funds
    receive() external payable {}

    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

}