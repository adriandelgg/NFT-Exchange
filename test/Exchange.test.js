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

	xdescribe('Owner Payable', async () => {
		it('should withdrawal all ether from contract', async () => {
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

			await contract.sellNFT(0, 25, { from: alice });
			const tokenOwner2 = await contract.ownerOf(0);

			assert.notEqual(alice, tokenOwner2);

			const seller = await contract.tokenSeller(0);
			assert.equal(alice, seller);

			const salePrice = await contract.soldToken(alice, 0);
			assert.equal(salePrice, 25);
		});

		xit('should pay seller after purchase', async () => {
			// Mints token and makes sure ID is 1
			await contract.mint('#FFFFF');
			const result = await contract.mint('#DDDDD');
			const tokenId = result.logs[0].args.tokenId;
			assert.equal(tokenId, 1);

			// Makes sure token transfer to contract is successful
			const transfer = await contract.sellNFT(tokenId, 3e12);
			let tokenOwner = await contract.ownerOf(1);

			assert.equal(tokenOwner, toChecksumAddress(transfer.receipt.to));

			// Makes sure Bob successfully bought token
			// And Alice got paid for it
			const balance = await web3.eth.getBalance(alice);
			await contract.buyToken(1, { from: bob, value: 3e12 });

			tokenOwner = await contract.ownerOf(1);
			assert.equal(tokenOwner, bob);

			const tokenPrice = await contract.soldToken(alice, 1);
			console.log(tokenPrice);

			const balanceAfter = await web3.eth.getBalance(alice);

			assert(balanceAfter > balance);
		});

		xit('should delete info from mappings after sale', async () => {
			await contract.mint('#FFFFF');
			await contract.mint('#FFbbF');
			await contract.sellNFT(1, 3e12);
			await contract.buyToken(1, { from: bob, value: 3e12 });

			const tokenPrice = await contract.soldToken(alice, 1);

			assert.notEqual(tokenPrice, 3e12);
			assert.equal(tokenPrice, 0);

			const tokenSeller = await contract.tokenSeller(1);

			assert.notEqual(tokenSeller, alice);
			assert.equal(tokenSeller, 0);
			console.log(tokenPrice);
			console.log(tokenSeller);
		});

		xit('should return all tokens contract owns', async () => {
			await contract.mint('#FFFFF');
			await contract.mint('#FFbbF');
			await contract.mint('#FFbF');
			await contract.mint('#FbbF');
			await contract.sellNFT(1, 3e12);
			await contract.sellNFT(2, 3e12);
			await contract.sellNFT(3, 3e12);
			await contract.sellNFT(4, 3e12);

			const contractBalance = await contract.balanceOf(contract.address);

			for (let i = 0; i < contractBalance; i++) {
				const result = await contract.tokenOfOwnerByIndex(contract.address, i);
				console.log(result);

				assert.equal(result, i + 1);
			}
		});

		xit('should return array of IDs', async () => {
			await contract.mint('#FFFFF');
			await contract.mint('#FFbbF');
			await contract.mint('#FFbF');
			await contract.mint('#FbbF');
			await contract.sellNFT(1, 3e12);
			await contract.sellNFT(2, 3e12);
			await contract.sellNFT(3, 3e12);
			await contract.sellNFT(4, 3e12);

			const result = await contract.tokensOwnedAndValues(contract.address, 2);
			console.log(result);

			assert.equal(result.length, 2);
		});

		it('should mint token, sell to exchange, and return struct w/ info', async () => {
			await contract.mint('#FFFFF');

			await contract.sellNFT(1, 3e12);
			let result = await contract.getTokenSellData(1);

			assert.equal(await contract.ownerOf(1), contract.address);

			await contract.buyToken(1, { from: bob, value: 3e12 });

			assert.equal(await contract.ownerOf(1), bob);

			result = await contract.getTokenSellData(1);

			console.log(result);
		});
	});
});
