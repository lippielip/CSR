import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import checkToken from '../methods/checktoken';
import loadingScreen from '../methods/loadingscreen'
import '../App.css';
import trash from '../images/trash.png';
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import jQuery from 'jquery'
import notAuthenticated from "../methods/notAuthenticated";
import API_URL from '../variables';
require('bootstrap')

// must manually import the stylesheets for each plugin
let event = {
  title: '',
  start: '',
  Presentation_Category: 'A',

};
let missing_event = {
  start: '',
  end: '',
  Pending:''
}
let clickedDate;
let unformattedEvents;
let unformattedLeaves;
let deleteValue;

export default class DemoApp extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      presentationOverflow: false,
      user: '',
      calendarWeekends: true,
      showStartEnd: false,
      isLoading: true,
      clickedDate: '',
      calendarEvents: []
    };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.checkPresentationAmount = this.checkPresentationAmount.bind(this)
    this.handleDateClick = this.handleDateClick.bind(this)
    this.handleEventDrop = this.handleEventDrop.bind(this)
    this.toggleWeekends = this.toggleWeekends.bind(this)
  }

  async fetchEvents() {
    this.setState({calendarEvents : [] })
    await fetch(API_URL + "/getter", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        select: 'Presentation_ID, Topic, Presentation_Category, Presentation_Held, Date, FirstName, LastName, User_ID, username, Pending_Presentation',
        tableName: 'presentations',
        selectiveGet: 'INNER JOIN users ON presentations.Presenter = users.User_ID' // comment out this line if you want everyone to see everything
      })
    })
      .then(response => response.json())
      .then(res => unformattedEvents = res);
    for (let i = 0; i < unformattedEvents.length; i++) {
      this.setState({
        calendarEvents: this.state.calendarEvents.concat({
          title: unformattedEvents[i].Topic + ` (${unformattedEvents[i].Presentation_Category}) - ${unformattedEvents[i].FirstName} ${unformattedEvents[i].LastName}`,
          start: unformattedEvents[i].Date,
          allDay: true,
          type: unformattedEvents[i].Presentation_Category,
          Presentation_Held: unformattedEvents[i].Presentation_Held,
          User_ID: unformattedEvents[i].User_ID,
          username: unformattedEvents[i].username,
          id: unformattedEvents[i].Presentation_ID,
          Pending_Presentation: unformattedEvents[i].Pending_Presentation
        })
      });
    }
    await fetch(API_URL + "/getter", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        select: 'Missing_ID, User_ID, start, end, FirstName, LastName',
        tableName: 'outofoffice',
        selectiveGet: `INNER JOIN users ON outofoffice.User = users.User_ID `  //WHERE users.Username = '${this.state.user}' Im Fall das man nur sein eigenes sehen soll in selectiveget einfügen
      })
    })
      .then(response => response.json())
      .then(res => unformattedLeaves = res);
    for (let i = 0; i < unformattedLeaves.length; i++) {
      var d = new Date(new Date(unformattedLeaves[i].end).setHours(24, 0, 0, 0)) //used to add another day to end date to make end inclusive
      this.setState({
        calendarEvents: this.state.calendarEvents.concat({
          title: `${unformattedLeaves[i].FirstName} ${unformattedLeaves[i].LastName} - Out of Office`,
          start: unformattedLeaves[i].start,
          end: d,
          allDay: true,
          type: "missingEvent",
          id: unformattedLeaves[i].Missing_ID,
          color: 'rgb(150, 16,0)'
        })
      });
    }
  }

  async checkPresentationAmount(date) {
    await fetch(API_URL + "/getter", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tableName: 'presentations',
        selectiveGet: `WHERE Date = '${date}'`
      })
    })
    .then(response => response.json())
      .then(res => {
        if (res.length >= 2) {
          this.setState({
            presentationOverflow: true
          })
        } else {
          this.setState({
            presentationOverflow: false
          })
        }
      });
  }

  toggleCalendarPopup = () => {
    (function ($) {
      $('#CalendarPopup').modal('toggle');
    })(jQuery);
    
  };

  handleSelect() {
    this.setState({ showStartEnd: !this.state.showStartEnd })
    document.getElementById("missing").classList.toggle('d-none');
    document.getElementById("presentation").classList.toggle('d-none');
    document.getElementById("start").required = !document.getElementById("start").required
    document.getElementById("end").required = !document.getElementById("end").required
    document.getElementById("Topic").required = !document.getElementById("Topic").required
  }

  toggleWeekends() {
    this.setState({
      calendarWeekends: !this.state.calendarWeekends
    });
  };

  handleEventDrop(info) {
    if (!window.confirm("Are you sure about this change?")) {
      info.revert();
    } else {
        var dstart = new Date(info.event.start.setHours(12, 0, 0, 0)).toISOString().split("T")[0] //your date object
        if (info.event.title.includes("Out of Office")) {
        
          var dend = new Date(info.event.end).toISOString().split("T")[0]
          fetch(API_URL + "/update", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              outofoffice: {
                start: dstart,
                end: dend
              },
              idInfo: {
                id: info.event.id,
                idName: 'Missing_ID'
              }
            })
          })
        } else {
          if (sessionStorage.getItem('Pending_Presentation') === 1 || sessionStorage.getItem('Pending_Presentation') === 10) {
            alert("You are presenting this week! Not allowed to change Dates")
            info.revert();
          } else {
          fetch(API_URL + "/update", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              presentations: {
                Date: dstart,
              },
              idInfo: {
                id: info.event.id,
                idName: 'Presentation_ID'
              }
            })
          })
            .then(response => {
              const statusCode = response.status;
              return Promise.all([statusCode]);
            })
            .then((res) => {
              if (res[0] === 304) {
                info.revert()
                alert("Already 2 Presentations!")
              }
            })
        }
      }
    }
  }

  async handleDateClick(arg) {
    this.setState({ clickedDate: arg.dateStr })
    await this.checkPresentationAmount(this.state.clickedDate)
    if (this.state.presentationOverflow === false) {
      clickedDate = this.state.clickedDate
      missing_event.start = clickedDate
      this.toggleCalendarPopup()
    } else {
      alert("Already 2 Presentations!")
    }
  };

  handleEventClick(info) {
 // TODO: EDIT IN CALENDAR
  }
  
  handleEventDragStart() {
      (function ($) {
       $('#deleteEventsDiv').fadeIn(500);
         })(jQuery)
  }

  handleEventDragStop(info) {
 var trashEl = jQuery('#deleteEventsDiv');
    var ofs = trashEl.offset();
    
 var x1 = ofs.left;
 var x2 = ofs.left + trashEl.outerWidth(true);
 var y1 = ofs.top;
 var y2 = ofs.top + trashEl.outerHeight(true);
 if (info.jsEvent.pageX >= x1 && info.jsEvent.pageX<= x2 &&
   info.jsEvent.pageY >= y1 && info.jsEvent.pageY <= y2) {
   (function ($) {
     $('#DeletePopup').modal('show');
   })(jQuery)
   deleteValue = info.event
    }
    (function ($) {
      $('#deleteEventsDiv').fadeOut(200);
    })(jQuery)
  }

  async handleSubmit() {
    if (this.state.showStartEnd) {
      await fetch(API_URL + "/addOOO", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          missing: {
            start: missing_event.start,
            end: missing_event.end,
            User: sessionStorage.getItem('username')
          }
        })
      })
    } else {
      await fetch(API_URL + "/add", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          presentation: {
            Topic: event.title,
            Presenter: sessionStorage.getItem('username'),
            Presentation_Category: event.Presentation_Category,
            Date: event.start
          }
        })
      })
    }
    document.getElementById('addForm').reset();
    await this.fetchEvents();
    await this.toggleCalendarPopup();
  }

  async handleDelete() {
    var table = "presentations";
    var ID = "Presentation_ID"
    if (deleteValue.extendedProps.type === "missingEvent") {
      table = "outofoffice";
      ID = "Missing_ID"
    }
    if (deleteValue.extendedProps.type !== "missingEvent" && sessionStorage.getItem('Authentication_Level') !== "10") {
      alert("You don't have the rights to delete entries!")

    } else {
      console.log(deleteValue.extendedProps)
      await fetch(API_URL + "/delete", {
     
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          DeleteTables: [table],
          IDName: [ID],
          tableIDs: [deleteValue.id],
          username: sessionStorage.getItem('username'),
          deleteUser: deleteValue.extendedProps.username,
          token: sessionStorage.getItem('token'),
          held: deleteValue.extendedProps.Pending_Presentation
        })
      })
      if (deleteValue.extendedProps.Presentation_Held === 1) {
        await fetch(API_URL + "/change", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            categoryName: `Amount_${deleteValue.extendedProps.type}`,
            sign: "-",
            Id: deleteValue.extendedProps.User_ID
          })
        })
      }
    }
    await this.fetchEvents();
    (function ($) {
      $('#DeletePopup').modal('hide');
     })(jQuery)
  }

  handleOnChange(e) { // broad function for any kind of change in data
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
      if (sessionStorage.getItem('authenticated') !== "true") {
        return notAuthenticated();
      }
      return (
        <div className="demo-app">
          <div className="demo-app-top">
            <br />
            <button className="btn btn-primary" onClick={this.toggleWeekends}>toggle weekends</button>&nbsp;
        </div>
          <div className="demo-app-calendar">
            <FullCalendar
              defaultView="dayGridMonth"
              header={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
              }}
              editable
              eventDurationEditable={false}
              eventLimit={false}
              event
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              weekends={this.state.calendarWeekends}
              events={this.state.calendarEvents}
              dateClick={this.handleDateClick}
              eventClick={this.handleEventClick}
              eventDrop={this.handleEventDrop}
              eventDragStart={this.handleEventDragStart}
              eventDragStop={this.handleEventDragStop}
              dragRevertDuration={0}
              

            />
    <div id="deleteEventsDiv" className="Fade-button">
              <img style={{ height: "80px" }} src={trash} alt="trash" />
</div>
          </div>
          <div className="modal fade" id="CalendarPopup" tabIndex="-1" role="dialog" aria-labelledby="CalendarPopupCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <form id="addForm" className="modal-content" onSubmit={e => { this.handleSubmit(); e.preventDefault() }}>
                <div className="modal-header">
                  <h5 className="modal-title" id="CalendarPopupTitle">Add new Event</h5>
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
                  <div className="modal-body text-left d-none" id="missing" >
                    <div className="form-group ">
                      <label>Start</label>
                      <input type="date" className="form-control" name="start" id="start" onChange={this.handleOnChange} ></input>
                    </div>
                    <div className="form-group">
                      <label>End</label>
                      <input type="date" className="form-control" name="end" id="end" onChange={this.handleOnChange}></input>
                    </div>
                  </div>
                  <div className="modal-body text-left" id="presentation">
                    <div className="form-group ">
                      <label>Topic</label>
                      <input type="text" className="form-control" name="title" id="Topic" placeholder="e.g: Why Javascript is great" onChange={this.handleOnChange} required></input>
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
                      <input type="date" className="form-control disabled" readOnly value={this.state.clickedDate}></input>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary">Save changes</button>
                </div>
              </form>
            </div>
          </div>
          <div className="modal fade" id="DeletePopup" tabIndex="-1" role="dialog" aria-labelledby="DeletePopupCenterTile" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
                            <form id="deleteForm" className="modal-content" onSubmit={e => {
                e.preventDefault()
                this.handleDelete();
                            }}>
          <div className="modal-header">
              <h5 className="modal-title" id="DeletePopupTitle">Delete</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
              </button>
          </div>
          <div className="modal-body">
              <br/>
            <div>Are you sure you want to delete this Entry?</div>
            <br/>
          </div>
          <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
              <button type="submit" className="btn btn-danger">Delete</button>
          </div>
          </form>
      </div>
      </div>
        </div>
      );
    }
  }
}
