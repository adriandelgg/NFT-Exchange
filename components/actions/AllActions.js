import SellToken from './SellToken';
import CheckTokenOwner from './CheckTokenOwner';
import Minter from './Minter';

const AllActions = () => {
	return (
		<section className="flex flex-wrap justify-center align-center m-5">
			<Minter />
			<SellToken />
			<CheckTokenOwner />
		</section>
	);
};

export default AllActions;
