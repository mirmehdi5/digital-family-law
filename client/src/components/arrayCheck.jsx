import React, { Component } from "react";
import axios from "axios";

class ArrayCheck extends Component {
  state = {};
  componentDidMount() {
    axios.post(
      "https://safe-fortress-44327.herokuapp.com/api/data/updateData",
      {
        fileid: "1",
        update: { applicant: "updateToApply" }
      }
    );
  }
  render() {
    return <div>check</div>;
  }
}

export default ArrayCheck;
