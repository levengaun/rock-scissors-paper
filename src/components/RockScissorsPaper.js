import { useState, useEffect } from "react"
import { web3, contractAddress, contract } from "../constants"

export default function RockScissorsPaper() {
    const [account, setAccount] = useState("")
    const [balance, setBalance] = useState(0)
    const [value, setValue] = useState(0)

    const ethereum = window.ethereum
    const connectWallet = async () => {
        if (!ethereum) {
            console.log("Install MetaMask")
            return
        }

        let accounts = await ethereum.request({ method: 'eth_requestAccounts' })
        setAccount(accounts[0])
    }

    const fetchBalance = async () => {
        const balance = await web3.eth.getBalance(account)
        setBalance(balance/1e18)
    }

    useEffect(() => {
        connectWallet()
    }, [])

    useEffect(() => {
        fetchBalance()
    }, [account])

    const handleChangeValue = ({ target }) => {
        setValue(target.value)
    }

    const handlePlay = async (option) => {
        const tx = contract.methods.play(option)
        const signature = await ethereum.request({
            method: "eth_sendTransaction",
            params: [{
                to: contractAddress,
                from: account,
                gas: "0xa710",
                value: web3.utils.numberToHex(value*1e18),
                data: tx.encodeABI()
            }]
        })

        console.log("signature:", signature)
    }

    return (
        <section>
           <div className="m-10 flex flex-col items-center">
                <h2 className="m-5 text-2xl font-bold">Rock Scissors Paper dApp</h2>
                <h2>Address: {account}</h2>
                <h2>Balance: {balance.toFixed(3)}</h2>

                <h2 className="m-5 text-2xl font-bold">Bet (BNB)</h2>
                <input type="number" onChange={handleChangeValue} value={value} className="mx-5 text-center text-4xl font-slate-500 bg-transparent outline-0" placeholder="0"/>

                <div>
                    <button onClick={() => handlePlay(1)} className="m-5 p-2 px-3 bg-sky-500 rounded-lg text-white font-bold">Rock</button>
                    <button onClick={() => handlePlay(2)} className="my-5 p-2 px-3 bg-sky-500 rounded-lg text-white font-bold">Scissors</button>
                    <button onClick={() => handlePlay(3)} className="m-5 p-2 px-3 bg-sky-500 rounded-lg text-white font-bold">Paper</button>
                </div>

           </div>
        </section>
            
    )
}