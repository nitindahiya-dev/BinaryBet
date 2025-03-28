import { Connection, PublicKey, clusterApiUrl, Transaction } from '@solana/web3.js';
import { AnchorProvider, Program, web3 } from '@project-serum/anchor';
import idl from './idl.json'; // Import the IDL (Interface Definition Language) file for the contract

const { SystemProgram } = web3;
const programID = new PublicKey("BHEAFrDV85GnGzuJDqR7xEujEptbAwxHZuPT76QDqtTk");

export const connectWallet = async () => {
  try {
    const provider = window.solana;
    if (!provider) throw new Error("No wallet found");
    await provider.connect();
    return provider.publicKey.toString();
  } catch (err) {
    console.error("Error connecting to wallet:", err);
  }
};

export const placeBet = async (betAmount, isEven) => {
  const provider = window.solana;
  const connection = new Connection(clusterApiUrl('devnet'));
  
  const wallet = window.solana;
  const program = new Program(idl, programID, new AnchorProvider(connection, wallet, {}));

  try {
    const betTransaction = await program.rpc.placeBet({
      accounts: {
        userAccount: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      args: [
        { amount: betAmount, prediction_is_even: isEven }
      ]
    });

    console.log("Transaction successful:", betTransaction);
  } catch (err) {
    console.error("Error placing bet:", err);
  }
};
