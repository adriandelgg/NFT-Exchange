import { useState, useContext, useEffect } from 'react';
import { Web3Context } from './context/Web3Context';

const DexInfo = () => {
	const { contract, account } = useContext(Web3Context);

	const [totalSupply, setTotalSupply] = useState(null);
	const [ownerBalance, setOwnerBalance] = useState(null);
	const [contractBalance, setContractBalance] = useState(null);
	const [totalMinted, setTotalMinted] = useState(null);

	// Sets all DEX info for the first time.
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

	// Updates the UI on any new events
	async function handleNewEvent() {
		setTotalSupply(await contract.methods.totalSupply().call());
		setOwnerBalance(await contract.methods.balanceOf(account).call());
		setContractBalance(
			await contract.methods.balanceOf(contract.options.address).call()
		);
		setTotalMinted(await contract.methods.totalSupply().call());
	}

	return (
		<div className="flex justify-around">
			<div className="text-center">
				<p>Total Supply:</p>
				<p>{totalSupply}</p>
			</div>
			<div className="text-center">
				<p>Your total NFTs:</p>
				<p>{ownerBalance}</p>
			</div>
			<div className="text-center">
				<p>NFTs Owned by Exchange:</p>
				<p>{contractBalance}</p>
			</div>
			<div className="text-center">
				<p>Total NFTs Minted:</p>
				<p>{totalMinted}</p>
			</div>
		</div>
	);
};

export default DexInfo;
