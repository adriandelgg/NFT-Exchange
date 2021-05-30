import { useState, useRef, useEffect } from 'react';
import MetaMask from '../components/MetaMask';

export default function Home() {
	const [account, setAccount] = useState(null);

	async function mintToken(e) {
		if (e.key == 'Enter') {
			const result = await contract.methods
				.mint(e.target.value)
				.send({ from: account });
			setTotalTokens(prev => [...prev, result]);
		}
	}

	return (
		<>
			<MetaMask account={account} setAccount={setAccount} />
			<button onClick={() => console.log(account)}>Check Account</button>
			{/* <input
				type="text"
				name="minter"
				ref={tokenValue}
				id="minter"
				value={tokenValue.current}
				onChange={console.log(tokenValue.current)}
			/> */}
			<input
				type="text"
				name="mint"
				id="mint"
				onKeyPress={e => mintToken(e)}
			/>
			{/* <button onClick={() => mintToken()}>Mint</button> */}
		</>
	);
}
