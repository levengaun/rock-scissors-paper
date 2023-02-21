import Web3 from "web3"

const web3 = new Web3()

export const abi = JSON.parse(`[
	{
		"inputs": [],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "betAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "enum RockScissorsPaper.Move",
				"name": "playerMove",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "enum RockScissorsPaper.Move",
				"name": "botMove",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "enum RockScissorsPaper.GameStatus",
				"name": "status",
				"type": "uint8"
			}
		],
		"name": "GameResult",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "option",
				"type": "uint8"
			}
		],
		"name": "play",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]`)

export const contractAddress =  web3.utils.toChecksumAddress("0x180B76bfc8A6DDf12fc6B5b1976a3e354AEfC8d4")

export const moves = ["None", "Rock", "Scissors", "Paper"]
export const statuses = ["Draw", "Lose", "Win"]