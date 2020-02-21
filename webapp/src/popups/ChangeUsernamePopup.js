import React from 'react';
import jQuery from 'jquery';
import API_URL from '../variables';

class ChangeUsernamePopup extends React.Component {
	async handleSubmit () {
		if (document.getElementById('ChangeUsernameInput').value === '') {
			document.getElementById('ChangeUsernameError').innerHTML = 'Nothing to submit';
		} else {
			if (document.getElementById('ChangeUsernameInput').classList.contains('invalid')) {
				document.getElementById('ChangeUsernameError').innerHTML = 'Invalid Character detected';
			} else {
				await fetch(API_URL + '/ChangeUsernameSubmit', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						newUsername: document.getElementById('ChangeUsernameInput').value,
						username: sessionStorage.getItem('username'),
						token: sessionStorage.getItem('token')
					})
				}).then((response) => {
					if (response.status === 200) {
						sessionStorage.setItem('username', document.getElementById('ChangeUsernameInput').value);
						document.getElementById('ChangeUsernameError').innerHTML = '';
						document.getElementById('ChangeUsernameSuccess').innerHTML = 'Username successfully changed!';
						window.setTimeout(function () {
							(function ($) {
								$('#ChangeUsernamePopup').modal('toggle');
							})(jQuery);
							document.getElementById('ChangeUsernameForm').reset();
							document.getElementById('ChangeUsernameSuccess').innerHTML = '';
						}, 1000);
					}
					if (response.status === 403) {
						document.getElementById('ChangeUsernameError').innerHTML = 'Username already in use.';
					}
				});
				this.props.fetchTable();
			}
		}
	}

	handleChange (e) {
		document.getElementById('ChangeUsernameError').innerHTML = '';
		if (e.target.value.includes("'")) {
			if (!e.target.classList.contains('invalid')) e.target.classList.add('invalid');
		} else {
			if (e.target.classList.contains('invalid')) e.target.classList.remove('invalid');
		}
	}
	render () {
		return (
			<div className="modal fade animated bounceInUp fast" id="ChangeUsernamePopup" tabIndex="-1" aria-labelledby="ChangeUsernamePopupCenterTile" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered" role="document">
					<form
						className="modal-content"
						id="ChangeUsernameForm"
						onSubmit={(e) => {
							this.handleSubmit();
							e.preventDefault();
						}}>
						<div className="modal-header">
							<h5 className="modal-title" id="ChangeUsernamePopupTitle">
								Change your Username
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
												type="text"
												name="ChangeUsername"
												id="ChangeUsernameInput"
												placeholder="New Username"
												required=""
												autoFocus=""
												onChange={this.handleChange}
											/>
										</div>
										<div id="ChangeUsernameError" className="text-danger mt-2 mb-3" />
										<div id="ChangeUsernameSuccess" className="text-success mt-2 mb-3" />
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

export default ChangeUsernamePopup;
