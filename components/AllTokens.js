import { useContext, useState } from 'react';
import { Web3Context } from './context/Web3Context';
import SellToken from './SellToken';
import CheckTokenOwner from './CheckTokenOwner';

const AllTokens = () => {
	const { contract, account, web3 } = useContext(Web3Context);
	const [tokensForSale, setTokensForSale] = useState(null);
	// 1. Get all tokens the DEX is selling.
	// 2. Display the tokenId, colorString, sellPrice, and buy button.
	// 3. If a token is bought or sold, update the UI by checking for changes.

	// Use Ref to store previous state to compare new totalTokens array w/ last
	// to prevent unnecessary renders if the array is still the same

	// Gets all tokens the exchange is selling & stores in state
	async function getTokens() {
		const totalTokens = await contract.methods
			.balanceOf(contract.options.address)
			.call();

		// Array containing all metadata
		const allTokens = [];

		// Loops through contract's array of owned tokens
		for (let i = 0; i < totalTokens; i++) {
			// Gets token IDs
			const result = await contract.methods
				.tokenOfOwnerByIndex(contract.options.address, i)
				.call();

			// Gets all tokens' metadata using the IDs
			const tokenData = await contract.methods
				.getTokenSellData(Number(result))
				.call();
			allTokens.push(tokenData);
		}
		setTokensForSale(allTokens);
	}

	return (
		<div>
			<CheckTokenOwner />
			{tokensForSale &&
				tokensForSale.map(token => {
					const { tokenId, tokenColor, tokenOwner, tokenSalePrice } = token;

					return (
						<div key={tokenId}>
							<h5>{tokenColor}</h5>
							<p>Price: {web3.utils.fromWei(tokenSalePrice)} Ether</p>
							<p>Token ID: {tokenId}</p>
							<p>Owner: {tokenOwner}</p>
						</div>
					);
				})}
			<button
				onClick={async () => {
					const result = await contract.methods
						.sellNFT(3)
						.send({ from: account });
				}}
			>
				Sell Token
			</button>

			<button onClick={getTokens}>Get IDs</button>
			<button onClick={() => console.log(tokensForSale)}>
				Log Tokens 4 Sale
			</button>
			<SellToken />
		</div>
	);
};

export default AllTokens;
