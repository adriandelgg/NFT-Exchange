import Web3 from 'web3';
import { useContext, useEffect } from 'react';

import { Web3Context } from './context/Web3Context';
import artifact from '../build/contracts/Exchange.json';

export default function MetaMask() {
	const { web3, setWeb3, setAccount, setContract } = useContext(Web3Context);

	useEffect(() => {
		if (web3) {
			enableContract();
		}
	}, [web3]);

	async function ethEnabled() {
		try {
			if (ethereum) {
				const accounts = await ethereum.request({
					method: 'eth_requestAccounts'
				});
				setAccount(accounts[0]);
				setWeb3(new Web3(Web3.givenProvider || 'http://localhost:8545'));

				// Use Mist/MetaMask's provider.
			} else if (window.web3) {
				const web3 = window.web3;
				console.log('Injected web3 detected.');
			} else {
				console.log('Enable MetaMask');
			}
		} catch (e) {
			console.log(e);
		}
	}

	async function enableContract() {
		try {
			// Gets the network ID then gets the contract address from JSON file.
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = artifact.networks[networkId];
			const contract = new web3.eth.Contract(
				artifact.abi,
				deployedNetwork.address
			);
			setContract(contract);
		} catch (e) {
			console.log(e);
		}
	}

	return <button onClick={ethEnabled}>Enable MetaMask</button>;
}

// async function getTokens() {
// 	const length = await contract.methods.getColorsLength().call();
// 	if (length == 0) return;
// 	for (let i = 0; i < length; i++) {
// 		let result = await contract.methods.colors(i).call();
// 		if (totalTokens.includes(result)) continue;
// 		setTotalTokens(prev => [...prev, result]);
// 	}
// 	console.log(totalTokens);
// }

// async function sendEther(e) {
// 	if (e.key == 'Enter') {
// 		await contract.methods
// 			.giveEther()
// 			.send({ from: account, value: web3.utils.toWei(e.target.value) });
// 	}
// }

// async function getBalance() {
// 	const result = await web3.eth.getBalance(
// 		'0xC3A7FE64948A2e17FD13f946d2010F787BE3E598'
// 	);

// 	console.log(result);
// }

// <input type="text" onKeyPress={sendEther} />
// 			<button onClick={getBalance}>Get Balance</button>
