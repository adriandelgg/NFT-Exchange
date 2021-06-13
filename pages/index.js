import { useContext } from 'react';
import { Web3Context } from '../components/context/Web3Context';

import NavBar from '../components/navbar/NavBar';
import AllTokens from '../components/AllTokens';
import DexInfo from '../components/dexinfo/DexInfo';
import AllActions from '../components/actions/AllActions';

export default function Home() {
	const { web3, contract } = useContext(Web3Context);
	// After token mint, let user know by getting the token ID through
	// event logs. result.logs[0].args.tokenId

	return (
		<>
			<NavBar />
			<main>
				{web3 && contract && (
					<>
						<DexInfo />
						<AllActions />
						<AllTokens />
					</>
				)}
			</main>
		</>
	);
}
