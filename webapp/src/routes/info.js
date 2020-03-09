import * as React from 'react';
import checkToken from '../methods/checktoken';
import notAuthenticated from '../methods/notAuthenticated';
import loadingScreen from '../methods/loadingscreen';
import categories from '../images/categoryTable.png';
class Info extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading : true
		};
	}
	async componentDidMount() {
		await checkToken();
		await this.setState({ isLoading: false });
	}
	render() {
		if (this.state.isLoading) {
			return loadingScreen();
		} else {
			if (sessionStorage.getItem('authenticated') !== 'true') {
				return notAuthenticated();
			}
			return (
				<div className="container-fluid">
					<h1 className="">Colloquium Cheatsheet</h1>
					<blockquote>
						<img src={categories} style={{ width: '60%', marginTop: '40px' }} alt="categories" />
					</blockquote>
				</div>
			);
		}
	}
}

export default Info;
