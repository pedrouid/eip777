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

  after(async () => {
    await testrpc.close();
  });

 it('should deploy the ERC20-compatible reference token contract', async () => {
   referenceToken = await ERC20CompatibleReferenceToken.new(web3,
     'ERC20 Compatible Reference Token',
     'XRT20',
     18
   );
   assert.ok(referenceToken.$address);
   const name = await referenceToken.name();
   assert.strictEqual(name, 'ERC20 Compatible Reference Token');
   log(`name: ${name}`);
   const symbol = await referenceToken.symbol();
   assert.strictEqual(symbol, 'XRT20');
   log(`symbol: ${symbol}`);
   const decimals = await referenceToken.decimals();
   assert.strictEqual(decimals, '18');
   log(`decimals: ${decimals}`);
   const totalSupply = await referenceToken.totalSupply();
   assert.strictEqual(totalSupply, '0');
   log(`totalSupply: ${totalSupply}`);
 }).timeout(20000);
});
