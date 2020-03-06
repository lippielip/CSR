import * as React from 'react';
import ReactTable from 'react-table';
import jQuery from 'jquery';
import API_URL from '../../variables';
import loadingScreen from '../../methods/loadingscreen';
import { Trash, Edit } from 'react-feather';
import { browserHistory } from '../../router';
import notAuthenticated from '../../methods/notAuthenticated';
import checkToken from '../../methods/checktoken';

export default class UserTable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			tableData : [],
			rowVal    : {},
			isLoading : true
		};
	}
	/*
	async toggleEditPopup(row) {
		await this.setState({ rowVal: row });
		document.getElementById('UsernameInput').value = this.state.rowVal.original.Username;
		document.getElementById('E_Mail').value = this.state.rowVal.original.E_Mail;
		document.getElementById('Authentication_LevelInput').value = this.state.rowVal.original.Authentication_Level;
		(function($) {
			$('#EditPopup').modal('toggle');
		})(jQuery);
	}

	async handleEdit() {
		if (document.getElementById('E_mailInput').value === '' || document.getElementById('UsernameInput').value === '') {
			document.getElementById('ChangeEmailError').innerHTML = 'Nothing to submit';
		} else {
			if (document.getElementById('ChangeEmailInput').classList.contains('invalid') || document.getElementById('UsernameInput').classList.contains('invalid')) {
				document.getElementById('ChangeEmailError').innerHTML = 'Invalid Character detected';
			} else {
				await fetch(API_URL + '/ChangeEmailSubmit', {
					method  : 'POST',
					headers : {
						'Content-Type' : 'application/json'
					},
					body    : JSON.stringify({
						newEmail : document.getElementById('ChangeEmailInput').value,
						username : sessionStorage.getItem('username'),
						token    : sessionStorage.getItem('token')
					})
				}).then((response) => {
					fetch(API_URL + '/ChangeUsernameSubmit', {
						method  : 'POST',
						headers : {
							'Content-Type' : 'application/json'
						},
						body    : JSON.stringify({
							newUsername : document.getElementById('UsernameInput').value,
							username    : sessionStorage.getItem('username'),
							token       : sessionStorage.getItem('token')
						})
					}).then((response) => {});
					fetch(API_URL + '/ChangeUsernameSubmit', {
						method  : 'POST',
						headers : {
							'Content-Type' : 'application/json'
						},
						body    : JSON.stringify({
							newUsername : document.getElementById('UsernameInput').value,
							username    : sessionStorage.getItem('username'),
							token       : sessionStorage.getItem('token')
						})
					})
					this.props.fetchTable();
				});
				this.fetchTable();
				(function($) {
					$('#EditPopup').modal('toggle');
				})(jQuery);
			}
		}
	}
*/
	toggleDeletePopup = (row) => {
		this.setState({ rowVal: row });
		(function($) {
			$('#DeletePopup').modal('toggle');
		})(jQuery);
	};
	async handleDelete() {
		await fetch(API_URL + '/delete', {
			method  : 'POST',
			headers : {
				'Content-Type' : 'application/json'
			},
			body    : JSON.stringify({
				DeleteTable : [ 'users' ],
				IDName      : [ 'User_ID' ],
				tableID     : [ this.state.rowVal.original.User_ID ],
				username    : sessionStorage.getItem('username'),
				token       : sessionStorage.getItem('token')
			})
		});
		await this.fetchTable();
		this.toggleDeletePopup();
	}

	async fetchTable() {
		try {
			await fetch(API_URL + '/getter', {
				method  : 'POST',
				headers : {
					'Content-Type' : 'application/json'
				},
				body    : JSON.stringify({
					username  : sessionStorage.getItem('username'),
					token     : sessionStorage.getItem('token'),
					select    :
						'User_ID, Username, E_Mail, FirstName, LastName, CancelTokens, Pending_Presentation, Last_Probability, Amount_A, Amount_B, Amount_C, Authentication_Level',
					tableName : 'users'
				})
			})
				.then((response) => response.json())
				.then((res) => this.setState({ tableData: res }));
			await fetch(API_URL + '/getter', {
				method  : 'POST',
				headers : {
					'Content-Type' : 'application/json'
				},
				body    : JSON.stringify({
					username  : sessionStorage.getItem('username'),
					token     : sessionStorage.getItem('token'),
					tableName : 'auth_level',
					select    : 'Auth_Level_ID, Definition'
				})
			})
				.then((response) => response.json())
				.then((res) => this.setState({ auth_level: res }));
		} catch (error) {
			browserHistory.push('/NoAuth');
		}
	}

	getDropdownTemplate(tableName, IdName, definerName) {
		return this.state[tableName].map((v) => (
			<option key={v[IdName]} value={v[IdName]}>
				{v[definerName]}
			</option>
		));
	}

	async componentDidMount() {
		await checkToken();
		await this.fetchTable();
		await this.setState({ isLoading: false });
	}

	render() {
		if (this.state.isLoading) {
			return loadingScreen();
		} else {
			if (sessionStorage.getItem('authenticated') !== 'true' || sessionStorage.getItem('Authentication_Level') !== '10') {
				return notAuthenticated();
			}
			return (
				<div className="container-fluid">
					<ReactTable
						data={this.state.tableData}
						columns={[
							{
								Header    : 'User',
								accessor  : 'Username',
								style     : { whiteSpace: 'unset' },
								filterAll : true
							},
							{
								id        : 'Name',
								Header    : 'Full Name',
								accessor  : (d) => `${d.FirstName} ${d.LastName}`,
								style     : { whiteSpace: 'unset' },
								filterAll : true
							},
							{
								Header    : 'E-Mail',
								accessor  : 'E_Mail',
								style     : { whiteSpace: 'unset' },
								filterAll : true
							},
							{
								Header    : 'Cancel Tokens',
								accessor  : 'CancelTokens',
								style     : { whiteSpace: 'unset' },
								filterAll : true
							},
							{
								Header    : 'Pending Presentation',
								accessor  : 'Pending_Presentation',
								style     : { whiteSpace: 'unset' },
								filterAll : true
							},
							{
								Header    : 'Last Probability',
								accessor  : 'Last_Probability',
								style     : { whiteSpace: 'unset' },
								filterAll : true
							},
							{
								Header    : 'Authentication Level',
								accessor  : 'Authentication_Level',
								style     : { whiteSpace: 'unset' },
								filterAll : true
							},
							{
								Header   : 'Actions',
								Filter   : <div />,
								sortable : false,
								Cell     : (row) => (
									<div>
										{/*
										<button
											className="btn btn-default btn-icon"
											title=""
											type="button"
											onClick={() => {
												this.toggleEditPopup(row);
											}}
										>
											<Edit color="white" />
										</button>
										*/}
										<button className="btn btn-default leftMargin5 btn-icon" title="" type="button" onClick={() => this.toggleDeletePopup(row)}>
											<Trash color="white" />
										</button>
									</div>
								)
							}
						]}
						filterable={true}
						resizable={false}
					/>
					{/*
					<div className="modal fade" id="EditPopup" tabIndex="-1" role="dialog" aria-labelledby="EditPopupCenterTile" aria-hidden="true">
						<div className="modal-dialog modal-dialog-centered" role="document">
							<form
								className="modal-content"
								onSubmit={(e) => {
									this.handleEdit();
									e.preventDefault();
								}}
							>
								<div className="modal-header">
									<h5 className="modal-title" id="EditPopupTitle">
										Edit
									</h5>
									<button type="button" className="close" data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div className="modal-body">
									<div className="modal-body text-left" id="presentation">
										<div className="form-group ">
											<label>Username</label>
											<input type="text" className="form-control" name="Username" id="UsernameInput" onChange={this.handleOnChange} required />
										</div>
										<div className="form-group">
											<label>E-Mail</label>
											<input type="text" className="form-control" id="E_Mail" name="E_MailInput" onChange={this.handleOnChange} />
											<div className="form-group">
												<label>Authorization Level:</label>
												<select
													className="form-control"
													id="Authentication_LevelInput"
													name="Authentication_Level"
													required="required"
													onChange={this.handleOnChange}
												>
													<option disabled={true} value="">
														-- select an option --
													</option>
													{this.getDropdownTemplate('auth_level', 'Auth_Level_ID', 'Definition')}
												</select>
											</div>
										</div>
									</div>
								</div>
								<div className="modal-footer">
									<button type="button" className="btn btn-secondary" data-dismiss="modal">
										Close
									</button>
									<button type="submit" className="btn btn-primary">
										Save changes
									</button>
								</div>
							</form>
						</div>
					</div>
*/}
					<div className="modal fade" id="DeletePopup" tabIndex="-1" role="dialog" aria-labelledby="DeletePopupCenterTile" aria-hidden="true">
						<div className="modal-dialog modal-dialog-centered" role="document">
							<form
								className="modal-content"
								onSubmit={(e) => {
									this.handleDelete();
									e.preventDefault();
								}}
							>
								<div className="modal-header">
									<h5 className="modal-title" id="DeletePopupTitle">
										Delete
									</h5>
									<button type="button" className="close" data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div className="modal-body">
									<br />
									<h2>CAUTION!</h2>
									<br />
									<div>This Action is irreversible and will remove the user and everything associated with them.</div>
									<div>Are you sure you want to continue?</div>
									<br />
								</div>
								<div className="modal-footer">
									<button type="button" className="btn btn-secondary" data-dismiss="modal">
										Cancel
									</button>
									<button type="submit" className="btn btn-danger">
										Delete
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			);
		}
	}
}
