const assert = require('assert');
const ganache = require('ganache');

const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { abi, bytecode } = require('../compile');

let lottery, accounts;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: '1000000' })
});

describe('Lottery Contract', () => {

    //test to check if the contract is getting deployed
    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
    });

    //test to check if a player is able to enter and the address is stored in players array
    it('allows an account to enter', async () => {
        await lottery.methods.enterLottery().send({
            from: accounts[0],
            value: web3.utils.toWei('0.2', 'ether')
        })
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        })
        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length)
    });

    //test to check if multiple players are able to enter and there address are stored in players array
    it('allows multiple accounts to enter', async () => {
        await lottery.methods.enterLottery().send({
            from: accounts[0],
            value: web3.utils.toWei('0.2', 'ether')
        });
        await lottery.methods.enterLottery().send({
            from: accounts[1],
            value: web3.utils.toWei('0.2', 'ether')
        });
        await lottery.methods.enterLottery().send({
            from: accounts[2],
            value: web3.utils.toWei('0.2', 'ether')
        });
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        })
        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length)
    });

    //test to check if a player is providing required amount of funds for Lottery
    it('requires a min amount of fund(ether) to enter', async () => {
        try {
            await lottery.methods.enterLottery().send({
                from: accounts[0],
                value: 200
            })
            //assert to cause test to fail if err doesn't occurs
            assert(false);
        } catch (err) {
            assert(err);
            console.log("Insufficient Amount of funds");
        }
    });

    //test to check the function modifier
    it('testing function modifier(only manager can choose winner)', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            })
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    //end-to-end test
    it('sends fund to winner and resets players', async () => {

        await lottery.methods.enterLottery().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        })
        const initialBalance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({
            from: accounts[0],
        })
        const finalBalance = await web3.eth.getBalance(accounts[0]);

        const difference = finalBalance - initialBalance;

        assert(difference > web3.utils.toWei('1.8', 'ether'));

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        })
        assert.equal(0, players.length);
    });
});