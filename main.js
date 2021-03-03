class Block{
  // index - tells where this block positions in the chain
  // timestamp - tells when the block was created
  // data - information of data, amount, sender, receiver, etc
  // previousHash - a string that contains the hash of the previous block
  constructor(index, timestamp, data, previousHash = ''){
      this.index = index
      this.timestamp = timestamp
      this.data = data
      this.previousHash = previousHash
      // add another property of this "hash" which contains the hash of our block
      this.hash = ''
    }
    // a method to calculate the hash of the block
    // it takes the properties of the block, run them through the hash function
    // return the hash that identifies the block
    calculateHash() {

    }
  }
}
