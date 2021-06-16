import React, { createContext, useState, useEffect } from 'react';
import artifact from '../../build/contracts/Exchange.json';

export const Web3Context = createContext();

// Make it so account get updated dynamically if a user changes
// their account on MetaMask

export const Web3Provider = ({ children }) => {
	const [web3, setWeb3] = useState(null);
	const [account, setAccount] = useState(null);
	const [contract, setContract] = useState(null);

	useEffect(() => {
		if (web3) {
			enableContract();
		}
	}, [web3]);

	// Listens for a change in account and updates state
	ethereum.on('accountsChanged', accounts => {
		setAccount(accounts[0]);
	});

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

	return (
		<Web3Context.Provider
			value={{ web3, setWeb3, account, setAccount, contract, setContract }}
		>
			{children}
		</Web3Context.Provider>
	);
};
