import React from 'react';
import jQuery from 'jquery';
import API_URL from '../variables';
// class for creating a first time password / new password
class PasswordPopup extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			wrongField      : [],
			Password        : '',
			ConfirmPassword : ''
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleOnChange = this.handleOnChange.bind(this);
	}

	async handleSubmit () {
		// checks token and then sends the new password with username to the API to be saved in the DB
		if (this.state.Password === this.state.ConfirmPassword && this.state.wrongField.length === 0) {
			document.getElementById('confirm_password').setCustomValidity('');
			fetch(API_URL + '/newPassword', {
				method  : 'POST',
				headers : {
					'Content-Type' : 'application/json'
				},
				body    : JSON.stringify({
					Username : sessionStorage.getItem('username'),
					Password : this.state.Password
				})
			});
			(function ($) {
				$('#PasswordPopup').modal('toggle');
			})(jQuery);
		}
	}

	handleOnChange (e) {
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
		console.dir(this.state);
	}
	render () {
		return (
			<div className="modal animated bounceInUp" id="PasswordPopup" tabIndex="-1" data-easein="bounceUpIn" aria-labelledby="PasswordPopupCenterTile" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered" role="document">
					<form
						className="modal-content"
						onSubmit={(e) => {
							this.handleSubmit();
							e.preventDefault();
						}}>
						<div className="modal-header">
							<h5 className="modal-title" id="PasswordPopupTitle">
								Set Password
							</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body">
							<label>Enter your new Password.</label>
							<fieldset>
								<div className="form-group">
									<input
										id="password"
										className="form-control input-lg"
										placeholder="Enter your Password"
										type="password"
										pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
										title="Must contain at least one number and one uppercase and lowercase letter, and at least 6 characters"
										name="Password"
										required="required"
										category="users"
										onChange={this.handleOnChange}
									/>
								</div>
								<div className="form-group">
									<input
										id="confirm_password"
										className="form-control input-lg"
										placeholder="Confirm your Password"
										type="password"
										name="ConfirmPassword"
										category="users"
										required="required"
										onChange={this.handleOnChange}
									/>
								</div>
							</fieldset>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" data-dismiss="modal">
								Cancel
							</button>
							<button type="submit" className="btn btn-primary">
								Confirm
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default PasswordPopup;
