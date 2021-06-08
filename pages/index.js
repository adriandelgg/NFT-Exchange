import { useState, useRef, useEffect, useContext } from 'react';
import AllTokens from '../components/AllTokens';
import Minter from '../components/mint/Minter';
import NavBar from '../components/navbar/NavBar';

export default function Home() {
	// After token mint, let user know by getting the token ID through
	// event logs. result.logs[0].args.tokenId

	return (
		<>
			<NavBar />
			<main>
				<Minter />
				<AllTokens />
			</main>
		</>
	);
}
