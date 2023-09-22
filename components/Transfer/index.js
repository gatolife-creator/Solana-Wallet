import { useState } from "react";
import {
  sendAndConfirmTransaction,
  Connection,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

export default function Transfer({ account, network, refreshBalance }) {
  const [transactionSig, setTransactionSig] = useState("");
  const [toAddress, setToAddress] = useState(null);

  const handleTransfer = async (e) => {
    e.preventDefault();

    try {
      setTransactionSig("");

      const connection = new Connection(network, "confirmed");
      const params = {
        fromPubkey: account.publicKey,
        lamports: 0.5 * LAMPORTS_PER_SOL,
        toPubkey: toAddress,
      };
      const signers = [
        {
          publicKey: account.publicKey,
          secretKey: account.secretKey,
        },
      ];

      const transaction = new Transaction();
      transaction.add(SystemProgram.transfer(params));
      const transactionSignature = await sendAndConfirmTransaction(
        connection,
        transaction,
        signers
      );

      setTransactionSig(transactionSignature);

      await refreshBalance();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form onSubmit={handleTransfer} className="my-6">
        <div className="flex items-center border-b border-indigo-500 py-2">
          <input
            type="text"
            className="w-full text-gray-700 mr-3 p-1 focus:outline-none"
            placeholder="送金先のウォレットアドレス"
            onChange={(e) => setToAddress(e.target.value)}
          />
          <input
            type="submit"
            className="p-2 text-white bg-indigo-500 focus:ring focus:ring-indigo-300 rounded-lg cursor-pointer"
            value="送金"
          />
        </div>
      </form>
      {transactionSig && (
        <>
          <span className="text-red-600">送金が完了しました!</span>
          <a
            href={`https://explorer.solana.com/tx/${transactionSig}?cluster=${network}`}
            className="border-double border-b-4 border-b-indigo-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            Solana Block Explorer でトランザクションを確認する
          </a>
        </>
      )}
    </>
  );
}
