// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

contract Lottery{
    address public manager;
    address[] public players;

    constructor() {
        manager = msg.sender;
    }

    function enterLottery() public payable{
        //players need to atleast pitch in 0.1 ether to enter the tournament
        require(msg.value > 0.1 ether);
        players.push(msg.sender);
    }

    function randomGen() private view returns(uint){
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }

    function pickWinner() public restricted{
        //getting pseudo-random index with randomGen()
        uint idx = randomGen() % players.length;

        //transfering lottery amount to winner
        payable(players[idx]).transfer(address(this).balance);  

        //reseting the players to 0 
        players = new address[](0);
    }

    //making a restricted modifier allowing only manager to pick Winner
    modifier restricted(){
        require(msg.sender==manager);
        _;
    }

    //function to get the addresses of all the players entered
    function getPlayers() public view returns(address[] memory) {
        return players;
    }
}