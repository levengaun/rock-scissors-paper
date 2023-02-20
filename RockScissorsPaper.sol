pragma solidity ^0.8.0;

contract RockScissorsPaper {
    address owner;
    enum Move { None, Rock, Scissors, Paper }
    enum GameStatus { Draw, Lose, Win }

    event GameResult(address player, uint256 betAmount, Move playerMove, Move botMove, GameStatus status);

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    constructor() payable {
        owner = msg.sender;
    }

    function play(uint8 option) public payable {
        require(1 <= option && option <= 3, "Unknown option.");
        require(msg.value > 0, "Bet amount must be more than zero.");
        require(msg.value*2 < address(this).balance, "Insufficient contract balance.");
        
        Move playerMove = Move(option);
        Move botMove = Move(block.number*block.gaslimit % 3 + 1);

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

    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}