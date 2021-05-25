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

		it('should loop through tokens and save them', async () => {
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
	});
});
