import Web3 from "web3"

export const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/")
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
	}
]`)

export const contractAddress =  "0x1069DEB50E98cA639D32965DB7a0Aa4553247a3e"
export const contract = new web3.eth.Contract(abi, contractAddress)