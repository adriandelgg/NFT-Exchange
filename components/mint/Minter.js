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
		<div>
			<input
				type="text"
				id="mint"
				name="mint"
				value={tokenInfo}
				placeholder=""
				onChange={e => setTokenInfo(e.target.value)}
			/>
			<button onClick={() => mintToken(tokenInfo)}>Mint New Token</button>
		</div>
	);
};

export default Minter;
