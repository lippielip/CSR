import React from 'react';
import jQuery from 'jquery';
import API_URL from '../variables';
import { browserHistory } from '../router';

class ChangeDatePopup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading : true
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	async fetchData() {
		// get all data
		try {
			await fetch(API_URL + '/getter', {
				method  : 'POST',
				headers : {
					'Content-Type' : 'application/json'
				},
				body    : JSON.stringify({
					username     : sessionStorage.getItem('username'),
					token        : sessionStorage.getItem('token'),
					tableName    : 'options',
					select       : 'Next_Colloquium',
					selectiveGet : 'WHERE Selected = 1'
				})
			})
				.then((response) => response.json())
				.then((res) => this.setState({ options: res }));
		} catch (error) {
			browserHistory.push('/NoAuth');
		}
	}

	async handleSubmit() {
		if (document.getElementById('Next_ColloquiumInput').classList.contains('invalid')) {
			document.getElementById('ChangeColloquiumError').innerHTML = 'Invalid Character detected';
		} else {
			await fetch(API_URL + '/changenextcolloquium', {
				method  : 'POST',
				headers : {
					'Content-Type' : 'application/json'
				},
				body    : JSON.stringify({
					Next_Colloquium : document.getElementById('Next_ColloquiumInput').value,
					username        : sessionStorage.getItem('username'),
					token           : sessionStorage.getItem('token')
				})
			}).then((response) => {
				if (response.status === 200) {
					document.getElementById('ChangeColloquiumError').innerHTML = '';
					document.getElementById('ChangeColloquiumSuccess').innerHTML = 'Settings successfully modified!';
					setTimeout(() => {
						(function($) {
							$('#ChangeColloquiumPopup').modal('toggle');
						})(jQuery);
						document.getElementById('ChangeColloquiumSuccess').innerHTML = '';
						this.componentDidMount();
					}, 1000);
				}
				if (response.status === 403) {
					document.getElementById('ChangeColloquiumError').innerHTML = 'An unexpected error occured.';
				}
			});
		}
	}

	handleChange(e) {
		document.getElementById('ChangeColloquiumError').innerHTML = '';
		if (e.target.value.includes("'")) {
			if (!e.target.classList.contains('invalid')) e.target.classList.add('invalid');
		} else {
			if (e.target.classList.contains('invalid')) e.target.classList.remove('invalid');
		}
	}

	async componentDidMount() {
		await this.fetchData();
		this.setState({ isLoading: false });
		let myDate = new Date(this.state.options[0].Next_Colloquium);
		myDate.setMinutes(myDate.getMinutes() + 300);
		myDate = myDate.toISOString();
		myDate = myDate.split('T')[0];
		document.getElementById('Next_ColloquiumInput').value = myDate;
	}

	render() {
		if (this.state.isLoading) {
			return <div />;
		} else {
			return (
				<div className="modal fade animated bounceInUp fast" id="ChangeColloquiumPopup" tabIndex="-1" aria-labelledby="ChangeColloquiumPopupCenterTile" aria-hidden="true">
					<div className="modal-dialog modal-dialog-centered" role="document">
						<form
							className="modal-content"
							id="ChangeColloquiumForm"
							onSubmit={(e) => {
								this.handleSubmit();
								e.preventDefault();
							}}
						>
							<div className="modal-header">
								<h5 className="modal-title" id="ChangeColloquiumPopupTitle">
									Manually Set Colloquium Date
								</h5>
								<button type="button" className="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body">
								<div className="modal-body">
									<div className="col-md-12">
										<div className="panel panel-default">
											<div className="form-group">
												<label>Next Colloquium</label>
												<input
													className="form-control mb-4"
													type="date"
													name="Next_Colloquium"
													id="Next_ColloquiumInput"
													required={true}
													autoFocus={true}
													onChange={this.handleChange}
												/>
											</div>
											<div id="ChangeColloquiumError" className="text-danger mt-2 mb-3" />
											<div id="ChangeColloquiumSuccess" className="text-success mt-2 mb-3" />
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
}

export default ChangeDatePopup;
