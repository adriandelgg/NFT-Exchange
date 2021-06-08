import { useContext } from 'react';
import { Web3Context } from '../context/Web3Context';

const Minter = () => {
	const { contract, account } = useContext(Web3Context);

	async function mintToken(e) {
		if (e.key == 'Enter') {
			await contract.methods.mint(e.target.value).send({ from: account });
		}
	}

	return (
		<div>
			<input type="text" name="mint" id="mint" onKeyPress={e => mintToken(e)} />
		</div>
	);
};

export default Minter;
