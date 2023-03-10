import { useState, useEffect } from "react"
import Web3 from "web3"
import { abi, contractAddress, moves, statuses } from "../constants"


export default function RockScissorsPaper() {
    const [account, setAccount] = useState("")
    const [balance, setBalance] = useState(0)
    const [contract, setContract] = useState(null)
    const [value, setValue] = useState(0.001)
    const [latestGames, setLatestGames] = useState([])
    const [web3, _] = useState(new Web3())
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(null)

    const ethereum = window.ethereum

    const connectWallet = async () => {
        if (!ethereum) {
            console.log("Install MetaMask")
            return
        }
        
        web3.setProvider(ethereum)

        let accounts = await ethereum.request({ method: 'eth_requestAccounts' })
        let _account = web3.utils.toChecksumAddress(accounts[0])
        setAccount(_account)

        let balance = await web3.eth.getBalance(_account)
        setBalance(balance/1e18)
        
        const contract = new web3.eth.Contract(abi, contractAddress)
        setContract(contract)

        const blockNumber = await web3.eth.getBlockNumber()
        let games = await contract.getPastEvents("GameResult", {
            fromBlock: blockNumber-5000, toBlock: blockNumber
        })

        setLatestGames(games.reverse().slice(0, 10))
    }

    const fetchGames = async (hash) => {
        while (true) {
            setTimeout(() => {}, 2500)
            const blockNumber = await web3.eth.getBlockNumber()
            let games = await contract.getPastEvents("GameResult", {
                fromBlock: blockNumber-5000, toBlock: blockNumber
            })

            let _games = games.filter(game => game.transactionHash == hash)
            if (_games.length == 0) continue 

            let lastGame = _games[0]
            let values = lastGame["returnValues"]

            setStatus(`Bot choose ${moves[values["botMove"]]}. Result: ${statuses[values["status"]]}`)
            setLatestGames(games.reverse().slice(0, 10))
            break
        }
    }

    useEffect(() => {
        connectWallet()
    }, [])

    const handleChangeValue = ({ target }) => {
        setValue(target.value)
    }

    const handlePlay = async (option) => {
        if (!account) {
            connectWallet()
        }

        setStatus("")

        const tx = contract.methods.play(option)
        const signature = await ethereum.request({
            method: "eth_sendTransaction",
            params: [{
                to: contractAddress,
                from: account,
                gas: web3.utils.numberToHex(1e5*5),
                value: web3.utils.numberToHex(value*1e18),
                data: tx.encodeABI()
            }]
        })

        console.log("signature:", signature)

        await fetchGames(signature)
    }

    return (
        <>
        <header>
            <section className="p-1 bg-yellow-500 text-center">
                    <h2 className="font-bold">dApp working on Binance Smart Chain - Testnet</h2>
            </section>
            <nav className="p-3 px-5 flex justify-between items-center">
                <h2>Rock Scissors Paper</h2>
                <div className="p-2 px-3 bg-yellow-500 rounded-lg text-white font-bold">
                    {account 
                    ? <h2>{account.slice(0, 10)+"..."}</h2>
                    : <button 
                        onClick={connectWallet}
                        >Connect Wallet</button>
                    } 
                </div>

            </nav>
            <hr />
        </header>

        <section>
           <div className="m-10 flex flex-col items-center">
                <h2 className="m-5 text-2xl font-bold">Rock Scissors Paper dApp</h2>
                <h2>Address: {account}</h2>
                <h2>Balance: {balance.toFixed(3)} BNB</h2>

                {/* <div className="m-10 flex flex-col items-center">
                    <h2 className="text-xl font-bold">Contract</h2>
                    <h2>Address: {contractAddress}</h2>
                    <h2>Balance: {contractBalance.toFixed(3)} BNB</h2>
                </div> */}

                <h2 className="m-5 text-2xl font-bold">Bet (BNB)</h2>
                <input type="number" onChange={handleChangeValue} value={value} className="mx-5 text-center text-4xl font-slate-500 bg-transparent outline-0" placeholder="0"/>

                <div>
                    <button onClick={() => handlePlay(1)} className="m-5 p-2 px-3 bg-yellow-500 rounded-lg text-white font-bold">Rock</button>
                    <button onClick={() => handlePlay(2)} className="my-5 p-2 px-3 bg-yellow-500 rounded-lg text-white font-bold">Scissors</button>
                    <button onClick={() => handlePlay(3)} className="m-5 p-2 px-3 bg-yellow-500 rounded-lg text-white font-bold">Paper</button>
                </div>

                {status == "" && <h2 className="text-center text-xl font-bold">Loading...</h2>}

                {status
                ? <h2 className="text-xl font-bold">{status}</h2>
                : ""}

                <h2 className="my-5 font-bold text-xl">Latest games</h2>
                <div className="p-5 bg-slate-200/50 rounded-lg">
                    
                    <div className="mb-5 grid grid-cols-5 gap-4">
                        <h2 className="">Player</h2>
                        <h2 className="">Bet amount</h2>
                        <h2 className="">Player move</h2>
                        <h2 className="">Bot move</h2>
                        <h2 className="">Status</h2>
                    </div>

                    {latestGames.length != 0 && latestGames.map(game => {
                        const values = game.returnValues
                        return (
                            <div className="my-2 grid grid-cols-5 gap-4" onClick={() => window.open("https://testnet.bscscan.com/tx/"+game.transactionHash)} key={game.transactionHash}>
                                 <h2 className="">{values["player"].slice(0, 10)+"..."}</h2>
                                 <h2 className="">{values["betAmount"]/1e18} BNB</h2>
                                 <h2 className="">{moves[values["playerMove"]]}</h2>
                                 <h2 className="">{moves[values["botMove"]]}</h2>
                                 <h2 className="">{statuses[values["status"]]}</h2>
                            </div>
                        )
                    })}
                </div>

           </div>
        </section>
        </>

            
    )
}