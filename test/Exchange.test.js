const Exchange = artifacts.require('Exchange');
const Web3 = require('web3');
const web3 = new Web3('HTTP://127.0.0.1:7545');
const createKeccakHash = require('keccak');

function toChecksumAddress(address) {
	address = address.toLowerCase().replace('0x', '');
	var hash = createKeccakHash('keccak256').update(address).digest('hex');
	var ret = '0x';

	for (var i = 0; i < address.length; i++) {
		if (parseInt(hash[i], 16) >= 8) {
			ret += address[i].toUpperCase();
		} else {
			ret += address[i];
		}
	}

	return ret;
}

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
		xit('should mint, sell, and update mappings correctly', async () => {
			await contract.mint('#FFFFF');
			const tokenOwner = await contract.ownerOf(0);

			assert.equal(alice, tokenOwner);

			await contract.sellToExchange(0, 25, { from: alice });
			const tokenOwner2 = await contract.ownerOf(0);

			// console.log(tokenOwner, tokenOwner2);
			assert.notEqual(alice, tokenOwner2);

			// const seller = await contract.tokenSeller(0);
			// assert.equal(alice, seller);

			// const salePrice = await contract.soldToken(alice, 0);
			// assert.equal(salePrice, 25);
		});

		it('should pay seller after purchase', async () => {
			await contract.mint('#FFFFF');
			const result = await contract.mint('#DDDDD');
			const tokenId = result.logs[0].args.tokenId;
			assert.equal(tokenId, 1);

			const transfer = await contract.sellToExchange(tokenId, 3e12);
			let tokenOwner = await contract.ownerOf(1);

			assert.equal(tokenOwner, toChecksumAddress(transfer.receipt.to));

			const balance = await web3.eth.getBalance(alice);

			await contract.buyToken(1, { from: bob, value: 3e12 });

			tokenOwner = await contract.ownerOf(1);
			const tokenPrice = await contract.soldToken(alice, 1);
			console.log(tokenPrice);
			const balanceAfter = await web3.eth.getBalance(alice);

			assert.equal(tokenOwner, bob);
			assert(balanceAfter > balance);
		});
	});
});
