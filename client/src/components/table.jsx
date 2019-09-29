import React, { Component } from "react";
import ReactTable from "react-table";
import axios from "axios";
import "react-table/react-table.css";
import "../app.css";
const columns = [
  {
    Header: "document",
    accessor: "document", // String-based value accessors!
    headerClassName: "table-header",
    className: "table-data"
  },
  {
    Header: "date_filed",
    accessor: "date_filed"
  },
  {
    Header: "submitted_by",
    accessor: "submitted_by"
  }
];

function searchingFor(term) {
  return function(x) {
    return (
      x.document.toLowerCase().includes(term.toLowerCase()) ||
      x.submitted_by.toLowerCase().includes(term.toLowerCase())
    );
  };
}
class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      term: "",
      data: [],
      id: 0,
      message: null,
      intervalIsSet: false,
      idToDelete: null,
      idToUpdate: null,
      objectToUpdate: null,
      searchResults: [
        {
          id: 1,
          first: "mir",
          last: "kj"
        },
        {
          id: 2,
          first: "mohammed",
          last: "jhgv"
        },
        {
          id: 3,
          first: "mehdi",
          last: "ihb"
        }
      ]
    };
    this.searchHandler = this.searchHandler.bind(this);
  }

  searchHandler(event) {
    this.setState({ term: event.target.value });
  }

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // never let a process live forever
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // just a note, here, in the front end, we use the id key of our data object
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify
  // data base entries

  // our first get method that uses our backend api to
  // fetch data from our data base
  getDataFromDb = () => {
    // fetch("https://safe-fortress-44327.herokuapp.com/api/data/getData")
    fetch("http://localhost:5000/api/data/getData?id=A002")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };

  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = message => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    //axios.post("https://safe-fortress-44327.herokuapp.com/api/data/putData", {
    axios.post("http://localhost:5000/api/data/putData", {
      id: idToBeAdded,
      message: message
    });
  };

  // our delete method that uses our backend api
  // to remove existing database information
  deleteFromDB = idTodelete => {
    parseInt(idTodelete);
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id == idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    //axios.delete( "https://safe-fortress-44327.herokuapp.com/api/data/deleteData",  {
    axios.delete("http://localhost:5000/api/data/deleteData", {
      data: {
        id: objIdToDelete
      }
    });
  };

  // our update method that uses our backend api
  // to overwrite existing data base information
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    parseInt(idToUpdate);
    this.state.data.forEach(dat => {
      if (dat.id == idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    // axios.post(  "https://safe-fortress-44327.herokuapp.com/api/data/updateData",  {
    axios.post("http://localhost:5000/api/data/updateData", {
      id: objIdToUpdate,
      update: { message: updateToApply }
    });
  };

  render() {
    const { data } = this.state;
    return (
      <React.Fragment>
        {data.records && (
          <ReactTable
            data={data.records.continuing_record}
            columns={columns}
            // resolveData={data => data.map(row => row)}
            defaultPageSize={3}
            sortable={true}
            multiSort={true}
            //filterable={true}
            // defaultFilterMethod={(filter, row, column) => {
            //     const id = filter.id;
            //     return row[id] !== undefined
            //         ? String(row[id]).includes(filter.value)
            //         : true;
            // }}
          />
        )}
        <div>
          <form>
            <input
              type="text"
              onChange={this.searchHandler}
              value={this.state.term}
            />
          </form>
          {data.records &&
            (data.records.continuing_record.length !==
              data.records.continuing_record.filter(
                searchingFor(this.state.term)
              ).length &&
              data.records.continuing_record
                .filter(searchingFor(this.state.term))
                .map(value => (
                  <div key={value.document}>
                    <span>{value.document}</span>
                    <br />
                    <span>{value.date_filed}</span>
                    <br />
                    <span>{value.submitted_by}</span>
                    <br />
                  </div>
                )))}
        </div>
        {/* <ReactTable
          data={data}
          columns={columns}
          resolveData={data => data.map(row => row)}
          defaultPageSize={3}
          sortable={true}
          multiSort={true}
          filterable={true}
          defaultFilterMethod={(filter, row, column) => {
            const id = filter.id;
            return row[id] !== undefined
              ? String(row[id]).includes(filter.value)
              : true;
          }}
        /> */}
        {/* <ul>
            {data.length <= 0
              ? "NO DB ENTRIES YET"
              : data.map(dat => (
                  <li style={{ padding: "10px" }} key={dat.id}>
                    <span style={{ color: "gray" }}> id: </span> {dat.id} <br />
                    <span style={{ color: "gray" }}> data: </span>
                    {dat.message}
                  </li>
                ))}
          </ul> */}

        <div style={{ padding: "10px" }}>
          <input
            type="text"
            onChange={e => this.setState({ message: e.target.value })}
            placeholder="add something in the database"
            style={{ width: "200px" }}
          />
          <button onClick={() => this.putDataToDB(this.state.message)}>
            ADD
          </button>
        </div>
        <div style={{ padding: "10px" }}>
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ idToDelete: e.target.value })}
            placeholder="put id of item to delete here"
          />
          <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
            DELETE
          </button>
        </div>
        <div style={{ padding: "10px" }}>
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ idToUpdate: e.target.value })}
            placeholder="id of item to update here"
          />
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ updateToApply: e.target.value })}
            placeholder="put new value of the item here"
          />
          <button
            onClick={() =>
              this.updateDB(this.state.idToUpdate, this.state.updateToApply)
            }
          >
            UPDATE
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default Table;
