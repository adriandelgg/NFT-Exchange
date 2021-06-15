import { useState } from 'react';
import { create, globSource } from 'ipfs-http-client';

const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const IPFS = () => {
	const [NFT, setNFT] = useState({ name: '', description: '', img: '' });
	const [NFTFile, setNFTFile] = useState(null);

	// Updates the metadata for the NFT
	function handleChange(e) {
		const name = e.target.name;
		const value = e.target.value;
		setNFT(prev => ({ ...prev, [name]: value }));
	}

	// Gets submitted file & buffers it for IPFS
	function handleFile(e) {
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.readAsArrayBuffer(file);
		reader.onload = () => {
			setNFTFile(Buffer(reader.result));
		};
	}

	// Adds file to IPFS and gets the hash back
	// Create a pop up for user with minted NFT URL
	async function handleSubmit(e) {
		e.preventDefault();
		const { name, description } = NFT;
		if (name && description && NFTFile) {
			const { path } = await ipfs.add(NFTFile);
			setNFT(prev => ({ ...prev, img: `https://ipfs.io/ipfs/${path}` }));
			const { path: hash } = await ipfs.add(JSON.stringify(NFT));
			console.log(`https://ipfs.io/ipfs/${hash}`);
		}
	}

	return (
		<form>
			<label htmlFor="new-nft-name">Name:</label>
			<input
				type="text"
				name="name"
				id="new-nft-name"
				placeholder="Your new NFT's name:"
				required={true}
				onChange={handleChange}
			/>
			<label htmlFor="new-nft-description">Description:</label>
			<textarea
				name="description"
				id="new-nft-description"
				cols="30"
				rows="5"
				placeholder="Enter the description you want for your NFT:"
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
			<button type="submit" onClick={handleSubmit}>
				Submit
			</button>
		</form>
	);
};

export default IPFS;
