import * as React from 'react';
import logo from '../images/ppLogoNew.svg';
import checkToken from '../methods/checktoken';
import notAuthenticated from '../methods/notAuthenticated';
import loading from '../methods/loadingscreen';
class Home extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			isLoading : true
		};
	}

	async componentDidMount () {
		await checkToken();
		this.setState({ isLoading: false });
	}
	render () {
		if (this.state.isLoading) {
			return loading();
		} else {
			if (sessionStorage.getItem('authenticated') !== 'true') {
				return notAuthenticated();
			}
			return (
				<div className="container-fluid">
					<br />
					<h1>Powerpoint is suffering, Powerpoint is Colloquium</h1>
					<img src={logo} className="App-link App-logo-extreme" alt="logo" />
					<br />
					<br />
					<br />
					<small className="text-danger small">When Life gives you Lemons... BLOOD FOR THE BLOOD GOD!</small>
					<br />
					<small className="text-danger">SKULLS FOR THE SKULL THRONE</small>
				</div>
			);
		}
	}
}

export default Home;
