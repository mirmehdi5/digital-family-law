import React from "react";
import Home from "./home";
import axios from "axios";
import { Container, Button, Row, Col } from "react-bootstrap";
import { Route, Link, BrowserRouter as Router, Switch } from "react-router-dom";
import CourtFile from "./courtFile";
class Lawyer extends React.Component {
  state = {
    data: [],
    showOrHide: false
  };
  componentDidMount() {
    fetch(
      "https://safe-fortress-44327.herokuapp.com/api/data/getDataLawyer?name=" +
        this.props.userName
    )
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  }
  handleCard = () => {
    this.props.onPageHide();
    this.setState({
      showOrHide: true
    });
  };

  handleLinkCase = () => {
    axios
      .post(
        "https://safe-fortress-44327.herokuapp.com/api/data/linklawyerCase",
        {
          fileid: "FS-19-111111"
        }
      )
      .then(res => {
        this.handleDataFetch();
      });
  };

  handleDataFetch = () => {
    fetch(
      "https://safe-fortress-44327.herokuapp.com/api/data/getDataLawyer?name=" +
        this.props.userName
    )
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };

  render() {
    const style = this.state.showOrHide ? { display: "none" } : {};
    return (
      <React.Fragment>
        <Router>
          <Container style={style}>
            <Row className="padding-top-three">
              <h2>Family Law Records</h2>
            </Row>

            <Row className="padding-top-three">
              <h3>Link a court case to your account</h3>
            </Row>
            <Row>Enter the following information provided on your notice.</Row>

            <Row className="padding-top-three">
              <Col xs={2}>
                <input
                  className="hide-borders"
                  placeholder="Enter 4-digit Pin"
                />
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
            <Row className="padding-top-three">
              <h4>Search for a court file</h4>
            </Row>
            <Row>
              <input
                className="search-bar"
                type="text"
                placeholder="Search by court file # or first and last name"
              />
            </Row>

            <Row className="padding-top-three">
              <Col xs={8}>
                <h4>Recenty viewed court filed</h4>
              </Col>
            </Row>
          </Container>

          <Container style={style} className="padding-top-three">
            <Row className="table-header border-solid no-side-margins  dark-font">
              <Col className="border-solid">
                Court file #<img src="./sort-icon.png" width="14px" />
              </Col>
              <Col className="border-solid">
                Applicant
                <img src="./sort-icon.png" width="14px" />
              </Col>
              <Col className="border-solid">
                Respondent
                <img src="./sort-icon.png" width="14px" />
              </Col>
              <Col className="border-solid">
                Court
                <img src="./sort-icon.png" width="14px" />
              </Col>
            </Row>
            {this.state.data.length <= 0 ? (
              <Row>You have no cases linked to your account</Row>
            ) : (
              this.state.data.map(
                dat =>
                  dat.sub_files.length > 0 &&
                  dat.sub_files.map(
                    record =>
                      (record.applicant_lawyer === this.props.userName ||
                        record.respondent_lawyer === this.props.userName) &&
                      (record.lawyer_linked === "yes" && (
                        <Row
                          key={dat._id}
                          className="full-width border-solid zero-margin-left padding-full-one"
                        >
                          <Col>
                            <Link
                              onClick={() => this.handleCard()}
                              to={{
                                pathname: "/courtFile",
                                state: {
                                  courtCase: dat,
                                  userName: dat.applicant,
                                  userType: "lawyer"
                                }
                              }}
                            >
                              {dat.id} {record.number}
                            </Link>
                          </Col>
                          <Col>{dat.applicant}</Col>
                          <Col>{dat.respondent}</Col>
                          <Col>{dat.courtname}</Col>
                        </Row>
                      ))
                  )
              )
            )}
          </Container>
          <div className="bottom-padding-two " />
          <Switch>
            <Route path="/courtFile" component={CourtFile} />
          </Switch>
        </Router>
      </React.Fragment>
    );
  }
  handleCardCLick = () => {
    this.props.onPageHide();
  };
}
export default Lawyer;
