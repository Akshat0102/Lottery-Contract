// const path = require('path');
// const fs = require('fs');

// const solc = require('solc');

// const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
// const source = fs.readFileSync(lotteryPath, 'utf-8');

// // module.exports = solc.compile(source, 1).contracts[':Lottery'];
// console.log(solc.compile(source, 1));

const path = require("path");
const fs = require("fs");

//require solidity compiler
const solc = require("solc");

//using path and file system to read contract data
const lotteryPath = path.resolve(__dirname, "contracts", "Lottery.sol");
const source = fs.readFileSync(lotteryPath, "utf-8");

let input = {
  language: "Solidity",
  sources: {
    [lotteryPath]: {
      content: source,
    },
  },

  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

var output = JSON.parse(solc.compile(JSON.stringify(input)));

module.exports = {
  abi: output.contracts[[lotteryPath]]["Lottery"].abi,
  bytecode: output.contracts[[lotteryPath]]["Lottery"].evm.bytecode.object,
};