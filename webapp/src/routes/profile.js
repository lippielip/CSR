import * as React from 'react';
import { Redirect } from 'react-router';
import notAuthenticated from '../methods/notAuthenticated';
import API_URL from '../variables';
import loadingScreen from '../methods/loadingscreen';
let event = {
	title                 : '',
	start                 : '',
	Presentation_Category : 'A'
};

class User extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			isLoading             : true,
			redirect              : false,
			showPresentationPopup : false,
			data                  : ''
		};
	}

	async fetchTable () {
		await fetch(API_URL + '/getter', {
			method  : 'POST',
			headers : {
				'Content-Type' : 'application/json'
			},
			body    : JSON.stringify({
				select       : 'User_ID, Pending_Presentation, Amount_A, Amount_B, Amount_C ',
				tableName    : 'users',
				selectiveGet : `WHERE Username = '${sessionStorage.getItem('username')}'`
			})
		})
			.then((response) => response.json())
			.then((res) => this.setState({ data: res[0] }));
		if (this.state.data.Pending_Presentation === 1) {
			this.setState({ showPresentationPopup: true });
		}
	}

	handleOnChange (e) {
		event[e.target.getAttribute('name')] = e.target.value;
	}

	getNextDayOfWeek (date, dayOfWeek) {
		var resultDate = date;
		resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);

		return resultDate;
	}

	async componentDidMount () {
		await this.fetchTable();
		event.start = await this.getNextDayOfWeek(new Date(), 5).toISOString().split('T')[0];
		await this.setState({ isLoading: false });
	}

	async handleSubmit () {
		await await fetch(API_URL + '/add', {
			method  : 'POST',
			headers : {
				'Content-Type' : 'application/json'
			},
			body    : JSON.stringify({
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
				username : sessionStorage.getItem('username')
			})
		});
		this.setState({ redirect: true });
	}

	render () {
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
					<div>
						<h1>You have been chosen to hold a Presentation.</h1>
						<h2>Please fill in your Topic and Presentation Category</h2>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								this.handleSubmit();
							}}>
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
					</div>
				);
			}
		}
	}
}

export default User;
