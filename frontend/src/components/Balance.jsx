import useBalance from "../hooks/useBalance";

export default function Balance() {
    const balance = useBalance();
    return (
        <>
            <div className="m-6 ml-4">
                <h2 className="font-semibold text-2xl">Your Balance is Rs {balance}</h2>
            </div>
        </>
    )
}
