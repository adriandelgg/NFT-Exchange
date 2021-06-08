import { useContext } from 'react';
import { Web3Context } from './context/Web3Context';

const SellToken = () => {
	const { contract, account } = useContext(Web3Context);

	async function sellNFT(tokenId, sellPrice) {
		await contract.methods.sellNFT(tokenId, sellPrice).send({ from: account });
	}

	return (
		<>
			<form action="">
				<label htmlFor="nftid">NFT ID: </label>
				<input type="number" name="nftid" id="nftid" />

				<label htmlFor="selltoken">Sell Price: </label>
				<input type="text" name="selltoken" id="selltoken" />
				<button type="submit" onClick={() => sellNFT()}>
					Sell NFT
				</button>
			</form>
		</>
	);
};

export default SellToken;
