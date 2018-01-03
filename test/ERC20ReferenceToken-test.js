const TestRPC = require('ethereumjs-testrpc');
const Web3 = require('web3');
const chai = require('chai');
const ensSimulator = require('ens-simulator');
const ERC20CompatibleReferenceToken = require('../js/ERC20CompatibleReferenceToken');

const assert = chai.assert;
const { utils } = Web3;
const log = (msg) => { if (process.env.MOCHA_VERBOSE) console.log(msg); };
const blocks = [];

describe('EIP777 ERC20-Compatible Reference Token Test', () => {
  let testrpc;
  let web3;
  let ens;
  let accounts;
  let referenceToken;

  before(async () => {
    testrpc = TestRPC.server({
     ws: true,
     gasLimit: 5800000,
     total_accounts: 10,
    });

    testrpc.listen(8546, '127.0.0.1');

    web3 = new Web3('ws://localhost:8546');
    accounts = await web3.eth.getAccounts();
    ens = await ensSimulator.deployENSSimulator(web3);
  });

  after(async () => { await testrpc.close(); });

 it('should deploy the ERC20-compatible reference token contract', async () => {
   referenceToken = await ERC20CompatibleReferenceToken.new(web3,
     'Reference Token',
     'XRT',
     18,
     { from: accounts[0] }
   );
   assert.ok(referenceToken.$address);
   log(referenceToken.$address);
 }).timeout(20000);

 it('should mint tokens for address 1', async () => {
    log(referenceToken.$address);
    blocks[0] = await web3.eth.getBlockNumber();
    log(`block 0 -> ${blocks[0]}`);
    referenceToken.ownerMint(accounts[1], 10, { gas: 300000, from: accounts[0] }
  ).then(async (data) => {
    log(data);
    blocks[1] = await web3.eth.getBlockNumber();
    log(`block 1 -> ${blocks[1]}`);
    const totalSupply = await referenceToken.totalSupply();
    assert.equal(10, totalSupply);
    const balance = await referenceToken.balanceOf(accounts[1]);
    assert.equal(balance, 10);
    blocks[1] = await web3.eth.getBlockNumber();
  });
 }).timeout(6000)
});
