import React from 'react';
import jQuery from 'jquery';
import API_URL from '../variables';
import { browserHistory } from '../router';

class ChangeSettingsPopup extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			isLoading: true
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	async fetchData () {
		// get all data
		try {
			await fetch(API_URL + '/getter', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: sessionStorage.getItem('username'),
					token: sessionStorage.getItem('token'),
					tableName: 'options',
					select: 'Option_ID, Name, Selected, Choose_Random, Email_Frequency, Colloquium_Frequency, Comment'
				})
			})
				.then((response) => response.json())
				.then((res) => this.setState({ options: res }));
		} catch (error) {
			browserHistory.push('/NoAuth');
		}
	}

	async handleSubmit () {
		if (document.getElementById('NameInput').value === '') {
			document.getElementById('ChangeSettingsError').innerHTML = 'Nothing to submit';
		} else {
			if (document.getElementById('NameInput').classList.contains('invalid') || document.getElementById('CommentInput').classList.contains('invalid')) {
				document.getElementById('ChangeSettingsError').innerHTML = 'Invalid Character detected';
			} else {
				await fetch(API_URL + '/ChangeSettingsSubmit', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						Option_ID: document.getElementById('ChangePresetInput').value,
						Name: document.getElementById('NameInput').value,
						Choose_Random: document.getElementById('Choose_RandomInput').value,
						Email_Frequency: document.getElementById('Email_FrequencyInput').value,
						Colloquium_Frequency: document.getElementById('Colloquium_FrequencyInput').value,
						Comment: document.getElementById('CommentInput').value,
						username: sessionStorage.getItem('username'),
						token: sessionStorage.getItem('token')
					})
				}).then((response) => {
					if (response.status === 200) {
						document.getElementById('ChangeSettingsError').innerHTML = '';
						document.getElementById('ChangeSettingsSuccess').innerHTML = 'Settings successfully modified!';
						setTimeout(() => {
							(function ($) {
								$('#ChangeSettingsPopup').modal('toggle');
							})(jQuery);
							document.getElementById('ChangeSettingsSuccess').innerHTML = '';
							this.componentDidMount();
						}, 1000);
					}
					if (response.status === 403) {
						document.getElementById('ChangeSettingsError').innerHTML = 'An unexpected error occured.';
					}
				});
			}
		}
	}

	getDropdownTemplate (tableName, IdName, definerName, tooltipName) {
		return this.state[tableName].map((v) => (
			<option key={v[IdName]} value={v[IdName]} title={v[tooltipName]}>
				{v[definerName]}
			</option>
		));
	}

	handleChange (e) {
		document.getElementById('ChangeSettingsError').innerHTML = '';
		if (e.target.value.includes("'")) {
			if (!e.target.classList.contains('invalid')) e.target.classList.add('invalid');
		} else {
			if (e.target.classList.contains('invalid')) e.target.classList.remove('invalid');
		}
		if (e.target.id === 'ChangePresetInput') {
			document.getElementById('ChangePresetInput').value = this.state.options[e.target.selectedIndex].Option_ID;
			document.getElementById('NameInput').value = this.state.options[e.target.selectedIndex].Name;
			document.getElementById('Choose_RandomInput').value = this.state.options[e.target.selectedIndex].Choose_Random;
			document.getElementById('Email_FrequencyInput').value = this.state.options[e.target.selectedIndex].Email_Frequency;
			document.getElementById('Colloquium_FrequencyInput').value = this.state.options[e.target.selectedIndex].Colloquium_Frequency;
			document.getElementById('CommentInput').value = this.state.options[e.target.selectedIndex].Comment;
		} else {
			document.getElementById('ChangePresetInput').value = '';
		}
	}

	async componentDidMount () {
		await this.fetchData();
		this.setState({ isLoading: false });
		for (let i = 0; i < this.state.options.length; i++) {
			if (this.state.options[i].Selected.data[0] === 1) {
				document.getElementById('ChangePresetInput').value = this.state.options[i].Option_ID;
				document.getElementById('NameInput').value = this.state.options[i].Name;
				document.getElementById('Choose_RandomInput').value = this.state.options[i].Choose_Random;
				document.getElementById('Email_FrequencyInput').value = this.state.options[i].Email_Frequency;
				document.getElementById('Colloquium_FrequencyInput').value = this.state.options[i].Colloquium_Frequency;
				document.getElementById('CommentInput').value = this.state.options[i].Comment;
				break;
			}
		}
	}

	render () {
		if (this.state.isLoading) {
			return <div />;
		} else {
			return (
				<div className="modal fade animated bounceInUp fast" id="ChangeSettingsPopup" tabIndex="-1" aria-labelledby="ChangeSettingsPopupCenterTile" aria-hidden="true">
					<div className="modal-dialog modal-dialog-centered" role="document">
						<form
							className="modal-content"
							id="ChangeSettingsForm"
							onSubmit={(e) => {
								this.handleSubmit();
								e.preventDefault();
							}}>
							<div className="modal-header">
								<h5 className="modal-title" id="ChangeSettingsPopupTitle">
									Change CSR Settings
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
											<div className="form-group">
												<label>Preset</label>
												<select className="form-control" id="ChangePresetInput" name="Preset" onChange={this.handleChange}>
													{this.getDropdownTemplate('options', 'Option_ID', 'Name', 'Comment')}
													<option disabled hidden value="">
														Custom
													</option>
												</select>
											</div>
											<div className="form-group">
												<label>Option Name</label>
												<input className="form-control mb-4" type="text" name="Name" id="NameInput" required="" autoFocus="" onChange={this.handleChange} />
											</div>
											<div className="form-group">
												<label>Choose Random Presenter ?</label>
												<select className="form-control" id="Choose_RandomInput" name="Choose_Random" required="required" onChange={this.handleChange}>
													<option value="0"> no</option>
													<option value="1"> yes</option>
												</select>
											</div>
											<div className="form-group">
												<label>Email Frequency in days</label>
												<input
													className="form-control mb-4"
													type="number"
													name="Email_Frequency"
													id="Email_FrequencyInput"
													required=""
													autoFocus=""
													onChange={this.handleChange}
												/>
											</div>
											<div className="form-group">
												<label>Colloquium Frequency in days</label>
												<input
													className="form-control mb-4"
													type="number"
													name="Colloquium_Frequency"
													id="Colloquium_FrequencyInput"
													required=""
													autoFocus=""
													onChange={this.handleChange}
												/>
											</div>
											<div className="form-group">
												<label>Comment</label>
												<textarea
													rows="4"
													className="form-control mb-4"
													type="text"
													name="Comment"
													id="CommentInput"
													style={{ maxHeight: '20vh', minHeight: '10vh' }}
													required=""
													autoFocus=""
													onChange={this.handleChange}
												/>
											</div>
											<div id="ChangeSettingsError" className="text-danger mt-2 mb-3" />
											<div id="ChangeSettingsSuccess" className="text-success mt-2 mb-3" />
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

export default ChangeSettingsPopup;
