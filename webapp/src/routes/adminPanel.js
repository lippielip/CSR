import * as React from 'react';
import jQuery from 'jquery';
import Icon from '@mdi/react';
import { mdiAccount } from '@mdi/js';
import { mdiCogs } from '@mdi/js';
import { mdiCalendarRange } from '@mdi/js';
import { mdiAccountGroup } from '@mdi/js';
import checkToken from '../methods/checktoken';
import { Router, Link } from 'react-router-dom';
import notAuthenticated from '../methods/notAuthenticated';
import AddUserPopup from '../popups/AddUserPopup';
import ChangeSettingsPopup from '../popups/ChangeSettingsPopup';
import loadingScreen from '../methods/loadingscreen';
import { browserHistory } from '../router';
import ChangeColloquiumPopup from '../popups/ManualChangeColloquiumDate';

class AdminPanel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			wrongField           : [],
			authorized           : false,
			isLoading            : true,
			Authentication_Level : '0',
			E_Mail               : '',
			FirstName            : '',
			LastName             : '',
			Username             : ''
		};
		this.handleOnChange = this.handleOnChange.bind(this);
	}

	handleOnChange(e) {
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
	}
	toggleAddUserPopup() {
		(function($) {
			$('#AddUserPopup').modal('toggle');
		})(jQuery);
	}
	toggleChangeSettingsPopup() {
		(function($) {
			$('#ChangeSettingsPopup').modal('toggle');
		})(jQuery);
	}
	toggleChangeColloquiumPopup() {
		(function($) {
			$('#ChangeColloquiumPopup').modal('toggle');
		})(jQuery);
	}

	async componentDidMount() {
		await checkToken();
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
				<div className="container-fluid w-75">
					<h1>Admin Panel</h1>
					{/*Row 1*/}
					<div className="row">
						<div className="col-md ">
							<div className="adminCard card bg-dark biggerMargin">
								<div className="card-body">
									<h5 className="card-title">
										<Icon path={mdiAccount} size={1} color={'white'} /> User Creation
									</h5>
									<p className="card-text">Add a user with this utility. Make sure their E-Mail is set correctly, so they can receive the activation password.</p>
									<button className="btn btn-primary" onClick={this.toggleAddUserPopup}>
										Add a user
									</button>
									<AddUserPopup />
								</div>
							</div>
						</div>
						<div className="col-md">
							<div className="adminCard card bg-dark biggerMargin">
								<div className="card-body ">
									<h5 className="card-title">
										<Icon path={mdiAccountGroup} size={1} color={'white'} /> User Listing
									</h5>
									<p className="card-text">View, Modify or Remove Users</p>
									<br />
									<Router history={browserHistory}>
										<Link to={'adminPanel/users'}>
											<button className="btn btn-primary">View Users</button>
										</Link>
									</Router>
								</div>
							</div>
						</div>
					</div>
					{/*Row 2*/}
					<div className="row">
						<div className="col-md">
							<div className="adminCard card bg-dark biggerMargin">
								<div className="card-body">
									<h5 className="card-title">
										<Icon path={mdiCogs} size={1} color={'white'} /> Application Settings
									</h5>
									<p className="card-text">Change the Webapp settings to fit your own Colloquium need</p>
									<br />
									<button className="btn btn-primary" onClick={this.toggleChangeSettingsPopup}>
										Change Settings
									</button>
									<ChangeSettingsPopup />
								</div>
							</div>
						</div>
						<div className="col-md">
							<div className="adminCard card bg-dark biggerMargin">
								<div className="card-body">
									<h5 className="card-title">
										<Icon path={mdiCalendarRange} size={1} color={'white'} /> Change Colloquium Date
									</h5>
									<p className="card-text">Want to set a Colloquium manually? Do it here.</p>
									<br />
									<button className="btn btn-primary" onClick={this.toggleChangeColloquiumPopup}>
										Change Date
									</button>
									<ChangeColloquiumPopup />
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}
	}
}
export default AdminPanel;
