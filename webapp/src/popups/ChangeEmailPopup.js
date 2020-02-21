import React from 'react';
import jQuery from 'jquery';
import API_URL from '../variables';

class ChangeEmailPopup extends React.Component {
	constructor (props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	async handleSubmit () {
		if (document.getElementById('ChangeEmailInput').value === '') {
			document.getElementById('ChangeEmailError').innerHTML = 'Nothing to submit';
		} else {
			if (document.getElementById('ChangeEmailInput').classList.contains('invalid')) {
				document.getElementById('ChangeEmailError').innerHTML = 'Invalid Character detected';
			} else {
				await fetch(API_URL + '/ChangeEmailSubmit', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						newEmail: document.getElementById('ChangeEmailInput').value,
						username: sessionStorage.getItem('username'),
						token: sessionStorage.getItem('token')
					})
				}).then((response) => {
					if (response.status === 200) {
						document.getElementById('ChangeEmailError').innerHTML = '';
						document.getElementById('ChangeEmailSuccess').innerHTML = 'Email successfully changed!';
						window.setTimeout(function () {
							(function ($) {
								$('#ChangeEmailPopup').modal('toggle');
							})(jQuery);
							document.getElementById('ChangeEmailForm').reset();
							document.getElementById('ChangeEmailSuccess').innerHTML = '';
						}, 1000);
					}
					if (response.status === 403) {
						document.getElementById('ChangeEmailError').innerHTML = 'Email already in use.';
					}
				});
				this.props.fetchTable();
			}
		}
	}

	handleChange (e) {
		document.getElementById('ChangeEmailError').innerHTML = '';
		if (e.target.value.includes("'")) {
			if (!e.target.classList.contains('invalid')) e.target.classList.add('invalid');
		} else {
			if (e.target.classList.contains('invalid')) e.target.classList.remove('invalid');
		}
	}

	render () {
		return (
			<div className="modal fade animated bounceInUp fast" id="ChangeEmailPopup" tabIndex="-1" aria-labelledby="ChangeEmailPopupCenterTile" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered" role="document">
					<form
						className="modal-content"
						id="ChangeEmailForm"
						onSubmit={(e) => {
							this.handleSubmit();
							e.preventDefault();
						}}>
						<div className="modal-header">
							<h5 className="modal-title" id="ChangeEmailPopupTitle">
								Change your E-Mail
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
												type="email"
												name="ChangeEmail"
												id="ChangeEmailInput"
												placeholder="New Email"
												required=""
												autoFocus=""
												onChange={this.handleChange}
											/>
										</div>
										<div id="ChangeEmailError" className="text-danger mt-2 mb-3" />
										<div id="ChangeEmailSuccess" className="text-success mt-2 mb-3" />
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

export default ChangeEmailPopup;
