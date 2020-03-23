import * as React from 'react';
import checkToken from '../methods/checktoken';
import notAuthenticated from '../methods/notAuthenticated';
import loadingScreen from '../methods/loadingscreen';
import logo from '../images/ppLogoNew.svg';

class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading : true
		};
	}

	async componentDidMount() {
		await checkToken();
		this.setState({ isLoading: false });
	}
	render() {
		if (this.state.isLoading) {
			return loadingScreen();
		} else {
			console.dir(`${process.env.REACT_APP_NAME} ${process.env.REACT_APP_VERSION}`);
			if (sessionStorage.getItem('authenticated') !== 'true') {
				return notAuthenticated();
			}
			return (
				<div className="container-fluid">
					<br />
					<h1>Powerpoint is suffering, Powerpoint is Colloquium</h1>
					<img src={logo} className="App-link" alt="logo" style={{ height: '80vh', maxWidth: '80vw' }} />
					<footer className="page-footer font-small">
						<div className="text-center navbar-text">
							{process.env.REACT_APP_NAME.toUpperCase()} : {process.env.REACT_APP_VERSION}
						</div>
					</footer>
				</div>
			);
		}
	}
}

export default Home;
