import * as React from 'react';
import { Redirect } from 'react-router';
import jQuery from 'jquery';
import Icon from '@mdi/react';
import { mdiEmail } from '@mdi/js';
import { mdiAccount } from '@mdi/js';
import { mdiKeyVariant } from '@mdi/js';
import notAuthenticated from '../methods/notAuthenticated';
import API_URL from '../variables';
import loadingScreen from '../methods/loadingscreen';
import ChangePasswordPopup from '../popups/ChangePasswordPopup';
import ChangeEmailPopup from '../popups/ChangeEmailPopup';
import ChangeUsernamePopup from '../popups/ChangeUsernamePopup';

let event = {
	title                 : '',
	start                 : '',
	Presentation_Category : 'A'
};

class User extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading             : true,
			redirect              : false,
			showPresentationPopup : false,
			data                  : '',
			date                  : ''
		};
		this.fetchTable = this.fetchTable.bind(this);
	}

	async fetchTable() {
		await fetch(API_URL + '/getter', {
			method  : 'POST',
			headers : {
				'Content-Type' : 'application/json'
			},
			body    : JSON.stringify({
				username     : sessionStorage.getItem('username'),
				token        : sessionStorage.getItem('token'),
				select       : 'User_ID, Username, E_Mail, Pending_Presentation, Amount_A, Amount_B, Amount_C, Last_Probability, CancelTokens, Authentication_Level ',
				tableName    : 'users',
				selectiveGet : `WHERE Username = '${sessionStorage.getItem('username')}'`
			})
		})
			.then((response) => response.json())
			.then((res) => this.setState({ data: res[0] }));
		await fetch(API_URL + '/getter', {
			method  : 'POST',
			headers : {
				'Content-Type' : 'application/json'
			},
			body    : JSON.stringify({
				username     : sessionStorage.getItem('username'),
				token        : sessionStorage.getItem('token'),
				select       : 'Next_Colloquium, Choose_Random',
				tableName    : 'options',
				selectiveGet : `WHERE Selected = 1`
			})
		})
			.then((response) => response.json())
			.then((res) => this.setState({ date: res[0] }));
		if (this.state.data.Pending_Presentation === 1) {
			this.setState({ showPresentationPopup: true });
			var EventDate = new Date(this.state.date.Next_Colloquium);
			EventDate.setMinutes(EventDate.getMinutes() + 300);
			EventDate = EventDate.toISOString();
			event.start = EventDate.split('T')[0];
		}
	}

	getNextDayOfWeek(date, dayOfWeek) {
		var resultDate = date;
		resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);

		return resultDate;
	}

	async handleSubmit() {
		await await fetch(API_URL + '/add', {
			method  : 'POST',
			headers : {
				'Content-Type' : 'application/json'
			},
			body    : JSON.stringify({
				username     : sessionStorage.getItem('username'),
				token        : sessionStorage.getItem('token'),
				presentation : {
					Topic                 : event.title,
					Presenter             : sessionStorage.getItem('username'),
					Presentation_Category : event.Presentation_Category,
					Date                  : event.start
				}
			})
		});
		await fetch(API_URL + '/PendingState', {
			method  : 'POST',
			headers : {
				'Content-Type' : 'application/json'
			},
			body    : JSON.stringify({
				username : sessionStorage.getItem('username'),
				token    : sessionStorage.getItem('token')
			})
		});
		this.setState({ redirect: true });
	}

	togglePopups(e) {
		(function($) {
			$(`#${e.target.name}`).modal('toggle');
		})(jQuery);
	}

	handleOnChange(e) {
		event[e.target.getAttribute('name')] = e.target.value;
	}

	async componentDidMount() {
		await this.fetchTable();
		this.setState({ isLoading: false });
	}

	render() {
		if (this.state.redirect) {
			return <Redirect to="/calendar" />;
		}
		if (this.state.isLoading) {
			return loadingScreen();
		} else {
			if (sessionStorage.getItem('authenticated') !== 'true') {
				return notAuthenticated();
			}
			if (this.state.showPresentationPopup) {
				return (
					<div className="container ">
						<h1>You have been chosen to hold a Presentation.</h1>
						<br />
						<h3>Please fill in your Topic and Presentation Category</h3>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								this.handleSubmit();
							}}
						>
							<div className="modal-body text-left" id="presentation">
								<div className="form-group ">
									<label>Topic</label>
									<input
										type="text"
										className="form-control"
										name="title"
										id="Topic"
										placeholder="e.g: Why Javascript is great"
										onChange={this.handleOnChange}
										required
									/>
								</div>
								<div className="form-group">
									<label>Presentation Category</label>
									<select className="form-control" name="Presentation_Category" onChange={this.handleOnChange}>
										<option value="A">A</option>
										<option value="B">B</option>
										<option value="C">C</option>
									</select>
								</div>
								<div className="form-group">
									<label>Date</label>
									<input type="date" className="form-control disabled" readOnly value={event.start} />
								</div>
								<button type="submit" className="btn btn-primary">
									Submit
								</button>
							</div>
						</form>
					</div>
				);
			} else {
				return (
					<div className="container-fluid">
						<h1 className="">My Profile</h1>
						<br />
						<br />
						<div className="row">
							<div className="col-md-5">
								<h5 className="biggerMargin">Username: {this.state.data.Username}</h5>
								<h5 className="biggerMargin">E-Mail: {this.state.data.E_Mail}</h5>
								<h5 className="biggerMargin">
									A Presentations: {this.state.data.Amount_A} | B Presentations: {this.state.data.Amount_B} | C Presentations: {this.state.data.Amount_C}
								</h5>
								<h5 className="biggerMargin">Cancel Tokens left: {this.state.data.CancelTokens}</h5>
								<h5 className="biggerMargin">Last Probability: {this.state.data.Last_Probability}% </h5>
							</div>
							<div className="col-md-6">
								<div className="row ">
									<div className="card bg-dark col-md fullMargin">
										<div className="card-body">
											<h5 className="card-title">
												<Icon path={mdiEmail} size={1} color={'white'} /> Change your E-Mail
											</h5>
											<p className="card-text">Want to use a different E-Mail?</p>
											<button className="btn btn-primary" name="ChangeEmailPopup" onClick={this.togglePopups}>
												Confirm
											</button>
											<ChangeEmailPopup fetchTable={this.fetchTable} />
										</div>
									</div>
									<div className="card bg-dark col-md fullMargin">
										<div className="card-body">
											<h5 className="card-title">
												<Icon path={mdiAccount} size={1} color={'white'} /> Change your Username
											</h5>
											<p className="card-text">Want a different Username?</p>
											<button className="btn btn-primary" name="ChangeUsernamePopup" onClick={this.togglePopups}>
												Confirm
											</button>
											<ChangeUsernamePopup fetchTable={() => this.fetchTable()} />
										</div>
									</div>
								</div>
								<div className="row">
									<div className="card bg-dark col-md fullMargin">
										<div className="card-body ">
											<h5 className="card-title">
												<Icon path={mdiKeyVariant} size={1} color={'white'} /> Change your Password
											</h5>
											<p className="card-text">Want a new Password?</p>
											<button className="btn btn-primary" name="ChangePasswordPopup" onClick={this.togglePopups}>
												Confirm
											</button>
											<ChangePasswordPopup fetchTable={() => this.fetchTable()} />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				);
			}
		}
	}
}

export default User;
