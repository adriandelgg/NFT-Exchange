const Intro = () => {
	return (
		<section className="mt-20 text-center flex flex-col justify-center items-center">
			<h1 className="text-3xl p-2">NFT Decentralized Exchange</h1>
			<h2 className="text-xl p-2">by Adrian Delgado</h2>
			<div className="m-4">
				<p>
					To try this dApp, please connect your MetaMask wallet to the Rinkeby
					test network.
				</p>
				<p className="m-3">
					Need fake Ether to try out the dApp? <br />
					Head over to the Rinkeby Ether Faucet to get some free test Ether!
				</p>
			</div>
			<button
				className="py-1 px-4 mx-auto bg-green-400
        text-white font-bold w-max rounded"
			>
				<a href="https://faucet.rinkeby.io/" target="_blank">
					Get Test Ether
				</a>
			</button>
		</section>
	);
};

export default Intro;
