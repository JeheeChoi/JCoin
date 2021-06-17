// import sha-256 function
const SHA256 = require('crypto-js/sha256')

// define transaction
class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress
    this.toAddress = toAddress
    this.amount = amount
  }
}
class Block {
  // index - tells where this block positions in the chain
  // timestamp - tells when the block was created
  // data - information of data, amount, sender, receiver, etc
  // previousHash - a string that contains the hash of the previous block
  constructor(timestamp, transactions, previousHash = '') {
    // this.index = index
    this.timestamp = timestamp
    // this.data = data
    this.transactions = transactions
    this.previousHash = previousHash
    // add another property of this "hash" which contains the hash of our block
    this.hash = this.calculateHash()
    // nonce - random number to find block hash that's lower than current target
    this.nonce = 0
  }
  // a method to calculate the hash of the block
  // it takes the properties of the block, run them through the hash function
  // return the hash that identifies the block
  calculateHash() {
    // calculate hash and return the hash of index + previousHash + timeStamp + data object
    // and then take the output of sha256 as a string
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString()
  }

  // a method to create a transaction compute its hash and add it to an array
  // "Proof of work," aka "Mining"
  // Bitcoin requires the hash of a block to begin with certain amount of zeros
  // because you can't influence the output of a hash function,
  // you have to try a lot of combinations and get the hash that has enough numbers of zeros in front of it.
  // It requires a lot of computing power - it's called "Difficulty"
  // i.e, Bitcoin aims to create each new block every 10 min
  // As computers get faster, it'll require less time to mine a new block, the difficulty will be increased

  //a method that takes difficulty as a property
  mineBlock(difficulty) {
    //make the hash of JCoin block begin with certain amount of zeros
    //using while loop to keep looping until the hash starts with enough amount of zeros
    //that takes a substring of my hash 0 until difficulty(ex) 5)
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      // increase the number of the nonce
      this.nonce++

      //calculate the hash of this block
      this.hash = this.calculateHash()
    }

    console.log("Block mined: " + this.hash)

  }
}

class Blockchain {
  // initialize our blockchain
  constructor() {
    // array of blocks
    this.chain = [this.createGenesisBlock()]
    // set difficulty
    this.difficulty = 2
    // add a mining reward, a place to store pending transactions, a new method to mine a new block
    // pending transaction - In Bitcoin, the POW algorithm makes sure that every block is created every 10 min,
    // all the transactions that are made in between blocks are temporarily stored in the pending transactions array
    // and it can be added to the next block.
    this.pendingTransactions = []
    this.miningReward = 10
  }
  // Add first block of blockchain(Genesis block) method
  createGenesisBlock() {
    return new Block("03/01/2021", "Genesis block", "0")
  }
  // Return the latest block of the chain method
  getLatestBlock() {
    return this.chain[this.chain.length - 1]
  }
  // // Add a new block to the chain
  // addBlock(newBlock){
  //   // First, set the previous hash property of the new block as a lastest block
  //   newBlock.previousHash = this.getLatestBlock().hash
  //   // // recalculate its hash
  //   // newBlock.hash = newBlock.calculateHash()
  //   newBlock.mineBlock(this.difficulty)
  //
  //   // then push it on to the chain
  //   this.chain.push(newBlock)
  // }

  // Add a new mining method instead of using `addBlock`
  // this method receives mining reward address so that the miner can get the reward to their
  // wallet when successfully mined the block
  minePendingTransactions(miningRewardAddress) {
    // first, create a new block
    let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash)
    // mine
    block.mineBlock(this.difficulty)
    // print out mining success message
    console.log('HOORAY!!! Successfully mined a block!!!')
    // then add this block to the chain
    this.chain.push(block)
    // and then reset the pending transactions + create a new transaction to give the miner the reward
    this.pendingTransactions = [
      // new Transaction(fromAddress, toAddress, amount)
      new Transaction(null, miningRewardAddress, this.miningReward)
    ]
  }
  // add the transaction to pending transactions array
  createTransaction(transaction) {
    this.pendingTransactions.push(transaction)
  }

  // check the balance of the coin
  getBalanceOfAddress(address) {
    let balance = 0
    // loop over all the blocks of the blockchain
    for(const block of this.chain) {
      // loop over all the transactions of each block
      for(const trans of block.transactions) {
        // if the address is the sender's address,
        if(trans.fromAddress === address) {
          // reduce the amount from the balance
          balance -= trans.amount
        }
        // if the address is the receiver's address,
        if(trans.toAddress === address) {
          // add the amount to the balance
          balance += trans.amount
        }
      }
    }

    return balance
  }

  // check if the chain is valid
  isChainValid() {
    // loop over the chain
    for(let i = 1; i < this.chain.length; i++) {
      // grab the current block
      const currentBlock = this.chain[i]
      // and the previous one
      const previousBlock = this.chain[i - 1]
      // check if the blocks are properly linked with each other
      // check if the current block's hash matches with the hash
      if(currentBlock.hash !== currentBlock.calculateHash()) {
        return false
      }
      // check if the current block points the right previous block's hash
      if(currentBlock.previousHash !== previousBlock.hash) {
        return false
      }
    }

    return true
  }
}

// Test out my Blockchain

let jCoin = new Blockchain()
// create a new transaction 10 JCoin from address1 to address2
jCoin.createTransaction(new Transaction('address1', 'address2', 10))

console.log('\n Mining...')
jCoin.minePendingTransactions('miner-address')

// balance will be 0
console.log('\n Your Balance: ', jCoin.getBalanceOfAddress('miner-address'))

// since the mining reward will be sent once the next block is successfully mined,
// we mine another block to increase the balance
console.log('\n Mining...')
jCoin.minePendingTransactions('miner-address')

console.log('\n Your Balance: ', jCoin.getBalanceOfAddress('miner-address'))



// console.log('Mining block 1...')
// jCoin.addBlock(new Block(1, "03/02/2021", { amount: 3 }))
//
// console.log('Mining block 2...')
// jCoin.addBlock(new Block(2, "03/03/2021", { amount: 6 }))

// console.log(JSON.stringify(jCoin, null, 4))

// // Test out if the chain is valid

// console.log('Is blockchain valid? ' + jCoin.isChainValid())
// // Try to tamper by overwriting the data
// jCoin.chain[1].data = { amound: 100 }
// // trying to calculate the hash again
// jCoin.chain[1].hash = jCoin.chain[1].calculateHash()
// console.log('Is blockchain valid? ' + jCoin.isChainValid())
