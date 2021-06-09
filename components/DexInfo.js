// Will contain all the info of the DEX like Total Supply, Total Tokens Minted
// and Balance of NFTs of the contract

//DEX Total Supply - await contract.methods.totalSupply().call();
//Total Tokens Minted -
//Balance of NFTs the current user has - await contract.methods.balanceOf(account).call();
//Balance of NFTs of the contract - await contract.methods.balanceOf().call();

// Subscribe to transfer & mint events in order to update state with useEffect.

import { useState, useContext, useEffect } from 'react';
import { Web3Context } from './context/Web3Context';

const DexInfo = () => {
	const { contract, account } = useContext(Web3Context);

	const [totalSupply, setTotalSupply] = useState(null);
	const [ownerBalance, setOwnerBalance] = useState(null);
	const [contractBalance, setContractBalance] = useState(null);
	const [totalMinted, setTotalMinted] = useState(null);

	useEffect(() => {
		(async () => {
			setTotalSupply(await contract.methods.totalSupply().call());
			setOwnerBalance(await contract.methods.balanceOf(account).call());
			setContractBalance(
				await contract.methods.balanceOf(contract.options.address).call()
			);
			setTotalMinted(await contract.methods.totalSupply().call());
		})();
	}, []);

	// Listens for new events to update the UI on any changes:
	// Filter may not work, needs redeployement to test
	contract.events.allEvents(
		{
			filter: {
				Transfer: [0],
				TokenPurchased: [0],
				TokenTransferredToExchange: [0]
			},
			fromBlock: 'latest'
		},
		(err, result) => {
			handleNewEvent();
			if (err) console.log('Event Error:' + err);
			console.log(result);
		}
	);

	async function handleNewEvent() {
		setTotalSupply(await contract.methods.totalSupply().call());
		setOwnerBalance(await contract.methods.balanceOf(account).call());
		setContractBalance(
			await contract.methods.balanceOf(contract.options.address).call()
		);
		setTotalMinted(await contract.methods.totalSupply().call());
	}

	return (
		<div>
			<p>Total Supply: {totalSupply}</p>
			<p>Your total NFTs: {ownerBalance}</p>
			<p>Total NFTs Owned by Exchange: {contractBalance}</p>
			<p>Total NFTs Minted: {totalMinted}</p>
		</div>
	);
};

export default DexInfo;
