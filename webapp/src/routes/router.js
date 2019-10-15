import * as React from 'react';
import { Redirect } from 'react-router';
import { Router, Link, Route } from 'react-router-dom';
import * as history from 'history';
import ContentPane from './contentpane';
import Login from './login';
import checkToken from '../methods/checktoken';
import loadingScreen from '../methods/loadingscreen';
import forgotPassword from './forgotPassword';

export var browserHistory = history.createBrowserHistory();

class Routes extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			wrongField : [],
			isLoggedIn : false,
			isLoading  : true
		};
	}

	logout () {
		sessionStorage.setItem('authenticated', false);
		sessionStorage.setItem('token', null);
		sessionStorage.setItem('username', null);
		sessionStorage.setItem('Authentication_Level', null);
		this.setState({ isLoggedIn: false });
	}

	async componentDidMount () {
		await checkToken();
		await this.setState({ isLoading: false });
	}

	render () {
		if (this.state.isLoading) {
			return loadingScreen();
		} else {
			return (
				<div>
					{sessionStorage.getItem('authenticated') === 'true' ? (
						<div>
							<Router history={browserHistory}>
								<nav className="navbar navbar-expand-md navbar-dark bg-dark rounded">
									<button
										className="navbar-toggler "
										type="button"
										data-toggle="collapse"
										data-target="#navbarNav"
										aria-controls="navbarNav"
										aria-expanded="false"
										aria-label="Toggle navigation">
										<span className="navbar-toggler-icon" />
									</button>
									<div className="collapse navbar-collapse justify-content-between" id="navbarNav">
										<div className="navbar-nav">
											<Link to="/" className="nav-link nav-item leftMargin10">
												Home
											</Link>
											<Link to="/info" className="nav-link nav-item leftMargin10">
												Info
											</Link>
											<Link to="/calendar" className="nav-link nav-item leftMargin10">
												Calendar
											</Link>
											<Link to="/table" className="nav-link nav-item leftMargin10">
												Table
											</Link>
											<Link to="/user" className="nav-link nav-item leftMargin10">
												My Profile
											</Link>
											{sessionStorage.getItem('Authentication_Level') === '10' ? (
												<Link to="/adminPanel" className="nav-link nav-item leftMargin10">
													Admin Panel
												</Link>
											) : null}
										</div>
										<div className="navbar-nav">
											<button className="btn btn-outline-success leftMargin10" onClick={() => this.logout()}>
												Logout
											</button>
										</div>
									</div>
								</nav>
								{sessionStorage.getItem('Pending_Presentation') === '1' ? <Redirect to="/user" /> : null}
								<ContentPane />
							</Router>
						</div>
					) : (
						<Router history={browserHistory}>
							<Login />
							<Route exact={true} path={'/forgot'} component={forgotPassword} />
						</Router>
					)}
				</div>
			);
		}
	}
}

export default Routes;
