import React, { Component } from "react";
import { Col, Row, Button } from "react-bootstrap";
import axios from "axios";
import Home from "./home";

class AccessPin extends Component {
  state = {
    data: [
      {
        linked: "no"
      }
    ],
    hidePage: false
  };

  handleLinkCase = () => {
    axios
      .post("https://safe-fortress-44327.herokuapp.com/api/data/linkCase", {
        fileid: "FS-19-111111"
      })
      .then(res => {
        this.handleDataFetch();
      });
    this.props.onShowOrHide();
  };
  componentDidMount() {
    this.handleDataFetch();
  }
  handleCardCLick = () => {
    //this.props.onPageHide();
    this.setState({
      hidePage: true
    });
  };
  handleDataFetch = () => {
    fetch(
      "https://safe-fortress-44327.herokuapp.com/api/data/getData?name=" +
        this.props.userName
    )
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };
  render() {
    const pageStyle = this.state.hidePage ? { display: "none" } : {};
    return (
      <React.Fragment>
        <div style={pageStyle}>
          <Row className="padding-top-three">
            <h2>Family Law Records</h2>
          </Row>
          <Row className="padding-top-three">
            <h3>Link a court case to your account</h3>
          </Row>
          <Row>Enter the following information provided on your notice.</Row>

          <Row className="padding-top-three">
            <Col xs={2}>
              <input className="hide-borders" placeholder="Enter 4-digit Pin" />
            </Col>
            <Col xs={1} />
            <Col xs={2}>
              <input
                className="hide-borders"
                placeholder="Enter court file number"
              />
            </Col>
          </Row>
          <Row className="padding-top-three">
            <Button onClick={() => this.handleLinkCase()}>
              Link case to account
            </Button>
          </Row>
        </div>

        <React.Fragment>
          {this.state.data[0].linked === "yes" && (
            <Home
              courtData={this.state.data}
              onCardClick={this.handleCardCLick}
              userName={this.props.userName}
              userType="general"
            />
          )}
        </React.Fragment>
        <div className="bottom-padding-two" />
      </React.Fragment>
    );
  }
}

export default AccessPin;
