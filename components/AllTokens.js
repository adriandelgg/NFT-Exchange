import { useContext } from 'react';
import { Web3Context } from './context/Web3Context';

const AllTokens = () => {
	const { contract, account } = useContext(Web3Context);
	// 1. Get all tokens the DEX is selling.
	// 2. Display the tokenId, colorString, sellPrice, and buy button.
	// 3. If a token is bought or sold, update the UI by checking for changes.

	async function getTokens() {
		const length = await contract.methods.getColorsLength().call();
		if (length == 0) return;
		for (let i = 0; i < length; i++) {
			let result = await contract.methods.colors(i).call();
			if (totalTokens.includes(result)) continue;
			setTotalTokens(prev => [...prev, result]);
		}
		console.log(totalTokens);
	}

	async function sellToken() {
		await contract.methods.sellToExchange(0, 3e12).send({ from: account });
	}

	return (
		<div>
			<button
				onClick={async () => {
					const result = await contract.methods.totalSupply().call();
					console.log(result);
				}}
			>
				All tokens Owned
			</button>
			<button
				onClick={async () => {
					const result = await contract.methods.balanceOf(account).call();
					console.log(result);
				}}
			>
				Balance of NFT
			</button>
			<button
				onClick={async () => {
					const result = await contract.methods.getColorsLength().call();
					console.log(result);
				}}
			>
				Total Minted Tokens
			</button>
			<button
				onClick={async () => {
					const result = await contract.methods.ownerOf(0).call();
					console.log(result);
				}}
			>
				Owner of Token
			</button>

			<button onClick={sellToken}>Sell Token to Contract</button>
		</div>
	);
};

export default AllTokens;
