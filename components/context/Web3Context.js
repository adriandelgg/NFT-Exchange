import React, { createContext, useState } from 'react';

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
	const [web3, setWeb3] = useState(null);
	const [account, setAccount] = useState(null);
	const [contract, setContract] = useState(null);

	return (
		<Web3Context.Provider
			value={{ web3, setWeb3, account, setAccount, contract, setContract }}
		>
			{children}
		</Web3Context.Provider>
	);
};
