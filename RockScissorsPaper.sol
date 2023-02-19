pragma solidity ^0.8.0;

contract RockScissorsPaper {
    
    address owner;
    enum Move { None, Rock, Paper, Scissors }
    enum GameStatus { Draw, Lose, Win }

    event GameResult(address player, uint256 betAmount, GameStatus status);

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
            emit GameResult(msg.sender, msg.value, GameStatus.Draw);
        } else if (
                playerMove == Move.Scissors && botMove == Move.Paper ||
                playerMove == Move.Paper && botMove == Move.Rock ||
                playerMove == Move.Rock && botMove == Move.Scissors) {
            payable(msg.sender).transfer(msg.value * 2);
            emit GameResult(msg.sender, msg.value, GameStatus.Win);
        } else {
            emit GameResult(msg.sender, msg.value, GameStatus.Lose);
        }
    }
}