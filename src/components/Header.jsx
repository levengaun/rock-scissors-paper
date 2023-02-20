

export default function Header() {
    return (
        <header>
            <section className="p-1 bg-yellow-500 text-center">
                <h2 className="font-bold">dApp working on Binance Smart Chain - Testnet</h2>
            </section>
            <nav className="p-3 px-5 flex justify-between items-center">
                <h2>Rock Scissors Paper</h2>
                <button className="p-2 px-3 bg-yellow-500 rounded-lg text-white font-bold">Connect Wallet</button>
            </nav>
            <hr />
        </header>
    )
}