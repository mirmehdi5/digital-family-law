import React, { Component } from "react";

import { Container, Col, Row, Button } from "react-bootstrap";
class HomeCards extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <Container>
          <Row className="padding-top-two">
            <h2>Family Law Services</h2>
          </Row>
          <Row className="padding-top-two">
            <Col xs={4}>
              <div className="card home-card" onClick={this.handleCardClick}>
                <span className="padding-top-one card-container ">
                  <h4>Family Law Records</h4>
                </span>
                <span className="card-container padding-top-one">
                  View and add documents to your existing court case. You will
                  need a pin number provided to you by the court to open your
                  court case.
                </span>
                <span className="padding-top-two home-card-button">
                  <Button>Manage existing cases</Button>
                </span>
              </div>
            </Col>

            <Col xs={4}>
              <div className="card home-card">
                <span className="padding-top-one card-container ">
                  <h4>File a joint divorce</h4>
                </span>
                <span className="card-container padding-top-one">
                  You and your spouse apply for a divorce and any other court
                  orders together because you both agree to a divorce and on all
                  other family law matters
                </span>
                <span className="padding-top-two home-card-button">
                  <Button>Start new application</Button>
                </span>
              </div>
            </Col>

            <Col xs={4}>
              <div className="card home-card">
                <span className="padding-top-one card-container ">
                  <h4>File a divorce by yourself</h4>
                </span>
                <span className="card-container padding-top-one">
                  Apply for a divorce on your own because you and your spouse
                  can't agree to a divorce and you're NOT asking for any other
                  court orders.
                </span>
                <span className="padding-top-two home-card-button">
                  <Button>Start new application</Button>
                </span>
              </div>
            </Col>
          </Row>
          <Row className="padding-top-two">
            <Col xs={4}>
              <div className="card home-card">
                <span className="padding-top-one card-container ">
                  <h4>Future Services</h4>
                </span>
                <span className="card-container padding-top-one">
                  lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </span>
                <span className="padding-top-two home-card-button">
                  <Button>Enter service</Button>
                </span>
              </div>
            </Col>

            <Col xs={4}>
              <div className="card home-card">
                <span className="padding-top-one card-container ">
                  <h4>Future Services</h4>
                </span>
                <span className="card-container padding-top-one">
                  lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </span>
                <span className="padding-top-two home-card-button">
                  <Button>Enter service</Button>
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
  handleCardClick = () => {
    this.props.onCardClick();
  };
}

export default HomeCards;
