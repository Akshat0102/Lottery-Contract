path = require('path');
fs = require('fs');
solc = require('solc');

lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
source = fs.readFileSync(lotteryPath, 'utf-8');

module.exports = solc.compile(source, 1).contracts[':Lottery']