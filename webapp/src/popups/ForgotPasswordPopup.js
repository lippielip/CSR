import React from 'react';
import jQuery from 'jquery';
import API_URL from '../variables';
import { browserHistory } from '../routes/router';
// class for creating a first time password / new password
class PasswordPopup extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			wrongField : []
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleOnChange = this.handleOnChange.bind(this);
	}

	async handleSubmit (email) {
		if (document.getElementById('email').className.includes('invalid')) {
			document.getElementById('ForgotPasswordError').innerHTML = 'Forbidden Characters detected.';
		} else {
			await fetch(API_URL + '/forgot', {
				method  : 'POST',
				headers : {
					'Content-Type' : 'application/json'
				},
				body    : JSON.stringify({
					username : sessionStorage.getItem('username'),
					token    : sessionStorage.getItem('token'),
					E_Mail   : document.getElementById('email').value
				})
			}).then((response) => {
				if (response.status === 200) {
					document.getElementById('ForgotPasswordSuccess').innerHTML = 'Password successfully changed!';
					window.setTimeout(function () {
						browserHistory.push('/');
					}, 1500);
					(function ($) {
						$('#ForgotPasswordPopup').modal('toggle');
					})(jQuery);
				} else {
					if (response.status === 403) {
						document.getElementById('ForgotPasswordError').innerHTML = 'Duplicate E-Mails detected. Aborting.';
					} else {
						document.getElementById('ForgotPasswordError').innerHTML = 'An Error occured. Did you type in the Address correctly?';
					}
				}
			});
		}
	}

	handleOnChange (e) {
		document.getElementById('ForgotPasswordError').innerHTML = '';
		if (e.target.value.includes("'")) {
			if (!e.target.classList.contains('invalid')) e.target.classList.add('invalid');
		} else {
			if (e.target.classList.contains('invalid')) e.target.classList.remove('invalid');
		}
	}
	render () {
		return (
			<div className="modal fade animated bounceInUp fast" id="ForgotPasswordPopup" tabIndex="-1" aria-labelledby="ForgotPasswordPopupCenterTile" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered" role="document">
					<form
						className="modal-content"
						id="forgotPasswordForm"
						onSubmit={(e) => {
							this.handleSubmit();
							e.preventDefault();
						}}>
						<div className="modal-header">
							<h5 className="modal-title" id="ForgotPasswordPopupTitle">
								What's My Password?
							</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body">
							<div className="modal-body">
								<div className="col-md-12">
									<div className="panel panel-default">
										<div className="panel-body">
											<div className="text-center">
												<p>Forgot your password? Reset it here.</p>
												<div className="panel-body">
													<fieldset>
														<div className="form-group">
															<input
																className="form-control input-lg"
																placeholder="E-mail Address"
																id="email"
																type="email"
																onChange={this.handleOnChange}
															/>
														</div>
														<input className="btn btn-lg btn-primary btn-block" value="Reset My Password" type="submit" />
														<div id="ForgotPasswordError" className="mt-3 text-danger" />
														<div id="ForgotPasswordSuccess" className="mt-3 text-success" />
													</fieldset>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" data-dismiss="modal">
								Cancel
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default PasswordPopup;
