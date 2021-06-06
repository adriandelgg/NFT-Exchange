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
		xit('should withdrawal all ether from contract', async () => {
			const initialAmount = await web3.eth.getBalance(contract.address);
			const tx = await contract.giveEther({
				from: alice,
				value: web3.utils.toWei('2')
			});
			console.log(tx);
			const newAmount = await web3.eth.getBalance(contract.address);
			console.log(newAmount);
			assert(initialAmount < newAmount);
		});
	});

	describe('Mint & Sell', () => {
		it('should mint, sell, and update mappings correctly', async () => {
			await contract.mint('#FFFFF');
			const tokenOwner = await contract.ownerOf(0);

			assert.equal(alice, tokenOwner);

			await contract.sellToExchange(0, 25);
			const tokenOwner2 = await contract.ownerOf(0);

			assert.notEqual(alice, tokenOwner2);

			const seller = await contract.tokenSeller(0);
			assert.equal(alice, seller);

			const salePrice = await contract.soldToken(alice, 0);
			assert.equal(salePrice, 25);
		});
	});
});