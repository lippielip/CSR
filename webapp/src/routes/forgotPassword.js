import * as React from 'react';
import loadingScreen from '../methods/loadingscreen';
import checkResetToken from '../methods/checkResetToken';
import notAuthenticated from '../methods/notAuthenticated';
import API_URL from '../variables';
import { browserHistory } from '../router';

let statusCode;
class forgotPassword extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			isLoading: true,
			statusCode: ''
		};
	}
	handleChange (e) {
		document.getElementById('ResetPasswordError').innerHTML = '';
		if (e.target.value.includes("'")) {
			if (!e.target.classList.contains('invalid')) e.target.classList.add('invalid');
		} else {
			if (e.target.classList.contains('invalid')) e.target.classList.remove('invalid');
		}
	}
	async handleSubmit () {
		if (document.getElementById('forgotPasswordInput').className.includes('invalid')) {
			document.getElementById('ResetPasswordError').innerHTML = 'Forbidden Characters detected.';
		} else {
			if (document.getElementById('forgotPasswordInput').value === document.getElementById('forgotConfirmPasswordInput').value) {
				if (document.getElementById('forgotPasswordInput').value === '') {
					document.getElementById('ResetPasswordError').innerHTML = 'Nothing to submit';
				} else {
					await fetch(API_URL + '/forgotPasswordSubmit', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							password: document.getElementById('forgotPasswordInput').value,
							confirmPassword: document.getElementById('forgotConfirmPasswordInput').value,
							token: new URLSearchParams(window.location.search).get('token')
						})
					}).then((response) => {
						if (response.status === 200) {
							document.getElementById('ResetPasswordSuccess').innerHTML = 'Password successfully changed!';
							window.setTimeout(function () {
								browserHistory.push('/');
							}, 1500);
						} else {
							if (response.status === 404) {
								document.getElementById('ResetPasswordError').innerHTML = 'Password was not changed!';
							}
						}
					});
				}
			} else {
				document.getElementById('ResetPasswordError').innerHTML = "Passwords don't match";
			}
		}
	}

	async componentDidMount () {
		statusCode = await checkResetToken(new URLSearchParams(window.location.search).get('token'));
		this.setState({ isLoading: false });
	}

	render () {
		if (this.state.isLoading) {
			return loadingScreen();
		} else {
			if (statusCode === 200) {
				return (
					<div className="container">
						<div className="row">
							<div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
								<div className="card card-signin my-5">
									<div className="card-body">
										<h5 className="card-title text-center text-dark">Reset Password</h5>
										<form
											className="form-signin"
											onSubmit={(e) => {
												this.handleSubmit();
												e.preventDefault();
											}}
											method="post">
											<input className="form-control" type="hidden" name="token" />
											<div>
												<input
													className="form-control mb-4"
													type="password"
													name="password"
													id="forgotPasswordInput"
													placeholder="Enter your new Password"
													required=""
													autoFocus=""
													pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,}$"
													title="Must contain at least one number, uppercase and lowercase letter, and at least 8 characters"
													onChange={this.handleChange}
												/>
											</div>
											<div>
												<input
													className="form-control mb-6"
													type="password"
													name="confirmPassword"
													id="forgotConfirmPasswordInput"
													placeholder="Confirm your new Password"
													required=""
													pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,}$"
													title="Must contain at least one number, one uppercase and lowercase letter, and at least 8 characters"
													onChange={this.handleChange}
												/>
											</div>
											<div id="ResetPasswordError" className="text-danger mt-2 mb-3" />
											<div id="ResetPasswordSuccess" className="text-success mt-2 mb-3" />
											<button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit">
												Submit
											</button>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				);
			} else {
				return notAuthenticated();
			}
		}
	}
}

export default forgotPassword;
