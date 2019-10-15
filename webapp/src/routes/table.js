import * as React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { CheckCircle, XCircle, Trash, Edit } from 'react-feather';
import jQuery from 'jquery'
import notAuthenticated from '../methods/notAuthenticated';
import API_URL from '../variables'
import loadingScreen from '../methods/loadingscreen';
import { browserHistory } from './router';
require('bootstrap');


class Table extends React.Component {
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
      if (this.state.rowVal.original.Pending_Presentation === 10 || this.state.rowVal.original.Pending_Presentation === 1) {
        document.getElementById('start').readOnly = true;
        document.getElementById('start').className = "form-control disabled"
      } else {
        document.getElementById('start').readOnly = false;
        document.getElementById('start').className = "form-control"
      }
        if (this.state.rowVal.original.Presentation_Held === 1 || this.state.rowVal.original.Pending_Presentation !== 10) {
            document.getElementById('tokenChanger').className = "d-none"
        } else {
            document.getElementById('tokenChanger').className = ""
        }
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
          DeleteTables: ['presentations'],
          IDName: ['Presentation_ID'],
          tableIDs: [this.state.rowVal.original.Presentation_ID],
          username: sessionStorage.getItem('username'),
          token: sessionStorage.getItem('token'),
          held: this.state.rowVal.original.Pending_Presentation
        })
        })
        if (this.state.rowVal.original.Presentation_Held === 1) {
            await fetch(API_URL + "/change", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
              body: JSON.stringify({
                    categoryName: `Amount_${this.state.rowVal.original.Presentation_Category}`,
                    sign: "-",
                    Id: this.state.rowVal.original.User_ID
                })
            })
    }
        await this.fetchTable();
        this.toggleDeletePopup();
    }
    
   async update(row, value,sign) {
        await fetch(API_URL + "/update", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              presentations: {
                Presentation_Held: value,
              },
              idInfo: {
                id: row.original.Presentation_ID,
                idName: 'Presentation_ID'
              }
            })
        })
        await fetch(API_URL + "/change", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                categoryName: `Amount_${row.original.Presentation_Category}`,
                sign: sign,
                Id: row.original.User_ID
            })
        })
        await this.fetchTable()
    }

    toggleColor(row, identifier) {
        if (identifier === "check") {
            if (row.original.Presentation_Held === 0) {
                row.original.Presentation_Held = 1;
                document.getElementById(`check${row.index}`).attributes[5].value = "green"
                document.getElementById(`x${row.index}`).attributes[5].value = "white"
                this.update(row, 1, "+")
            }
        } else {
            if (row.original.Presentation_Held === 1) {
                row.original.Presentation_Held = 0;
                document.getElementById(`check${row.index}`).attributes[5].value = "white"
                document.getElementById(`x${row.index}`).attributes[5].value = "red"
                this.update(row, 0, "-")
            }
        }
    }

    initialColor(row, identifier) {
        if (identifier === "check") {
            if (row.original.Presentation_Held === 1) {
                return 'green';
            } else return 'white';
        } else {
            if (identifier === "x") {
                if (row.original.Presentation_Held === 1) {
                    return 'white'
                } else return 'red'
            }
        }
    }

    async fetchTable() {
        await fetch(API_URL + "/getter", {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json'
           },
          body: JSON.stringify({
            username: sessionStorage.getItem('username'),
            token: sessionStorage.getItem('token'),
            select:'Presentation_ID, Topic, Presentation_Category, Date, Last_Changed, FirstName, LastName, User_ID,Username, Presentation_Held, Amount_A, Amount_B, Amount_C, CancelTokens, Pending_Presentation ',
            tableName: 'presentations',
            selectiveGet: 'INNER JOIN users ON presentations.Presenter = users.User_ID',

           })
         })
          .then(response => response.json())
          .then(res => this.setState({ tableData: res }));
    }
    
  async componentDidMount() {
      try {
        await this.fetchTable();
      } catch (error) {
        console.dir(error)
      }
      await this.setState({ isLoading: false });
      

    }
    
    render() {
        if (this.state.isLoading) {
          return loadingScreen()
        } else {
          if (sessionStorage.getItem('authenticated') !== "true") {
            return notAuthenticated();
          }
            return (
<div className="container-fluid">
  <ReactTable
    data={this.state.tableData}
    columns={[
      {
        Header: "Topic",
        accessor: "Topic",
        style: { whiteSpace: "unset" },
        filterAll: true
      },
      {
        id: "Name",
        Header: "Presenter",
        accessor: d => `${d.FirstName} ${d.LastName}`,
        style: { whiteSpace: "unset" },
        filterAll: true
      },
      {
        Header: "Category",
        accessor: "Presentation_Category",
        style: { whiteSpace: "unset" },
        filterAll: true
      },
      {
        id: "Date",
        Header: "Date",
        accessor: d => {
          var date = new Date(d.Date);
          return date.toLocaleString("de-DE").split(",")[0];
        },
        style: { whiteSpace: "unset" },
        filterAll: true
      },
      {
        id: "Last_Changed",
        Header: "Last Changed",
        accessor: d => {
          var date = new Date(d.Last_Changed);
          return date.toLocaleString("de-DE");
        },
        style: { whiteSpace: "unset" },
        filterAll: true
      },
      {
        Header: "Presentation held?",
        Filter: <div />,
        sortable: false,
        Cell: row => (
          <div>
            <button
              className="btn btn-default btn-icon"
              title=""
              type="button"
              onClick={() => {
                if(sessionStorage.getItem('authenticated') === "true" && (sessionStorage.getItem('username') ===  row.original.Username || sessionStorage.getItem('Authentication_Level') === "10") )
                this.toggleColor(row, "check");
              }}
            >
              <CheckCircle
                id={`check${row.index}`}
                color={this.initialColor(row, "check")}
              />
            </button>
            <button
              className="btn btn-default btn-icon"
              title=""
              type="button"
              onClick={() => {
                if(sessionStorage.getItem('authenticated') === "true" && (sessionStorage.getItem('username') ===  row.original.Username || sessionStorage.getItem('Authentication_Level') === "10") )
                this.toggleColor(row, "x");
              }}
            >
              <XCircle
                id={`x${row.index}`}
                color={this.initialColor(row, "x")}
              />
            </button>
          </div>
        )
      },
      {
        Header: "Options",
        Filter: <div />,
        sortable: false,
        Cell: row => (
          <div>
            {sessionStorage.getItem('authenticated') === "true" && (sessionStorage.getItem('username') === row.original.Username || sessionStorage.getItem('Authentication_Level') === "10")  ? 
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
              : null }
            {sessionStorage.getItem('Authentication_Level') === "10" ?
              <button
                className="btn btn-default leftMargin5 btn-icon"
                title=""
                type="button"
                onClick={() => this.toggleDeletePopup(row)}
              >
                <Trash color="white" />
              </button> : null}
          </div>
        )
      }
    ]}
    filterable={true}
    resizable={false}
    defaultSorted={[
      {
        id: "date",
        desc: true
      }
    ]}
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
          <div>Are you sure you want to delete this Entry?</div>
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

export default Table;