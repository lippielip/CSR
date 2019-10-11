import * as React from 'react';
import loading from '../methods/loadingscreen';
import API_URL from '../variables';
import checkResetToken from '../methods/checkResetToken';

class forgotPassword extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			isLoading : true
		};
	}
	async handleSubmit () {
		if (document.getElementById('forgotPasswordInput').value === document.getElementById('forgotConfirmPasswordInput').value) {
			await fetch(API_URL + '/forgotPasswordSubmit', {
				method  : 'POST',
				headers : {
					'Content-Type' : 'application/json'
				},
				body    : JSON.stringify({
					password        : document.getElementById('forgotPasswordInput').value,
					confirmPassword : document.getElementById('forgotConfirmPasswordInput').value,
					token           : new URLSearchParams(window.location.search).get('token')
				})
			});
		} else {
			document.getElementById('ResetPasswordError').innerHTML = "Passwords don't match";
		}
	}

	async componentDidMount () {
		await checkResetToken(new URLSearchParams(window.location.search).get('token'));
		this.setState({ isLoading: false });
	}
	render () {
		if (this.state.isLoading) {
			return loading();
		} else {
			return (
				<div className="container">
					<div className="row">
						<div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
							<div className="card card-signin my-5">
								<div className="card-body">
									<h5 className="card-title text-center">New Password</h5>
									<form
										className="form-signin"
										onSubmit={(e) => {
											this.handleSubmit();
											e.preventDefault();
										}}
										method="post">
										<input className="form-control" type="hidden" name="token" />
										<div>
											<div id="ResetPasswordError" className="invalidText" />
											<input
												className="form-control"
												type="password"
												name="password"
												id="forgotPasswordInput"
												placeholder="Enter your new Password"
												required=""
												autoFocus=""
												pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
												title="Must contain at least one number, uppercase and lowercase letter, and at least 6 characters"
											/>
											<label>Password</label>
										</div>
										<div>
											<input
												className="form-control"
												type="password"
												name="confirmPassword"
												id="forgotConfirmPasswordInput"
												placeholder="Confirm your new Password"
												required=""
												pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
												title="Must contain at least one number, one uppercase and lowercase letter, and at least 6 characters"
											/>
											<label>Confirm Password</label>
										</div>
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
		}
	}
}

export default forgotPassword;
