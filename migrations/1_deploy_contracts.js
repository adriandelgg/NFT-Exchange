const ColorMinter = artifacts.require('ColorMinter');
const Exchange = artifacts.require('Exchange');
const Delgado = artifacts.require('Delgado');

module.exports = function (deployer) {
	deployer.deploy(ColorMinter);
	deployer.deploy(Exchange);
	deployer.deploy(Delgado);
};
