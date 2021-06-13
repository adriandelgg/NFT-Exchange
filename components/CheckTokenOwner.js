import { useState, useContext } from 'react';
import { Web3Context } from './context/Web3Context';

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
		<div className="flex flex-col w-56">
			<label className="p-1" htmlFor="check-owner">
				Check Token's Owner:
			</label>
			<input
				className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
										py-1 px-4 w-32 rounded mx-auto mt-2"
				onClick={() => checkTokenOwner(tokenOwner)}
			>
				Check Owner
			</button>
		</div>
	);
};

export default CheckTokenOwner;
