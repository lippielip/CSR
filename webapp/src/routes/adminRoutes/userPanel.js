import * as React from 'react';
import ReactTable from 'react-table';
import jQuery from 'jquery'
import API_URL from '../../variables'
import loadingScreen from '../../methods/loadingscreen';
import {Trash, Edit } from 'react-feather';
import { browserHistory } from '../../router';
import notAuthenticated from '../../methods/notAuthenticated';
import checkToken from '../../methods/checktoken';


export default class UserTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tableData: [],
            rowVal: {},
            isLoading:true
        }
        this.handleCancel = this.handleCancel.bind(this)
  }
  
    async toggleEditPopup(row) {
        await this.setState({ rowVal: row })
        document.getElementById('tokenAmount').innerHTML = `You have ${this.state.rowVal.original.CancelTokens} Token left`
        document.getElementById('Topic').value = this.state.rowVal.original.Topic;
        document.getElementById('Category').value = this.state.rowVal.original.Presentation_Category;
      document.getElementById('start').value = this.state.rowVal.original.Date;
        (function($){
          $('#EditPopup').modal('toggle');
           })(jQuery);
        
    };
    
    async handleEdit() {
        await fetch(API_URL + "/update", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            username: sessionStorage.getItem('username'),
            token: sessionStorage.getItem('token'),
              presentations: {
                    Topic: document.getElementById('Topic').value,
                    Presentation_Category: document.getElementById('Category').value,
                    Date: document.getElementById('start').value
              },
              idInfo: {
                id: this.state.rowVal.original.Presentation_ID,
                idName: 'Presentation_ID'
              }
            })
        })
        await this.fetchTable();
        (function($){
            $('#EditPopup').modal('toggle');
             })(jQuery);
    }


    toggleDeletePopup = (row) => {
        this.setState({ rowVal: row });
        (function($){
          $('#DeletePopup').modal('toggle');
           })(jQuery);
        
    };
//cancel a presentation => maybe remove or change 
    async handleCancel() {
        await fetch(API_URL + "/cancel", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            username: sessionStorage.getItem('username'),
            token: sessionStorage.getItem('token'),
            User_ID: this.state.rowVal.original.User_ID,
            Presentation_ID: this.state.rowVal.original.Presentation_ID,
            number: 0
            })
        }).then(response => {
            const statusCode = response.status;
            return Promise.all([statusCode]);
          })
          .then((res) => {
            if (res[0] === 412) {
              alert("No Tokens left!")
            }
          })
        await this.fetchTable();
        (function ($) {
            $('#EditPopup').modal('hide');
             })(jQuery);
  }
  
  async handleDelete() {
        await fetch(API_URL + "/delete", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          DeleteTable: ['users'],
          IDName: ['User_ID'],
          tableID: [this.state.rowVal.original.User_ID],
          username: sessionStorage.getItem('username'),
          token: sessionStorage.getItem('token'),
        })
        })
        await this.fetchTable();
        this.toggleDeletePopup();
    }

  async fetchTable() {
      try {
        await fetch(API_URL + "/getter", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
         body: JSON.stringify({
           username: sessionStorage.getItem('username'),
           token: sessionStorage.getItem('token'),
           select:'User_ID, Username, E_Mail, FirstName, LastName, CancelTokens, Pending_Presentation, Last_Probability, Amount_A, Amount_B, Amount_C, Authentication_Level, Password',
           tableName: 'users'
          })
        })
         .then(response => response.json())
         .then(res => this.setState({ tableData: res }));
      } catch (error) {
        browserHistory.push("/NoAuth")
      }

    }
    
    async componentDidMount() {
        await checkToken();
      await this.fetchTable();
      await this.setState({ isLoading: false });
    }
    
render() {
        if (this.state.isLoading) {
          return loadingScreen()
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
        Header: "User",
        accessor: "Username",
        style: { whiteSpace: "unset" },
        filterAll: true
      },
      {
        id: "Name",
        Header: "Full Name",
        accessor: d => `${d.FirstName} ${d.LastName}`,
        style: { whiteSpace: "unset" },
        filterAll: true
      },
      {
        Header: "E-Mail",
        accessor: "E_Mail",
        style: { whiteSpace: "unset" },
        filterAll: true
      },
      {
        Header: "Cancel Tokens",
        accessor:"CancelTokens",
        style: { whiteSpace: "unset" },
        filterAll: true
      },
      {
        Header: "Pending Presentation",
        accessor:"Pending_Presentation",
        style: { whiteSpace: "unset" },
        filterAll: true
      },
      {
        Header: "Authentication Level",
        accessor:"Authentication_Level",
        style: { whiteSpace: "unset" },
        filterAll: true
      },
      {
        Header: "Actions",
        Filter: <div />,
        sortable: false,
        Cell: row => (
          <div> 
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
              <button
                className="btn btn-default leftMargin5 btn-icon"
                title=""
                type="button"
                onClick={() => this.toggleDeletePopup(row)}
              >
                <Trash color="white" />
              </button>
          </div>
        )
      }
    ]}
    filterable={true}
    resizable={false}
  ></ReactTable>

  <div
    className="modal fade"
    id="EditPopup"
    tabIndex="-1"
    role="dialog"
    aria-labelledby="EditPopupCenterTile"
    aria-hidden="true"
  >
    <div className="modal-dialog modal-dialog-centered" role="document">
      <form
        className="modal-content"
        onSubmit={e => {
          this.handleEdit();
          e.preventDefault();
        }}
      >
        <div className="modal-header">
          <h5 className="modal-title" id="EditPopupTitle">
            Edit
          </h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-body text-left" id="presentation">
            <div className="form-group ">
              <label>Topic</label>
              <input
                type="text"
                className="form-control"
                name="title"
                id="Topic"
                onChange={this.handleOnChange}
                required
              ></input>
            </div>
            <div className="form-group">
              <label>Presentation Category</label>
              <select
                className="form-control"
                id="Category"
                name="Presentation_Category"
                onChange={this.handleOnChange}
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
              <div className="form-group ">
                <label>Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="start"
                  id="start"
                  onChange={this.handleOnChange}
                ></input>
              </div>
            </div>
          </div>
          <div id="tokenChanger">
            <div id="tokenAmount" style={{ color: "red" }}></div>
            <br />
            <button
              type="button"
              className="btn btn-danger"
                            onClick={()=>{this.handleCancel(0)}}
            >
              Cancel Presentation
            </button>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            data-dismiss="modal"
          >
            Close
          </button>
          <button type="submit" className="btn btn-primary">
            Save changes
          </button>
        </div>
      </form>
    </div>
  </div>

  <div
    className="modal fade"
    id="DeletePopup"
    tabIndex="-1"
    role="dialog"
    aria-labelledby="DeletePopupCenterTile"
    aria-hidden="true"
  >
    <div className="modal-dialog modal-dialog-centered" role="document">
      <form
        className="modal-content"
        onSubmit={e => {
          this.handleDelete();
          e.preventDefault();
        }}
      >
        <div className="modal-header">
          <h5 className="modal-title" id="DeletePopupTitle">
            Delete
          </h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <br />
          <h2>CAUTION!</h2>
          <br/>
          <div>This Action is irreversible and will remove the user and everything associated with them.</div>
          <div>Are you sure you want to continue?</div>
          <br />
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            data-dismiss="modal"
          >
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
            )
        }
   }
}