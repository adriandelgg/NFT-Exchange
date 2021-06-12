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
		<>
			<label htmlFor="check-owner">Check Token's Owner: </label>
			<input
				type="number"
				id="check-owner"
				name="tokenOwner"
				value={tokenOwner}
				placeholder="Enter a Token ID:"
				onChange={e => setTokenOwner(e.target.value)}
			/>
			<button onClick={() => checkTokenOwner(tokenOwner)}>Check Owner</button>
		</>
	);
};

export default CheckTokenOwner;
