import { useContext, useState } from 'react';
import { Web3Context } from './context/Web3Context';

const AllTokens = () => {
	const { contract, account } = useContext(Web3Context);
	const [tokenIDs, setTokenIDs] = useState(null);
	// 1. Get all tokens the DEX is selling.
	// 2. Display the tokenId, colorString, sellPrice, and buy button.
	// 3. If a token is bought or sold, update the UI by checking for changes.

	// Use Ref to store previous state to compare new totalTokens array w/ last
	// to prevent unnecessary renders if the array is still the same

	async function getTokens() {
		const totalTokensForSale = await contract.methods
			.balanceOf(contract.options.address)
			.call();

		const allIds = [];

		for (let i = 0; i < totalTokensForSale; i++) {
			const result = await contract.methods
				.tokenOfOwnerByIndex(contract.options.address, i)
				.call();
			allIds.push(Number(result));
		}

		renderTokens(allIds);
	}

	async function renderTokens(tokenIdsArray) {
		const result = tokenIdsArray.map(async id => {
			const { tokenId, tokenValue } = await contract.methods
				.getTokenInfo(id)
				.call();

			return (
				<>
					<p>{tokenId}</p>
					<p>{tokenValue}</p>
				</>
			);
		});
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

			<button
				onClick={async () => {
					const result = await contract.methods.sellNFT();
				}}
			>
				Sell Token
			</button>

			<button onClick={getTokens}>Get IDs</button>
		</div>
	);
};

export default AllTokens;
