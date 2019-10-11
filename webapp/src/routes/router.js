import * as React from 'react';
import { Redirect } from 'react-router';
import { Router, Link } from 'react-router-dom';
import jQuery from 'jquery';
import * as history from 'history';
import ContentPane from './contentpane';
import Login from './login';
import checkToken from '../methods/checktoken';
import loading from '../methods/loadingscreen';
import API_URL from '../variables';

export var browserHistory = history.createBrowserHistory();

class Routes extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			wrongField    : [],
			isLoggedIn    : false,
			isLoading     : true,
			username      : '',
			passwordInput : '',
			email         : ''
		};
		this.handleOnChange = this.handleOnChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	async handleSubmit () {
		if (!(this.state.wrongField.length === 0)) {
			alert(`Please Check your Input in ${this.state.wrongField.join(', ').replace(/_/g, ' ')}`);
		} else {
			await fetch(API_URL + '/users', {
				method  : 'POST',
				headers : {
					'Content-Type' : 'application/json'
				},
				body    : JSON.stringify({
					username : this.state.username,
					password : this.state.passwordInput
				})
			})
				.then((response) => response.json()) //Authentication
				.then((res) => {
					const response = res;
					if (response.authenticated === true) {
						//good Login
						sessionStorage.setItem('username', this.state.username);
						sessionStorage.setItem('token', response.token);
						sessionStorage.setItem('Authentication_Level', response.Authentication_Level);
						sessionStorage.setItem('Pending_Presentation', response.Pending_Presentation);
						sessionStorage.setItem('authenticated', response.authenticated);
						this.setState({
							isLoggedIn    : true,
							passwordInput : ''
						});
					}
					if (response.authenticated === false) {
						document.getElementById('error').innerHTML = 'Login failed. Please check your credentials.';
						sessionStorage.setItem('token', null);
						sessionStorage.setItem('username', null);
						sessionStorage.setItem('Authentication_Level', null);
						sessionStorage.setItem('Pending_Presentation', null);
						sessionStorage.setItem('authenticated', response.authenticated);
						this.setState({
							isLoggedIn : false
						});
					}
					if (response.authenticated === 'newUser') {
						sessionStorage.setItem('username', this.state.username);
						sessionStorage.setItem('token', response.token);
						(function ($) {
							$('#PasswordPopup').modal('toggle');
						})(jQuery);
					}
				});
		}
	}

	handleOnChange (e) {
		document.getElementById('error').innerHTML = '';
		sessionStorage.setItem('token', null);
		this.setState({ authenticated: false });
		this.setState({ [e.target.name]: e.target.value });
		if (e.target.value.includes("'")) {
			if (!e.target.className.includes('invalid')) {
				e.target.className = e.target.className + ' invalid';
				this.state.wrongField.push(e.target.name);
			}
		} else {
			if (e.target.className.includes('invalid')) {
				this.state.wrongField.splice(
					this.state.wrongField.findIndex((element) => {
						return element === e.target.name;
					}),
					1
				);
				e.target.className = e.target.className.replace('invalid', '');
			}
		}
	}

	toggleForgotPassword () {
		(function ($) {
			$('#ForgotPasswordPopup').modal('toggle');
		})(jQuery);
		document.getElementById('forgotPasswordForm').reset();
		document.getElementById('ForgotPasswordError').innerHTML = '';
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
			return loading();
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
						<Login />
					)}
				</div>
			);
		}
	}
}

export default Routes;
