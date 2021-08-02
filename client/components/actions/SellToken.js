import { useContext, useState } from 'react';
import { Web3Context } from '../context/Web3Context';

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
			return alert('Sell price must be 2,000,000,000,000 (2e12) wei or more!');
		}

		if (tokenId && sellPrice) {
			sellNFT(tokenId, Number(sellPrice));
			console.log(sellToken);
			setSellToken({ tokenId: '', sellPrice: '' });
		} else {
			alert('Both Token ID & Sell Price must be filled in!');
		}
	}

	// Create event listener for every time someone sells a token to the NFT to update
	// the UI of all tokens being displayed

	return (
		<form className="action-card">
			<h3 className="text-center text-xl">Sell NFT</h3>

			<div className="flex flex-col p-2">
				<label className="p-1" htmlFor="sell-token-id">
					NFT ID:
				</label>

				<input
					className="input-field"
					type="number"
					name="tokenId"
					id="sell-token-id"
					placeholder="Token's ID to Sell:"
					value={sellToken.tokenId}
					min="0"
					required={true}
					onChange={handleChange}
				/>
			</div>
			<div className="flex flex-col p-2">
				<label className="p-1" htmlFor="sell-token-price">
					Sell Price:
				</label>
				<input
					className="input-field"
					type="number"
					name="sellPrice"
					id="sell-token-price"
					placeholder="Amount in wei:"
					value={sellToken.sellPrice}
					required={true}
					min="0"
					onChange={handleChange}
				/>
			</div>

			<button
				className="bg-green-400 text-white font-bold
				rounded mt-5 w-40 p-1 mx-auto"
				type="submit"
				onClick={handleSubmit}
			>
				Sell NFT
			</button>
		</form>
	);
};

export default SellToken;
