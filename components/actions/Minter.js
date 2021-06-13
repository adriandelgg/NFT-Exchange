import { useContext, useState } from 'react';
import { Web3Context } from '../context/Web3Context';

const Minter = () => {
	const { contract, account } = useContext(Web3Context);
	const [tokenInfo, setTokenInfo] = useState('');

	async function mintToken(token) {
		if (!tokenInfo) return;
		await contract.methods.mint(token).send({ from: account });
		setTokenInfo('');
	}

	return (
		<div className="action-card">
			<h3 className="text-center text-lg mb-3">Mint a New NFT</h3>
			<input
				className="input-field"
				type="text"
				id="mint"
				name="mint"
				value={tokenInfo}
				placeholder="Value to Mint"
				onChange={e => setTokenInfo(e.target.value)}
			/>
			<button
				className="py-1 px-4 mx-auto mt-4 bg-green-400 text-white font-bold w-max rounded"
				onClick={() => mintToken(tokenInfo)}
			>
				Mint Token
			</button>
		</div>
	);
};

export default Minter;
