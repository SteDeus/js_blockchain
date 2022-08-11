const SHA256 = require("crypto-js/sha256");


class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {

  constructor(timestamp, transactions, previousHash = "") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
  }

  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce ++;
      this.hash = this.calculateHash();
    }

    console.log("Block mined: ", this.hash);
  }
}


class Blockchain {

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }
  createGenesisBlock() {
    return new Block(0, "01/01/2017", "Genesis Block", "0");
  }


  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  // addBlock(newBlock) {
  //   newBlock.previousHash = this.getLastBlock().hash;
  //   newBlock.mineBlock(this.difficulty);
  //   this.chain.push(newBlock);
  // }

  minePendingTransactions(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);

    console.log("Block successfully mined!");
    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ]
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if(transaction.fromAddress === address) {
          balance -= transaction.amount;
        }

        if (transaction.toAddress === address) {
          balance += transaction.amount;
        }
      }
    }

    return balance;
  }

  isChainValid() {
    for (let index = 1; index < this.chain.length; index++) {
      const currentBlock = this.chain[index];
      const previousBlock = this.chain[index - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
      
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}


let steCoin = new Blockchain();

// console.log("Mining block 1...");
// steCoin.addBlock(new Block(1, "10/07/2017", { amount: 4 }));
// console.log("Mining block 2...");
// steCoin.addBlock(new Block(2, "12/07/2017", { amount: 10}));

steCoin.createTransaction(new Transaction("address1", "address2", 100));
steCoin.createTransaction(new Transaction("address2", "address1", 50));

console.log("\nStarting the miner...");
steCoin.minePendingTransactions("ste");

console.log("\nBalance of ste is", steCoin.getBalanceOfAddress("ste"));

console.log("\nStarting the miner...");
steCoin.minePendingTransactions("ste");

console.log("\nBalance of ste is", steCoin.getBalanceOfAddress("ste"));
