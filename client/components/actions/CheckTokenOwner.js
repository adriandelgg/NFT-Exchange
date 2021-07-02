import { useState, useContext } from 'react';
import { Web3Context } from '../context/Web3Context';

const CheckTokenOwner = () => {
	const { contract } = useContext(Web3Context);
	const [tokenOwner, setTokenOwner] = useState('');

	async function checkTokenOwner(tokenId) {
		if (!tokenOwner) return;
		const result = await contract.methods.ownerOf(tokenId).call();
		console.log(result);
		// Show tokens owner on page
	}

	return (
		<div className="action-card">
			<label className="mb-3 text-center text-lg" htmlFor="check-owner">
				Check Token's Owner
			</label>
			<input
				className="input-field"
				type="number"
				id="check-owner"
				name="tokenOwner"
				value={tokenOwner}
				min="1"
				placeholder="Enter a Token ID:"
				onChange={e => setTokenOwner(e.target.value)}
			/>
			<button
				className="bg-blue-400 hover:bg-blue-500 text-white font-bold
					py-1 px-4 mx-auto mt-4 rounded"
				onClick={() => checkTokenOwner(tokenOwner)}
			>
				Check Owner
			</button>
		</div>
	);
};

export default CheckTokenOwner;
