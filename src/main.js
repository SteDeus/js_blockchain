const { Blockchain, Transaction } = require("./blockchain")
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

const myKey = ec.keyFromPrivate("b568f8e9680e5bb3ac1d72289980c16cf5dd42394409091845c2a739875b5f91");
const myWalletAddress = myKey.getPublic("hex");

let steCoin = new Blockchain();

const transaction1 = new Transaction(myWalletAddress, "public key goes here", 10);
transaction1.signTransaction(myKey);
steCoin.addTransaction(transaction1);

console.log("\nStarting the miner...");
steCoin.minePendingTransactions(myWalletAddress);

console.log("\nBalance of ste is", steCoin.getBalanceOfAddress(myWalletAddress));

console.log("Is chain valid?", steCoin.isChainValid());