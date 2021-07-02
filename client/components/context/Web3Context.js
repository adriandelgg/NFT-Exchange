import React, { createContext, useState, useEffect } from 'react';
import artifact from '../../../build/contracts/Exchange.json';

// Most likely failing because of artifact.
// Remove artifact and put contract values corresponding to the testnet

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
	const [web3, setWeb3] = useState(null);
	const [account, setAccount] = useState(null);
	const [contract, setContract] = useState(null);

	useEffect(() => {
		if (web3) {
			enableContract();
		}
	}, [web3]);

	useEffect(() => {
		ethereum.on('chainChanged', handleChainChanged);
		return () => ethereum.removeListener('chainChanged', handleChainChanged);
	}, []);

	function handleChainChanged(chainId) {
		window.location.reload();
	}

	// Listens for a change in account and updates state
	useEffect(() => {
		if (web3) {
			ethereum.on('accountsChanged', handleAccountsChanged);
			return () =>
				ethereum.removeListener('accountsChanged', handleAccountsChanged);
		}
	});

	function handleAccountsChanged(accounts) {
		setAccount(accounts[0]);
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

	return (
		<Web3Context.Provider
			value={{ web3, setWeb3, account, setAccount, contract, setContract }}
		>
			{children}
		</Web3Context.Provider>
	);
};
