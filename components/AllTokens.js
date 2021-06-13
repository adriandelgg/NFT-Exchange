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
	// ** Fix event listener firing & rendering too much

	// Use Ref to store previous state to compare new totalTokens array w/ last
	// to prevent unnecessary renders if the array is still the same

	// Gets all tokens the exchange is selling & stores in state

	useEffect(() => {
		getTokens();
	}, []);

	// useEffect(() => {
	// 	contract.once('Transfer', { fromBlock: 'latest' }, (err, result) => {
	// 		getTokens();
	// 		if (err) console.log('Event Error:' + err);
	// 		console.log(result);
	// 	});
	// 	return () => {
	// 		contract.once('Transfer', { fromBlock: 'latest' }, (err, result) => {
	// 			getTokens();
	// 			if (err) console.log('Event Error:' + err);
	// 			console.log(result);
	// 		});
	// 	};
	// });

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

	// contract.once(
	// 	'MyEvent',
	// 	{
	// 		filter: {
	// 			Transfer: [0]
	// 		},
	// 		fromBlock: 'latest' // Using an array means OR: e.g. 20 or 23
	// 	},
	// 	(err, result) => {
	// 		getTokens();
	// 		if (err) console.log('Event Error:' + err);
	// 		console.log(result);
	// 	}
	// );

	// // Listens for any transfers to render new tokens
	// contract.events.allEvents(
	// 	{
	// 		filter: {
	// 			Transfer: [0]
	// 		},
	// 		fromBlock: 'latest'
	// 	},
	// 	(err, result) => {
	// 		getTokens();
	// 		if (err) console.log('Event Error:' + err);
	// 		console.log(result);
	// 	}
	// );

	async function buyToken(tokenId, tokenPrice) {
		await contract.methods
			.buyToken(tokenId)
			.send({ from: account, value: tokenPrice });
	}

	return (
		<>
			<CheckTokenOwner />
			<SellToken />
			<section className="flex flex-wrap justify-center align-center">
				{tokensForSale &&
					tokensForSale.map(token => {
						const { tokenId, tokenColor, tokenOwner, tokenSalePrice } = token;

						return (
							<div
								className="flex flex-col text-center bg-gray-100 rounded m-3 py-3 shadow-lg w-60"
								key={tokenId}
							>
								<h5 className="text-lg font-medium">{tokenColor}</h5>
								<p>Token ID: {tokenId}</p>
								<p>Price: {web3.utils.fromWei(tokenSalePrice)} Ξ Ether</p>
								<button
									className="bg-green-400 hover:bg-green-500 text-white font-bold
										py-1 px-4 w-28 rounded mx-auto mt-2
									"
									onClick={() => buyToken(tokenId, tokenSalePrice)}
								>
									BUY
								</button>
								<div className="pt-2">
									<p className="text-xs">Owner:</p>
									<p className="text-xxs text-gray-500">{tokenOwner}</p>
								</div>
							</div>
						);
					})}
			</section>
		</>
	);
};

export default AllTokens;
