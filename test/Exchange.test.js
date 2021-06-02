const Exchange = artifacts.require('Exchange');
const Web3 = require('web3');
const web3 = new Web3('HTTP://127.0.0.1:7545');

contract('Exchange', accounts => {
	const [alice, bob] = accounts;
	let contract;
	beforeEach(async () => {
		contract = await Exchange.new();
	});

	xdescribe('Owner', async () => {
		xit("should say I'm the owner", async () => {
			const result = await contract.owner();
			assert.equal(result, alice);
		});

		xit('should transfer ownership', async () => {
			const result = await contract.transferOwnership(bob);
			const newOwner = await contract.owner();
			assert.equal(newOwner, bob);
		});
	});

	describe('Owner Payable', async () => {
		it('should withdrawal all ether from contract', async () => {
			const initialAmount = web3.utils.fromWei(
				await web3.eth.getBalance(contract.address)
			);

			const tx = await contract.giveEther({
				from: alice,
				value: web3.utils.toWei('1')
			});
			console.log(tx);
			const newAmount = web3.utils.fromWei(
				await web3.eth.getBalance(contract.address)
			);
			console.log(initialAmount, newAmount);
			assert(initialAmount < newAmount);
		});
	});
});
