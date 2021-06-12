import { useContext, useState, useEffect } from 'react';
import { Web3Context } from './context/Web3Context';
import SellToken from './SellToken';
import CheckTokenOwner from './CheckTokenOwner';

const AllTokens = () => {
	const { contract, account, web3 } = useContext(Web3Context);
	const [tokensForSale, setTokensForSale] = useState(null);
	// 1. Listen for sold/unlisted token in order to only pop out that one from
	// the state and not have to fetch data from blockchain again.
	// 2. Listen for added new token in order to render only the new one
	//

	// Use Ref to store previous state to compare new totalTokens array w/ last
	// to prevent unnecessary renders if the array is still the same

	// Gets all tokens the exchange is selling & stores in state

	useEffect(() => {
		getTokens();
	}, []);

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

			// Pushes to beginning in order to display new listings first
			allTokens.unshift(tokenData);
		}
		setTokensForSale(allTokens);
	}

	// Listens for any transfers to render new tokens
	contract.events.allEvents(
		{
			filter: {
				Transfer: [0]
			},
			fromBlock: 'latest'
		},
		(err, result) => {
			getTokens();
			if (err) console.log('Event Error:' + err);
			console.log(result);
		}
	);

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
			<SellToken />
		</div>
	);
};

export default AllTokens;
