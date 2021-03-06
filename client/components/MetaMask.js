import Web3 from 'web3';
import { useContext } from 'react';
import { Web3Context } from './context/Web3Context';

export default function MetaMask() {
	const { web3, setWeb3, setAccount } = useContext(Web3Context);

	async function enableEth() {
		try {
			if (window.ethereum) {
				const accounts = await ethereum.request({
					method: 'eth_requestAccounts'
				});

				setAccount(accounts[0]);
				setWeb3(new Web3(Web3.givenProvider || 'http://localhost:8545'));

				// Use Mist/MetaMask's provider.
			} else if (window.web3) {
				web3 = window.web3;
				console.log('Injected web3 detected.');
			} else {
				console.log('Enable MetaMask');
			}
		} catch (e) {
			console.log(e);
		}
	}

	return (
		<div>
			<button
				className="bg-green-400 hover:bg-green-600 text-white font-bold py-1 px-4 rounded"
				onClick={enableEth}
			>
				Connect Wallet
			</button>
		</div>
	);
}
