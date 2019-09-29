import React, { Component } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";

class Header extends Component {
  state = {};

  render() {
    return (
      <React.Fragment>
        <Row className="padding-top-two">
          <Col xs={1}>
            <img src="./logo.png" className="logo-width" />
          </Col>
          <Col xs={6} onClick={this.props.onLogoClick}>
            <h1>Family Law Services</h1>
          </Col>
          <Col xs={1}>
            <Button>français</Button>
          </Col>

          <Col xs={1}>{this.props.userName}</Col>
          <Col xs={1}>
            {this.props.userName !== "" && (
              <img src="./setting.png" width="40px" />
            )}
          </Col>
          <Col xs={1}>
            <img src="./grid.png" width="40px" />
          </Col>
          <Col xs={1}>
            {this.props.userName !== "" && (
              <Row>
                <a href onClick={this.handleLogout} className="anchor-color">
                  Logout
                </a>
              </Row>
            )}
          </Col>
        </Row>

        <hr />
      </React.Fragment>
    );
  }
  handleLogout = () => {
    window.open(
      "http://internal.demo-prototype.ontariogovernment.ca/dfl/",
      "_self"
    );
  };
}

export default Header;
