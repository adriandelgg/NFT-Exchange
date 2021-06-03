import Web3 from 'web3';
import { useState } from 'react';
import minterArtifact from '../build/contracts/ColorMinter.json';
import exchangeArtifact from '../build/contracts/Exchange.json';

let mintContract;
let exchangeContract;
let web3;

export default function MetaMask({ setAccount, account }) {
	const [totalTokens, setTotalTokens] = useState([]);

	async function ethEnabled() {
		try {
			if (!ethereum) {
				console.log('Enable MetaMask');
				return;
			}
			const accounts = await ethereum.request({
				method: 'eth_requestAccounts'
			});
			setAccount(accounts[0]);
			web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

			// Gets the network ID then gets the contract address from JSON file.
			const networkId = await web3.eth.net.getId();
			// const deployedNetwork = minterArtifact.networks[networkId];
			const deployedNetwork = exchangeArtifact.networks[networkId];
			mintContract = new web3.eth.Contract(
				minterArtifact.abi,
				deployedNetwork.address
			);
			exchangeContract = new web3.eth.Contract(
				exchangeArtifact.abi,
				deployedNetwork.address
			);
			getTokens();
		} catch (e) {
			console.log(e);
		}
	}

	async function getTokens() {
		const length = await mintContract.methods.getColorsLength().call();
		if (length == 0) return;
		for (let i = 0; i < length; i++) {
			let result = await mintContract.methods.colors(i).call();
			if (totalTokens.includes(result)) continue;
			setTotalTokens(prev => [...prev, result]);
		}
		console.log(totalTokens);
	}

	async function sendEther(e) {
		if (e.key == 'Enter') {
			await exchangeContract.methods
				.giveEther()
				.send({ from: account, value: web3.utils.toWei(e.target.value) });
		}
	}

	async function getBalance() {
		const result = await web3.eth.getBalance(
			'0xC3A7FE64948A2e17FD13f946d2010F787BE3E598'
		);

		console.log(result);
	}

	return (
		<>
			{!account && <button onClick={ethEnabled}>Enable MetaMask</button>}
			<input type="text" onKeyPress={sendEther} />
			<button onClick={getBalance}>Get Balance</button>
		</>
	);
}
