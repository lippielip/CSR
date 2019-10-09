import React from 'react';
import jQuery from 'jquery';
import API_URL from '../variables';

class AddUserPopup extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			wrongField : [],
			isLoading  : true
		};
	}

	async fetchData () {
		// get all data

		var tableNames = [ 'auth_level' ];
		for (let i = 0; i < tableNames.length; i++) {
			await fetch(API_URL + '/getter', {
				method  : 'POST',
				headers : {
					'Content-Type' : 'application/json'
				},
				body    : JSON.stringify({
					tableName : tableNames[i]
				})
			})
				.then((response) => response.json())
				.then((res) => this.setState({ [tableNames[i]]: res }));
		}
	}
	// function that sends new User data to DB
	handleSubmit () {
		if (!(this.state.wrongField.length === 0)) {
			alert(`Please Check your Input in ${this.state.wrongField.join(', ').replace(/_/g, ' ')}`);
		} else {
			fetch(API_URL + '/newUser', {
				method  : 'POST',
				headers : {
					'Content-Type' : 'application/json'
				},
				body    : JSON.stringify({
					E_Mail               : document.getElementById('AddUser_E_Mail').value,
					FirstName            : document.getElementById('AddUser_FirstName').value,
					LastName             : document.getElementById('AddUser_LastName').value,
					Username             : document.getElementById('AddUser_Username').value,
					Authentication_Level : document.getElementById('AddUser_Authentication_Level').value
				})
			}).then((response) => {
				if (response.status === 200) {
					(function ($) {
						$('#AddUserPopup').modal('toggle');
					})(jQuery);
				} else {
					if (response.status === 400) {
						document.getElementById('AddUserError').innerHTML = 'Error: Duplicate Username detected';
					}
					if (response.status === 401) {
						document.getElementById('AddUserError').innerHTML = 'Error: Duplicate E-Mails detected';
					}
				}
			});
		}
	}

	getDropdownTemplate (tableName, IdName, definerName) {
		return this.state[tableName].map((v) => (
			<option key={v[IdName]} value={v[IdName]}>
				{v[definerName]}
			</option>
		));
	}

	handleOnChange (e) {
		document.getElementById('AddUserError').innerHTML = '';
		if (e.target.value.includes("'")) {
			if (!e.target.classList.contains('invalid')) {
				e.target.classList.add('invalid');
				this.state.wrongField.push(e.target.name);
			}
		} else {
			if (e.target.classList.contains('invalid')) {
				e.target.classList.remove('invalid');
				this.state.wrongField.splice(
					this.state.wrongField.findIndex((element) => {
						return element === e.target.name;
					}),
					1
				);
			}
		}
	}

	async componentDidMount () {
		await this.fetchData();
		await this.setState({ isLoading: false });
		let ua = navigator.userAgent.toLowerCase();
		if (ua.indexOf('safari') !== -1) {
			if (ua.indexOf('chrome') <= -1) {
				alert('Safari');
				let faded = document.getElementsByClassName('fade');
				while (faded.length) {
					faded[0].classList.remove('fade');
				}
			}
		}
	}

	render () {
		if (this.state.isLoading) {
			return <div />;
		} else {
			return (
				<div className="modal fade animated bounceInUp fast" id="AddUserPopup" tabIndex="-1" aria-labelledby="AddUserPopupCenterTile" aria-hidden="true">
					<div className="modal-dialog modal-dialog-centered" role="document">
						<form
							className="modal-content"
							id="AddUserForm"
							onSubmit={(e) => {
								this.handleSubmit();
								e.preventDefault();
							}}>
							<div className="modal-header">
								<h5 className="modal-title" id="ForgotPasswordPopupTitle">
									Add User
								</h5>
								<button type="button" className="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body">
								<div className="form-group">
									<label>Username:</label>
									<input
										type="text"
										name="Username"
										id="AddUser_Username"
										className="form-control"
										placeholder="e.g.: max.mustermann"
										onChange={this.handleOnChange}
										required="required"
									/>
								</div>
								<div className="form-group">
									<label>Authorization Level:</label>
									<select
										className="form-control"
										id="AddUser_Authentication_Level"
										name="Authentication_Level"
										required="required"
										onChange={this.handleOnChange}>
										<option disabled value="">
											-- select an option --
										</option>
										{this.getDropdownTemplate('auth_level', 'Auth_Level_ID', 'Definition')}
									</select>
								</div>
								<div className="form-row">
									<div className="form-group col-md-6">
										<input
											type="text"
											name="FirstName"
											id="AddUser_FirstName"
											className="form-control"
											placeholder="First name"
											onChange={this.handleOnChange}
											required="required"
										/>
									</div>
									<div className="form-group col-md-6">
										<input
											type="text"
											name="LastName"
											id="AddUser_LastName"
											className="form-control"
											placeholder="Last name"
											onChange={this.handleOnChange}
											required="required"
										/>
									</div>
								</div>
								<div className="form-group">
									<input
										type="email"
										name="E_Mail"
										id="AddUser_E_Mail"
										className="form-control"
										placeholder="E-Mail"
										onChange={this.handleOnChange}
										required="required"
									/>
									<div id="AddUserError" className="mt-3 invalidText" />
								</div>

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
}
export default AddUserPopup;
