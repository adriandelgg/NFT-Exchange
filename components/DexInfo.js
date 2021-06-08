// Will contain all the info of the DEX like Total Supply, Total Tokens Minted
// and Balance of NFTs of the contract

import { useState, useContext, useEffect } from 'react';
import { Web3Context } from './context/Web3Context';

//DEX Total Supply - await contract.methods.totalSupply().call();
//Total Tokens Minted -
//Balance of NFTs the current user has - await contract.methods.balanceOf(account).call();
//Balance of NFTs of the contract - await contract.methods.balanceOf().call();

// Subscribe to transfer & mint events in order to update state with useEffect.

const DexInfo = () => {
	const { contract, account, web3 } = useContext(Web3Context);

	// Not working
	// if (web3) {
	// 	let subscribe = web3.eth
	// 		.subscribe('logs')
	// 		.then(console.log)
	// 		.catch(console.log);
	// }

	const [totalSupply, setTotalSupply] = useState(null);
	const [ownerBalance, setOwnerBalance] = useState(null);
	const [contractBalance, setContractBalance] = useState(null);
	const [totalMinted, setTotalMinted] = useState(null);

	async function handleContractBalance() {
		const balance = await contract.methods.balanceOf(contract).call();
		setContractBalance(balance);
	}

	async function handleTotalMinted() {
		const total = await contract.methods.totalSupply().call();
		setTotalSupply(result);
	}

	return <div></div>;
};

export default DexInfo;
