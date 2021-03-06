import React from 'react';
import jQuery from 'jquery';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // needed for dayClick
import checkToken from '../methods/checktoken';
import loadingScreen from '../methods/loadingscreen';
import trash from '../images/trash.png';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import notAuthenticated from '../methods/notAuthenticated';
import API_URL from '../variables';

// must manually import the stylesheets for each plugin
let event = {
	title                 : '',
	start                 : '',
	Presentation_Category : 'A'
};
let missing_event = {
	start   : '',
	end     : '',
	Pending : ''
};
let clickedDate;
let unformattedEvents;
let unformattedLeaves;
let deleteValue;

export default class Calendar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user             : '',
			calendarWeekends : true,
			showStartEnd     : false,
			isLoading        : true,
			clickedDate      : '',
			calendarEvents   : []
		};
		this.handleOnChange = this.handleOnChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		this.handleDateClick = this.handleDateClick.bind(this);
		this.handleEventDrop = this.handleEventDrop.bind(this);
	}

	async fetchEvents() {
		this.setState({ calendarEvents: [] });
		await fetch(API_URL + '/getter', {
			method  : 'POST',
			headers : {
				'Content-Type' : 'application/json'
			},
			body    : JSON.stringify({
				username     : sessionStorage.getItem('username'),
				token        : sessionStorage.getItem('token'),
				select       : 'Presentation_ID, Topic, Presentation_Category, Presentation_Held, Date, FirstName, LastName, User_ID, Username, Pending_Presentation',
				tableName    : 'presentations',
				selectiveGet : 'INNER JOIN users ON presentations.Presenter = users.User_ID' // comment out this line if you want everyone to see everything
			})
		})
			.then((response) => response.json())
			.then((res) => (unformattedEvents = res));
		for (let i = 0; i < unformattedEvents.length; i++) {
			this.setState({
				calendarEvents : this.state.calendarEvents.concat({
					title                :
						unformattedEvents[i].Topic + ` (${unformattedEvents[i].Presentation_Category}) - ${unformattedEvents[i].FirstName} ${unformattedEvents[i].LastName}`,
					start                : unformattedEvents[i].Date,
					allDay               : true,
					type                 : unformattedEvents[i].Presentation_Category,
					Presentation_Held    : unformattedEvents[i].Presentation_Held,
					User_ID              : unformattedEvents[i].User_ID,
					username             : unformattedEvents[i].Username,
					id                   : unformattedEvents[i].Presentation_ID,
					Pending_Presentation : unformattedEvents[i].Pending_Presentation
				})
			});
		}
		await fetch(API_URL + '/getter', {
			method  : 'POST',
			headers : {
				'Content-Type' : 'application/json'
			},
			body    : JSON.stringify({
				username     : sessionStorage.getItem('username'),
				token        : sessionStorage.getItem('token'),
				select       : 'Missing_ID, User_ID, start, end, FirstName, LastName, Username',
				tableName    : 'outofoffice',
				selectiveGet : `INNER JOIN users ON outofoffice.User = users.User_ID ` //WHERE users.Username = '${this.state.user}' Im Fall das man nur sein eigenes sehen soll in selectiveget einfügen
			})
		})
			.then((response) => response.json())
			.then((res) => (unformattedLeaves = res));
		for (let i = 0; i < unformattedLeaves.length; i++) {
			var d = new Date(new Date(unformattedLeaves[i].end).setHours(24, 0, 0, 0)); //used to add another day to end date to make end inclusive
			this.setState({
				calendarEvents : this.state.calendarEvents.concat({
					title    : `${unformattedLeaves[i].FirstName} ${unformattedLeaves[i].LastName} - Out of Office`,
					start    : unformattedLeaves[i].start,
					end      : d,
					allDay   : true,
					type     : 'missingEvent',
					id       : unformattedLeaves[i].Missing_ID,
					username : unformattedLeaves[i].Username,
					color    : 'rgb(150, 16,0)'
				})
			});
		}
	}

	toggleCalendarPopup = () => {
		(function($) {
			$('#CalendarPopup').modal('toggle');
		})(jQuery);
	};

	handleSelect() {
		this.setState({ showStartEnd: !this.state.showStartEnd });
		document.getElementById('missing').classList.toggle('d-none');
		document.getElementById('presentation').classList.toggle('d-none');
		document.getElementById('start').required = !document.getElementById('start').required;
		document.getElementById('end').required = !document.getElementById('end').required;
		document.getElementById('Topic').required = !document.getElementById('Topic').required;
	}

	handleEventDrop(info) {
		if (!window.confirm('Are you sure about this change?')) {
			info.revert();
		} else {
			var dstart = new Date(info.event.start.setHours(12, 0, 0, 0)).toISOString().split('T')[0]; //your date object
			if (info.event.title.includes('Out of Office')) {
				var dend = new Date(info.event.end).toISOString().split('T')[0];
				fetch(API_URL + '/update', {
					method  : 'POST',
					headers : {
						'Content-Type' : 'application/json'
					},
					body    : JSON.stringify({
						username    : sessionStorage.getItem('username'),
						token       : sessionStorage.getItem('token'),
						outofoffice : {
							start : dstart,
							end   : dend
						},
						idInfo      : {
							id     : info.event.id,
							idName : 'Missing_ID'
						}
					})
				});
			} else {
				if (sessionStorage.getItem('Pending_Presentation') === 1 || sessionStorage.getItem('Pending_Presentation') === 10) {
					alert('You are presenting this week! Change the Text Content and not the Date!');
					info.revert();
				} else {
					fetch(API_URL + '/update', {
						method  : 'POST',
						headers : {
							'Content-Type' : 'application/json'
						},
						body    : JSON.stringify({
							username      : sessionStorage.getItem('username'),
							token         : sessionStorage.getItem('token'),
							presentations : {
								Date : dstart
							},
							idInfo        : {
								id     : info.event.id,
								idName : 'Presentation_ID'
							}
						})
					});
				}
			}
		}
	}

	async handleDateClick(arg) {
		this.setState({ clickedDate: arg.dateStr });
		clickedDate = this.state.clickedDate;
		missing_event.start = clickedDate;
		this.toggleCalendarPopup();
	}

	handleEventClick(info) {
		// TODO: EDIT IN CALENDAR
	}

	handleEventDragStart() {
		(function($) {
			$('#deleteEventsDiv').fadeIn(500);
		})(jQuery);
	}

	handleEventDragStop(info) {
		var trashEl = jQuery('#deleteEventsDiv');
		var ofs = trashEl.offset();

		var x1 = ofs.left;
		var x2 = ofs.left + trashEl.outerWidth(true);
		var y1 = ofs.top;
		var y2 = ofs.top + trashEl.outerHeight(true);
		if (info.jsEvent.pageX >= x1 && info.jsEvent.pageX <= x2 && info.jsEvent.pageY >= y1 && info.jsEvent.pageY <= y2) {
			(function($) {
				$('#DeletePopup').modal('show');
			})(jQuery);
			deleteValue = info.event;
		}
		(function($) {
			$('#deleteEventsDiv').fadeOut(200);
		})(jQuery);
	}

	async handleSubmit() {
		if (document.getElementById('Topic').classList.contains('invalid')) {
			alert('Bad Characters detected');
		} else {
			if (this.state.showStartEnd) {
				await fetch(API_URL + '/addOOO', {
					method  : 'POST',
					headers : {
						'Content-Type' : 'application/json'
					},
					body    : JSON.stringify({
						username : sessionStorage.getItem('username'),
						token    : sessionStorage.getItem('token'),
						missing  : {
							start : missing_event.start,
							end   : missing_event.end,
							User  : sessionStorage.getItem('username')
						}
					})
				});
				this.handleSelect();
			} else {
				await fetch(API_URL + '/add', {
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
			}
			document.getElementById('addForm').reset();
			await this.fetchEvents();
			await this.toggleCalendarPopup();
		}
	}

	async handleDelete() {
		var table = 'presentations';
		var Id = 'Presentation_ID';
		if (deleteValue.extendedProps.type === 'missingEvent') {
			table = 'outofoffice';
			Id = 'Missing_ID';
		}
		if (deleteValue.extendedProps.type !== 'missingEvent' && sessionStorage.getItem('Authentication_Level') !== '10') {
			alert("You don't have the rights to delete Presentations!");
		} else {
			await fetch(API_URL + '/delete', {
				method  : 'POST',
				headers : {
					'Content-Type' : 'application/json'
				},
				body    : JSON.stringify({
					username    : sessionStorage.getItem('username'),
					token       : sessionStorage.getItem('token'),
					DeleteTable : table,
					IDName      : Id,
					tableID     : deleteValue.id,
					deleteUser  : deleteValue.extendedProps.username
				})
			});
			if (deleteValue.extendedProps.Presentation_Held === 1) {
				await fetch(API_URL + '/change', {
					method  : 'POST',
					headers : {
						'Content-Type' : 'application/json'
					},
					body    : JSON.stringify({
						username     : sessionStorage.getItem('username'),
						token        : sessionStorage.getItem('token'),
						categoryName : `Amount_${deleteValue.extendedProps.type}`,
						sign         : '-',
						Id           : deleteValue.extendedProps.User_ID
					})
				});
			}
		}
		await this.fetchEvents();
		(function($) {
			$('#DeletePopup').modal('hide');
		})(jQuery);
	}

	handleOnChange(e) {
		// broad function for any kind of change in data
		if (e.target.value.includes("'")) {
			if (!e.target.classList.contains('invalid')) e.target.classList.add('invalid');
		} else {
			if (e.target.classList.contains('invalid')) e.target.classList.remove('invalid');
		}
		if (this.state.showStartEnd) {
			missing_event[e.target.getAttribute('name')] = e.target.value;
		} else {
			event[e.target.getAttribute('name')] = e.target.value;
			event.start = this.state.clickedDate;
		}
	}

	async componentDidMount() {
		await this.setState({ user: sessionStorage.getItem('username') });
		await checkToken();
		await this.fetchEvents();
		await this.setState({ isLoading: false });
	}
	render() {
		if (this.state.isLoading) {
			return loadingScreen();
		} else {
			if (sessionStorage.getItem('authenticated') !== 'true') {
				return notAuthenticated();
			}
			return (
				<div className="calendar-app">
					<br />
					<br />
					<div className="calendar-app-calendar">
						<FullCalendar
							defaultView="dayGridMonth"
							header={{
								left   : 'prev,next',
								center : 'title',
								right  : 'today'
							}}
							editable={true}
							handleWindowResize={true}
							weekends={false}
							eventDurationEditable={false}
							eventLimit={false}
							plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
							events={this.state.calendarEvents}
							dateClick={this.handleDateClick}
							eventClick={this.handleEventClick}
							eventDrop={this.handleEventDrop}
							eventDragStart={this.handleEventDragStart}
							eventDragStop={this.handleEventDragStop}
							dragRevertDuration={0}
							height={'auto'}
						/>
						<div id="deleteEventsDiv" className="Fade-button">
							<img style={{ height: '80px' }} src={trash} alt="trash" />
						</div>
					</div>
					<div className="modal fade" id="CalendarPopup" tabIndex="-1" role="dialog" aria-labelledby="CalendarPopupCenterTitle" aria-hidden="true">
						<div className="modal-dialog modal-dialog-centered" role="document">
							<form
								id="addForm"
								className="modal-content"
								onSubmit={(e) => {
									this.handleSubmit();
									e.preventDefault();
								}}
							>
								<div className="modal-header">
									<h5 className="modal-title" id="CalendarPopupTitle">
										Add new Event
									</h5>
									<button type="button" className="close" data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div className="modal-body">
									<div className="form-group">
										<label>Event Type</label>
										<select className="form-control" onChange={this.handleSelect}>
											<option>Presentation planning</option>
											<option>Out of Office</option>
										</select>
									</div>
									<div className="modal-body text-left d-none" id="missing">
										<div className="form-group ">
											<label>Start</label>
											<input type="date" className="form-control" name="start" id="start" onChange={this.handleOnChange} />
										</div>
										<div className="form-group">
											<label>End</label>
											<input type="date" className="form-control" name="end" id="end" onChange={this.handleOnChange} />
										</div>
									</div>
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
											<input type="date" className="form-control disabled" readOnly value={this.state.clickedDate} />
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
					<div className="modal fade" id="DeletePopup" tabIndex="-1" role="dialog" aria-labelledby="DeletePopupCenterTile" aria-hidden="true">
						<div className="modal-dialog modal-dialog-centered" role="document">
							<form
								id="deleteForm"
								className="modal-content"
								onSubmit={(e) => {
									e.preventDefault();
									this.handleDelete();
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
									<div>Are you sure you want to delete this Entry?</div>
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
