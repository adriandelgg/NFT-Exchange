import { useContext, useState, useRef } from 'react';
import { Web3Context } from '../components/context/Web3Context';
import { create } from 'ipfs-http-client';

const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const Minter = () => {
	const { contract, account } = useContext(Web3Context);

	const NFT = useRef({ name: '', description: '', img: '' });

	// Updates the metadata for the NFT
	function handleChange(e) {
		const name = e.target.name;
		const value = e.target.value;
		NFT.current = { ...NFT.current, [name]: value };
	}

	// Gets submitted file & buffers it for IPFS
	function handleFile(e) {
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.readAsArrayBuffer(file);
		reader.onload = () => {
			NFT.current = { ...NFT.current, img: Buffer(reader.result) };
			console.log(NFT.current);
		};
	}

	// Adds file to IPFS and mints a new NFT with it. gets the hash back
	// Create a pop up for user with minted NFT URL
	async function mintToken(e) {
		e.preventDefault();
		const { name, description, img } = NFT.current;
		if (name && description && img) {
			const { path } = await ipfs.add(NFT.current.img);
			NFT.current = { ...NFT.current, img: `https://ipfs.io/ipfs/${path}` };

			const { path: hash } = await ipfs.add(JSON.stringify(NFT.current));
			console.log(NFT.current);
			console.log(`https://ipfs.io/ipfs/${hash}`);
			await contract.methods.mintNFT(hash).send({ from: account, value: 1e12 });
		}
	}

	return (
		<form className="flex flex-col">
			<h3 className="text-center text-lg mb-3">Mint a New NFT</h3>
			<label className="p-1" htmlFor="new-nft-name">
				Name:
			</label>
			<input
				className="input-field"
				id="new-nft-name"
				type="text"
				name="name"
				placeholder="New NFT's name:"
				required={true}
				onChange={handleChange}
			/>
			<label className="p-1" htmlFor="new-nft-description">
				Description:
			</label>
			<textarea
				className="input-field"
				id="new-nft-description"
				name="description"
				cols="30"
				rows="5"
				placeholder="New NFT's description:"
				required={true}
				onChange={handleChange}
			/>
			<input
				type="file"
				name="add-file"
				id="add-file"
				required={true}
				onChange={handleFile}
			/>
			<button
				className="py-1 px-4 mx-auto mt-4 bg-green-400
        text-white font-bold w-max rounded"
				type="submit"
				onClick={mintToken}
			>
				Submit
			</button>
		</form>
	);
};

export default Minter;
