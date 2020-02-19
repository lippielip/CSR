import React from 'react';
import jQuery from 'jquery';
import API_URL from '../variables';

class ChangePasswordPopup extends React.Component {
	constructor (props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	async handleSubmit () {
		if (document.getElementById('ChangePasswordInput').value === document.getElementById('ConfirmPasswordInput').value) {
			if (document.getElementById('ChangePasswordInput').value === '') {
				document.getElementById('ChangePasswordError').innerHTML = 'Nothing to submit';
			} else {
				if (document.getElementById('ChangePasswordInput').classList.contains('invalid') || document.getElementById('CurrentPasswordInput').classList.contains('invalid')) {
					document.getElementById('ChangePasswordError').innerHTML = 'Invalid Character detected';
				} else {
					await fetch(API_URL + '/ChangePasswordSubmit', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							password: document.getElementById('ChangePasswordInput').value,
							confirmPassword: document.getElementById('ConfirmPasswordInput').value,
							currentPassword: document.getElementById('CurrentPasswordInput').value,
							username: sessionStorage.getItem('username'),
							token: sessionStorage.getItem('token')
						})
					}).then((response) => {
						if (response.status === 200) {
							document.getElementById('ChangePasswordError').innerHTML = '';
							document.getElementById('ChangePasswordSuccess').innerHTML = 'Password successfully changed!';
							window.setTimeout(function () {
								(function ($) {
									$('#ChangePasswordPopup').modal('toggle');
								})(jQuery);
								document.getElementById('ChangePasswordForm').reset();
								document.getElementById('ChangePasswordSuccess').innerHTML = '';
							}, 1000);
						}
						if (response.status === 401) {
							document.getElementById('ChangePasswordError').innerHTML = 'Password was not changed!';
						}
						if (response.status === 403) {
							document.getElementById('ChangePasswordError').innerHTML = 'Current Password is incorrect!';
						}
					});
					this.props.fetchTable();
				}
			}
		} else {
			document.getElementById('ChangePasswordError').innerHTML = "Passwords don't match";
		}
	}

	handleChange (e) {
		document.getElementById('ChangePasswordError').innerHTML = '';
		if (e.target.value.includes("'")) {
			if (!e.target.classList.contains('invalid')) e.target.classList.add('invalid');
		} else {
			if (e.target.classList.contains('invalid')) e.target.classList.remove('invalid');
		}
	}
	render () {
		return (
			<div className="modal fade animated bounceInUp fast" id="ChangePasswordPopup" tabIndex="-1" aria-labelledby="ChangePasswordPopupCenterTile" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered" role="document">
					<form
						className="modal-content"
						id="ChangePasswordForm"
						onSubmit={(e) => {
							this.handleSubmit();
							e.preventDefault();
						}}>
						<div className="modal-header">
							<h5 className="modal-title" id="ChangePasswordPopupTitle">
								Change your Password
							</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body">
							<div className="modal-body">
								<div className="col-md-12">
									<div className="panel panel-default">
										<input className="form-control" type="hidden" name="token" />
										<div>
											<input
												className="form-control mb-4"
												type="password"
												name="currentPassword"
												id="CurrentPasswordInput"
												placeholder="Current Password"
												required=""
												autoFocus=""
												onChange={this.handleChange}
											/>
										</div>
										<div>
											<input
												className="form-control mb-4"
												type="password"
												name="password"
												id="ChangePasswordInput"
												placeholder="New Password"
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
												id="ConfirmPasswordInput"
												placeholder="Confirm your new Password"
												required=""
												pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,}$"
												title="Must contain at least one number, one uppercase and lowercase letter, and at least 8 characters"
												onChange={this.handleChange}
											/>
										</div>
										<div id="ChangePasswordError" className="text-danger mt-2 mb-3" />
										<div id="ChangePasswordSuccess" className="text-success mt-2 mb-3" />
										<button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit">
											Submit
										</button>
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

export default ChangePasswordPopup;
