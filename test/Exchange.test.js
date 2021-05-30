// const Exchange = artifacts.require('Exchange');

// contract('Exchange', accounts => {
// 	const [alice, bob] = accounts;
// 	let contract;
// 	beforeEach(async () => {
// 		contract = await Exchange.new();
// 	});

// 	xdescribe('Owner', async () => {
// 		it("should say I'm the owner", async () => {
// 			const result = await contract.owner();
// 			assert.equal(result, alice);
// 		});

// 		it('should transfer ownership', async () => {
// 			const result = await contract.transferOwnership(bob);
// 			const newOwner = await contract.owner();
// 			assert.equal(newOwner, bob);
// 		});

// 		describe('', () => {});
// 	});
// });
