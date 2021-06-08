const ColorMinter = artifacts.require('ColorMinter');

contract('ColorMinter', accounts => {
	const [alice, bob] = accounts;
	let contract;
	beforeEach(async () => {
		contract = await ColorMinter.new();
	});

	describe('Mint', async () => {
		xit('should mint token', async () => {
			const result = await contract.mint('#34532');
			const totalSupply = await contract.totalSupply();

			assert.equal(totalSupply, 1);
		});

		xit('should loop through tokens and save them', async () => {
			await contract.mint('#234324');
			await contract.mint('#234344');
			await contract.mint('#234314');
			const length = await contract.getColorsLength();
			const allTokens = [];
			for (let i = 0; i < length; i++) {
				allTokens.push(await contract.colors(i));
			}
			console.log(allTokens);
			assert.equal(length, allTokens.length);
		});

		xit('should save new token to array mapping', async () => {
			await contract.mint('#25321');
			await contract.mint('#25322');
			const result = await contract.tokenOwners(alice, 0);
			const result2 = await contract.tokenOwners(alice, 1);

			assert.equal(result, 0);
			assert.equal(result2, 1);
			assert.notEqual(result, result2);
		});

		xit('should return balance of alice tokens', async () => {
			await contract.mint('#25321');
			await contract.mint('#25322');
			const result = await contract.balanceOf(alice);
			console.log(result);

			assert.equal(result, 2);
		});
	});
});
