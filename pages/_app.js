import '../styles/globals.css';
import { Web3Provider } from '../components/context/Web3Context';

function MyApp({ Component, pageProps }) {
	return (
		<Web3Provider>
			<Component {...pageProps} />;
		</Web3Provider>
	);
}

export default MyApp;
