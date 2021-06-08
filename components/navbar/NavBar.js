import { useContext } from 'react';
import { Web3Context } from '../context/Web3Context';
import MetaMask from '../MetaMask';

const NavBar = () => {
	const { account } = useContext(Web3Context);

	return (
		<header>
			<h1>Logo</h1>
			<nav>
				{!account ? (
					<MetaMask />
				) : (
					<>
						<h3>Wallet Connected</h3>
						<button onClick={() => console.log(account)}>Check Account</button>
					</>
				)}
			</nav>
		</header>
	);
};

export default NavBar;
