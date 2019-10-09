import * as React from 'react';
import { Redirect } from 'react-router';
import { Router, Link } from 'react-router-dom';
import jQuery from 'jquery';
import * as history from 'history';
import ContentPane from './contentpane';
import logo from '../images/ppLogo.svg';
import altar from '../images/altar.svg';
import PasswordPopup from '../popups/PasswordPopup';
import ForgotPassword from '../popups/ForgotPasswordPopup';
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
		let ua = navigator.userAgent.toLowerCase();
		if (ua.indexOf('safari') !== -1) {
			if (ua.indexOf('chrome') <= -1) {
				let faded = document.getElementsByClassName('fade');
				while (faded.length) {
					faded[0].classList.remove('fade');
				}
			}
		}
	}

	render () {
		if (this.state.isLoading) {
			return loading();
		} else {
			return (
				<div>
					{sessionStorage.getItem('authenticated') === 'true' ? (
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
					) : (
						<div>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									this.handleSubmit();
								}}>
								<div className="container">
									<h1 style={{ paddingTop: '40px' }}>Colloquium Selector Robot</h1>
									<br />
									<img src={logo} className="App-link App-logo" alt="logo" style={{ maxHeight: '180px', marginTop: '30px' }} />
									<br />
									{/*<img src={altar} style={{ maxHeight: '300px' }} alt="altar" />*/}
									<div id="error" className="invalidText" />

									<div className="form-group centered">
										<div className="col-lg-4">
											<input type="text" name="username" id="InputUsername" className="form-control" placeholder="Username" onChange={this.handleOnChange} />
										</div>
									</div>
									<div className="form-group centered">
										<div className="col-lg-4">
											<input
												type="password"
												name="passwordInput"
												style={{ marginTop: '20px' }}
												id="InputPassword"
												className="form-control"
												placeholder="Password"
												onChange={this.handleOnChange}
											/>
										</div>
									</div>
									<button type="submit" className="btn btn-danger col-lg-2" style={{ marginTop: '20px' }}>
										Login
									</button>
									<div className="input-group centered">
										<p className="mt-3 input-group-btn">
											<button className="btn btn-link" type="button" onClick={this.toggleForgotPassword}>
												Forgot Password?
											</button>
										</p>
									</div>
								</div>
							</form>
							<PasswordPopup Username={this.state.username} />
							<ForgotPassword />
						</div>
					)}
				</div>
			);
		}
	}
}

export default Routes;
