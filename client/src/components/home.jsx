import React, { Component } from "react";
import CourtFile from "./courtFile";
import { Route, Link, BrowserRouter as Router, Switch } from "react-router-dom";
import { Container, Col, Row, Button } from "react-bootstrap";

class Home extends Component {
  state = {
    data: this.props.courtData,
    showOrHide: false
  };
  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.courtData });
  }
  render() {
    const style = this.state.showOrHide ? { display: "none" } : {};
    const { data } = this.state;
    return (
      <Router>
        <Row style={style} className="padding-top-three">
          {data.length <= 0
            ? "NO DB ENTRIES YET"
            : data.map(dat =>
                this.props.userName === "lawyer" ? (
                  <Link
                    key={dat.id}
                    className="card"
                    onClick={this.handleCard}
                    to={{
                      pathname: "/courtFile",
                      state: {
                        courtCase: dat,
                        userName: dat.applicant,
                        userType: this.props.userType
                      }
                    }}
                  >
                    <Row>
                      <span className="card-container">
                        <b>Court file #: </b>
                        {dat.id}
                      </span>
                    </Row>
                    <Row>
                      <b>Court :</b> Family - Superior Court of Justice
                    </Row>
                    <Row>85 Frederick St</Row>
                    <Row>Kitchener, ON N2H 0A7</Row>
                    <Row>519-741-3200/3300</Row>
                    <hr />
                    <div className="card-container">
                      <span>Applicant: {dat.applicant}</span>
                      <br />
                      <span>Respondent: {dat.respondent}</span>
                    </div>
                  </Link>
                ) : (
                  <Link
                    key={dat.id}
                    className="card"
                    onClick={this.handleCard}
                    to={{
                      pathname: "/courtFile",
                      state: {
                        courtCase: dat,
                        userName: this.props.userName,
                        userType: this.props.userType
                      }
                    }}
                  >
                    <span className="card-container">
                      <div className="card-container">
                        <Row>
                          <b>Court file #: </b>
                          {dat.id}
                        </Row>
                        <Row>
                          <b>Court :</b> Family - Superior Court of Justice
                        </Row>
                        <Row>85 Frederick St</Row>
                        <Row>Kitchener, ON N2H 0A7</Row>
                        <Row>519-741-3200/3300</Row>
                      </div>
                      <hr />
                      <div>
                        <Row className="card-container">
                          <Col>
                            <Row>
                              <span>
                                <b>Applicant: </b>
                                {dat.applicant}
                              </span>
                            </Row>
                            <Row>Address</Row>
                            <Row>City, ON X#X #X#</Row>
                            <Row>###-###-####</Row>
                            <Row>tony@gmail.com</Row>
                            <Row>
                              <b>Applicant's lawyer on record</b>
                            </Row>
                            <Row>Eric Hall</Row>
                            <Row>Address</Row>
                            <Row>City, ON X#X #X#</Row>
                            <Row>###-###-####</Row>
                            <Row>eric@hallassociates.com</Row>
                          </Col>

                          <Col>
                            <Row>
                              <span>
                                <b>Respondent:</b> {dat.respondent}
                              </span>
                            </Row>
                            <Row>Address</Row>
                            <Row>City, ON X#X #X#</Row>
                            <Row>###-###-####</Row>
                            <Row>maria@gmail.com</Row>
                            <Row>
                              <b>Respondent's lawyer on record</b>
                            </Row>
                            <Row>Melene Kash</Row>
                            <Row>Address</Row>
                            <Row>City, ON X#X #X#</Row>
                            <Row>###-###-####</Row>
                            <Row>mkash@kashassociates.com</Row>
                          </Col>
                        </Row>
                        <div className="padding-left-thirteen">
                          <Row className="padding-top-three">
                            <b>Date started: </b>08/01/2019
                          </Row>
                          <Row>
                            <Button
                              color="dark"
                              style={{ marginTop: "2rem", width: "8rem" }}
                            >
                              View
                            </Button>
                          </Row>
                        </div>
                      </div>
                    </span>
                  </Link>
                )
              )}
        </Row>
        <Switch>
          <Route path="/courtFile" component={CourtFile} />
        </Switch>
      </Router>
    );
  }
  handleCard = () => {
    this.props.onCardClick();
    this.setState({
      showOrHide: true
    });
  };
}

export default Home;
