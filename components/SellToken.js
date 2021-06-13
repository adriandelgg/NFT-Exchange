import { useContext, useState } from 'react';
import { Web3Context } from './context/Web3Context';

const SellToken = () => {
	const { contract, account } = useContext(Web3Context);
	const [sellToken, setSellToken] = useState({ tokenId: '', sellPrice: '' });

	async function sellNFT(tokenId, sellPrice) {
		await contract.methods.sellNFT(tokenId, sellPrice).send({ from: account });
	}

	function handleChange({ target }) {
		const name = target.name;
		const value = target.value;
		setSellToken(prev => ({ ...prev, [name]: value }));
		console.log(sellToken);
	}

	function handleSubmit(e) {
		e.preventDefault();
		const { tokenId, sellPrice } = sellToken;

		if (Number(sellPrice) < 2e12) {
			alert('Sell price must be 2,000,000,000,000 (2e12) wei or greater!');
			return;
		}

		if (tokenId && sellPrice) {
			sellNFT(tokenId, Number(sellPrice));
			console.log(sellToken);
			setSellToken({ tokenId: '', sellPrice: '' });
		} else {
			alert('Both Token ID & Sell Price must be filled in!');
		}
	}

	// Create event listener for everytime someone sells a token to the NFT to update
	// the UI of all tokens being displayed

	return (
		<form className="flex">
			<div className="flex flex-col p-2">
				<label className="p-1" htmlFor="sell-token-id">
					NFT ID:
				</label>

				<input
					className="shadow appearance-none border rounded py-2 px-3 text-gray-700
				leading-tight focus:outline-none focus:shadow-outline"
					type="number"
					name="tokenId"
					id="sell-token-id"
					placeholder="Token's ID to Sell:"
					value={sellToken.tokenId}
					min="0"
					required={true}
					onChange={e => handleChange(e)}
				/>
			</div>
			<div className="flex flex-col p-2">
				<label className="p-1" htmlFor="sell-token-price">
					Sell Price:
				</label>
				<input
					className="shadow appearance-none border rounded py-2 px-3 text-gray-700
										leading-tight focus:outline-none focus:shadow-outline"
					type="number"
					name="sellPrice"
					id="sell-token-price"
					placeholder="Amount in wei:"
					value={sellToken.sellPrice}
					required={true}
					min="0"
					onChange={e => handleChange(e)}
				/>
			</div>
			<button
				className="bg-green-400 text-white font-bold
				rounded"
				type="submit"
				onClick={e => handleSubmit(e)}
			>
				Sell NFT
			</button>
		</form>
	);
};

export default SellToken;
