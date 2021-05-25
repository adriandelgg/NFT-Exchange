const ColorMinter = artifacts.require('ColorMinter');
const Exchange = artifacts.require('Exchange');

module.exports = function (deployer) {
	deployer.deploy(ColorMinter);
	deployer.deploy(Exchange);
};

// console.log(Minter);
